'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { sendTelegramMessage } from '@/lib/telegram'

const Schema = z.object({
  description: z.string().min(5, 'Минимум 5 символов'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
})

export async function createLead(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    description: formData.get('description') as string,
    phone: formData.get('phone') as string,
  }

  const validatedFields = Schema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      error: 'Заполните поля корректно',
      fields: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 1. Сохраняем заявку в базу
  const leadData = {
    description: validatedFields.data.description,
    client_phone: validatedFields.data.phone,
    status: 'new',
    utm_source: 'site_search',
    photos: [] 
  }

  // Вставляем и получаем ID
  // ДОБАВЛЕНО: "as any" в конце цепочки, чтобы TS не ругался на newLead.id
  const { data: newLead, error } = await supabase
    .from('leads')
    .insert(leadData as any)
    .select()
    .single() as any 

  if (error) {
    console.error('Supabase Error:', error)
    return { error: 'Ошибка сохранения. Попробуйте позже.' }
  }

  // -------------------------------------------------------
  // 2. БЛОК РАССЫЛКИ
  // -------------------------------------------------------
  
  // Получаем продавцов
  // ДОБАВЛЕНО: "as any" в конце цепочки, чтобы TS не ругался на seller.telegram_id
  const { data: sellers } = await supabase
    .from('sellers')
    .select('telegram_id')
    .eq('is_active', true) as any

  if (sellers && sellers.length > 0) {
    // Формируем текст
    const message = `
⚡️ <b>Новая заявка!</b>

🚙 <b>Описание:</b> ${validatedFields.data.description}
📞 <b>Клиент:</b> ${validatedFields.data.phone}

🆔 ID заявки: <code>${newLead?.id || 'Неизвестно'}</code>
    `

    // Рассылаем
    await Promise.all(
      sellers.map((seller: any) => sendTelegramMessage(seller.telegram_id, message))
    )
  }

  // 3. Редирект
  redirect('/success?type=search')
}