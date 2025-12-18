import { Telegraf } from 'telegraf'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

// 1. Инициализация бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)

// 2. Вспомогательные типы
type SellerRow = Database['public']['Tables']['sellers']['Row']
type SellerInsert = Database['public']['Tables']['sellers']['Insert']
type SellerUpdate = Database['public']['Tables']['sellers']['Update']
type OfferInsert = Database['public']['Tables']['offers']['Insert']

// --- START: Регистрация продавца ---
bot.start(async (ctx) => {
  const supabase = await createClient<Database>()
  const user = ctx.from
  if (!user) return ctx.reply('Ошибка определения пользователя.')

  const { data: existingSeller } = await supabase
    .from('sellers')
    .select('id')
    .eq('telegram_id', user.id)
    .maybeSingle()

  if (existingSeller) {
    return ctx.reply('С возвращением! Вы уже в системе Autoradar. 📡')
  }

  const newSeller: SellerInsert = {
    telegram_id: user.id,
    name: user.first_name || 'Неизвестный',
    is_active: true,
    last_active_lead_id: null
  }

  // Обход ошибки never через двойное приведение инстанса таблицы
  const { error } = await (supabase.from('sellers') as any).insert(newSeller)

  if (error) return ctx.reply('Ошибка регистрации. Попробуйте позже.')
  return ctx.reply('Добро пожаловать в Autoradar! 🚗\nТеперь вы будете получать заявки.')
})

// --- CALLBACK QUERIES: Обработка кнопок ---
bot.on('callback_query', async (ctx) => {
  const supabase = await createClient<Database>()
  const cbData = (ctx.callbackQuery as { data: string }).data
  const telegramId = ctx.from?.id

  if (!telegramId || !cbData) return

  if (cbData.startsWith('offer_')) {
    const leadId = cbData.replace('offer_', '')

    const updateContext: SellerUpdate = {
      last_active_lead_id: leadId
    }

    // Обход ошибки never для метода update
    const { error } = await (supabase.from('sellers') as any)
      .update(updateContext)
      .eq('telegram_id', telegramId)

    if (error) return ctx.answerCbQuery('Ошибка обновления данных')

    await ctx.answerCbQuery()
    return ctx.reply('Введите вашу цену за деталь (только число):')
  }

  if (cbData.startsWith('no_stock_')) {
    await ctx.answerCbQuery()
    return ctx.editMessageText('✅ Отмечено: детали нет в наличии.')
  }
})

// --- TEXT MESSAGES: Прием цены ---
bot.on('text', async (ctx) => {
  const supabase = await createClient<Database>()
  const text = ctx.message.text.trim()
  const telegramId = ctx.from.id

  if (!/^\d+$/.test(text)) {
    return ctx.reply('Пожалуйста, введите только числовое значение цены.')
  }

  // Принудительно типизируем результат через as
  const { data } = await supabase
    .from('sellers')
    .select('*')
    .eq('telegram_id', telegramId)
    .maybeSingle()
  
  const seller = data as SellerRow | null

  if (seller && seller.last_active_lead_id) {
    const price = parseInt(text)

    const newOffer: OfferInsert = {
      lead_id: seller.last_active_lead_id,
      seller_id: seller.id,
      price_vendor: price,
      comment: 'Ответ через Telegram-бота',
      is_winner: false
    }

    // Обход ошибки never для создания оффера
    const { error: offerError } = await (supabase.from('offers') as any).insert(newOffer)

    if (offerError) {
      console.error('Offer error:', offerError)
      return ctx.reply('❌ Ошибка сохранения цены.')
    }

    const resetContext: SellerUpdate = {
      last_active_lead_id: null
    }

    // Обход ошибки never для сброса контекста
    await (supabase.from('sellers') as any)
      .update(resetContext)
      .eq('telegram_id', telegramId)

    return ctx.reply(`✅ Цена ${price.toLocaleString()} KZT принята! Мы сообщим вам решение клиента.`)
  }

  return ctx.reply('Сначала нажмите кнопку "Предложить цену" под активной заявкой.')
})

// --- WEBHOOK HANDLER ---
export async function POST(request: Request) {
  try {
    const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token')
    
    if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
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