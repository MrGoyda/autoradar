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
    const body = await request.json()
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Bot Error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}