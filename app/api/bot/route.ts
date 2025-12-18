import { Telegraf } from 'telegraf'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'



// Инициализация бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)

// Логика обработки команды /start
bot.start(async (ctx) => {
  const supabase = await createClient()
  const user = ctx.from
  
  if (!user) return ctx.reply('Ошибка определения пользователя.')

  const telegramId = user.id
  const username = user.first_name || 'Неизвестный'

  // 1. Проверяем, есть ли продавец в базе
  const { data: existingSeller } = await supabase
    .from('sellers')
    .select('id')
    .eq('telegram_id', telegramId)
    .single()

  if (existingSeller) {
    return ctx.reply(`С возвращением, ${username}! Ты уже в системе Autoradar. Жди новых заявок. 📡`)
  }

  // 2. Если нет — регистрируем
  // Используем "as any", чтобы TypeScript не блокировал запись
  const newSeller = {
    telegram_id: telegramId,
    name: username,
    specialization: ['General'],
    is_active: true
  }

  const { error } = await supabase
    .from('sellers')
    .insert(newSeller as any)

  if (error) {
    console.error('Registration Error:', error)
    return ctx.reply('Ошибка регистрации. Попробуй позже.')
  }

  return ctx.reply(`Добро пожаловать в Autoradar, ${username}! 🚗\nТеперь ты будешь получать заявки на запчасти.`)
})

// Обработчик входящих запросов от Telegram (Webhook)
export async function POST(request: Request) {
  try {
    // ПРОВЕРКА СЕКРЕТНОГО ТОКЕНА
    const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token')
    if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      console.warn('Unauthorized bot access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Bot Error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

// Добавь обработчик callback_query
bot.on('callback_query', async (ctx) => {
  const data = (ctx.callbackQuery as any).data
  
  if (data.startsWith('offer_')) {
    const leadId = data.replace('offer_', '')
    
    // Сохраняем временное состояние (какую заявку комментирует продавец)
    // В идеале использовать Redis, но для начала можно через сессию Telegraf или просто переспросить
    await ctx.answerCbQuery()
    return ctx.reply(`Введите стоимость детали для заявки #${leadId.slice(0, 8)} (только цифры):`)
  }

  if (data.startsWith('no_stock_')) {
    await ctx.answerCbQuery('Принято')
    return ctx.editMessageText('Вы отметили, что детали нет в наличии. Спасибо!')
  }
})

// Обработчик текстовых сообщений (прием цены)
bot.on('text', async (ctx) => {
  const text = ctx.message.text
  const sellerId = ctx.from.id

  if (/^\d+$/.test(text)) {
    // Если пришло число — это цена. 
    // Тут логика: нужно понять к какому leadId эта цена относится.
    // Для MVP можно запрашивать цену в формате "ID Цена", 
    // Но лучше хранить "состояние" продавца в базе данных (поле last_active_lead в таблице sellers).
    
    return ctx.reply(`Цена ${text} KZT принята! Мы сообщим вам, если клиент выберет ваше предложение.`)
  }
})