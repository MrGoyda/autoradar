'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { sendTelegramMessage } from '@/lib/telegram'
import { headers } from 'next/headers'
import { Database } from '@/types/supabase'

const kzPhoneRegex = /^(?:\+7|8)?\s?\(?\d{3}\)?\s?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/

const Schema = z.object({
  description: z.string()
    .min(5, 'Опишите деталь подробнее')
    .max(500, 'Описание слишком длинное')
    .trim(),
  phone: z.string()
    .regex(kzPhoneRegex, 'Введите корректный номер Казахстана (+7...)'),
})

type LeadRow = Database['public']['Tables']['leads']['Row']
type SellerRow = Pick<Database['public']['Tables']['sellers']['Row'], 'telegram_id'>

export async function createLead(formData: FormData) {
  const supabase = await createClient()
  
  // 1. ПРОВЕРКА RATE LIMIT
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
  
  const { count } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('utm_source', ip)
    .gt('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())

  if (count && count >= 3) {
    return { error: 'Слишком много заявок. Подождите 15 минут.' }
  }

  const rawData = {
    description: formData.get('description') as string,
    phone: formData.get('phone') as string,
  }

  const validatedFields = Schema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      error: 'Ошибка валидации',
      fields: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 2. СОХРАНЕНИЕ В БАЗУ
  const leadData = {
    description: validatedFields.data.description,
    client_phone: validatedFields.data.phone, // Телефон сохраняем В БАЗУ для тебя
    status: 'new' as const,
    utm_source: ip,
    photos: [] 
  }

  const { data: newLead, error: dbError } = await supabase
    .from('leads')
    .insert(leadData as any)
    .select()
    .single()

  if (dbError || !newLead) {
    console.error('Supabase Error:', dbError)
    return { error: 'Системная ошибка. Попробуйте позже.' }
  }

  const typedLead = newLead as LeadRow

  // 3. АНОНИМНАЯ РАССЫЛКА С КНОПКАМИ (Телефон здесь НЕ отправляем)
  const { data: sellers } = await supabase
    .from('sellers')
    .select('telegram_id')
    .eq('is_active', true)

  if (sellers?.length) {
    const typedSellers = sellers as SellerRow[]
    
    // Формируем текст БЕЗ ТЕЛЕФОНА
    const message = `
📦 <b>НОВАЯ ЗАЯВКА #${typedLead.id.slice(0, 8)}</b>

🛠 <b>Деталь:</b> ${validatedFields.data.description}
📍 <b>Город:</b> Астана

<i>Нажмите кнопку ниже, чтобы предложить цену. Клиент не увидит ваш номер до подтверждения.</i>
    `
    
    // Настраиваем кнопки
    const keyboard = {
      inline_keyboard: [
        [
          { text: '💰 Предложить цену', callback_data: `offer_${typedLead.id}` },
          { text: '❌ Нет в наличии', callback_data: `no_stock_${typedLead.id}` }
        ]
      ]
    }
    
    await Promise.allSettled(
      typedSellers.map(s => sendTelegramMessage(s.telegram_id, message, keyboard))
    )
  }

  redirect('/success?type=search')
}