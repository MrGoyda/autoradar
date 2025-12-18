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
  try {
    const supabase = await createClient<Database>()
    const user = ctx.from
    if (!user) return await ctx.reply('Ошибка определения пользователя.')

    console.log(`[BOT] Start command from: ${user.id}`)

    const { data: existingSeller } = await supabase
      .from('sellers')
      .select('id')
      .eq('telegram_id', user.id)
      .maybeSingle()

    if (existingSeller) {
      return await ctx.reply('С возвращением! Вы уже в системе Autoradar. 📡')
    }

    const newSeller: SellerInsert = {
      telegram_id: user.id,
      name: user.first_name || 'Неизвестный',
      is_active: true,
      last_active_lead_id: null
    }

    const { error } = await (supabase.from('sellers') as any).insert(newSeller)

    if (error) {
      console.error('[BOT] DB Registration Error:', error)
      return await ctx.reply('Ошибка регистрации в базе данных.')
    }

    return await ctx.reply('Добро пожаловать в Autoradar! 🚗\nТеперь вы будете получать заявки.')
  } catch (err) {
    console.error('[BOT] Start crash:', err)
  }
})

// --- CALLBACK QUERIES: Обработка кнопок ---
bot.on('callback_query', async (ctx) => {
  try {
    const supabase = await createClient<Database>()
    const cbData = (ctx.callbackQuery as { data: string }).data
    const telegramId = ctx.from?.id

    if (!telegramId || !cbData) return

    if (cbData.startsWith('offer_')) {
      const leadId = cbData.replace('offer_', '')
      const updateContext: SellerUpdate = { last_active_lead_id: leadId }

      const { error } = await (supabase.from('sellers') as any)
        .update(updateContext)
        .eq('telegram_id', telegramId)

      if (error) return await ctx.answerCbQuery('Ошибка обновления данных')

      await ctx.answerCbQuery()
      return await ctx.reply('Введите вашу цену за деталь (только число):')
    }

    if (cbData.startsWith('no_stock_')) {
      await ctx.answerCbQuery()
      return await ctx.editMessageText('✅ Отмечено: детали нет в наличии.')
    }
  } catch (err) {
    console.error('[BOT] Callback crash:', err)
  }
})

// --- TEXT MESSAGES: Прием цены ---
bot.on('text', async (ctx) => {
  try {
    const supabase = await createClient<Database>()
    const text = ctx.message.text.trim()
    const telegramId = ctx.from.id

    if (!/^\d+$/.test(text)) {
      return await ctx.reply('Пожалуйста, введите только числовое значение цены.')
    }

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

      const { error: offerError } = await (supabase.from('offers') as any).insert(newOffer)

      if (offerError) {
        console.error('[BOT] Offer insert error:', offerError)
        return await ctx.reply('❌ Ошибка сохранения цены.')
      }

      const resetContext: SellerUpdate = { last_active_lead_id: null }
      await (supabase.from('sellers') as any).update(resetContext).eq('telegram_id', telegramId)

      return await ctx.reply(`✅ Цена ${price.toLocaleString()} KZT принята!`)
    }

    return await ctx.reply('Сначала нажмите кнопку "Предложить цену" под активной заявкой.')
  } catch (err) {
    console.error('[BOT] Text crash:', err)
  }
})

// --- WEBHOOK HANDLER (PATCHED FOR VERCEL) ---
export async function POST(request: Request) {
  try {
    const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token')
    
    // Лог для проверки в консоли Vercel
    console.log('--- NEW WEBHOOK REQUEST ---')

    if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      console.error('Unauthorized attempt: token mismatch')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Payload:', JSON.stringify(body))

    // ВАЖНО: Дожидаемся обработки, иначе Vercel убьет функцию раньше времени
    await bot.handleUpdate(body)
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('CRITICAL BOT ERROR:', error)
    // Возвращаем 200, чтобы Telegram перестал слать это битое сообщение
    return NextResponse.json({ ok: true }) 
  }
}