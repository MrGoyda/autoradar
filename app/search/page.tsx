'use client'

import { useState } from 'react'
import { createLead } from './actions' 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from "sonner" // <--- Новый импорт

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    
    const result = await createLead(formData)
    
    if (result?.error) {
      // Новый синтаксис уведомления об ошибке
      toast.error("Ошибка отправки", {
        description: result.error,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none'
        }
      })
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Фон */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Кнопка Назад */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </Link>
      </div>

      <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800 backdrop-blur-xl p-8 shadow-2xl z-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Поиск детали</h1>
          <p className="text-zinc-400 text-sm">Опишите, что вы ищете, и продавцы сами предложат цены.</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-300">Что ищем?</Label>
            <Textarea 
              name="description" 
              id="description" 
              placeholder="Например: Передний бампер на Toyota Camry 70, 2020 год, цвет белый перламутр..." 
              className="bg-zinc-950/50 border-zinc-700 text-white min-h-[100px] focus:border-blue-500 transition-colors placeholder:text-zinc-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-zinc-300">Ваш телефон</Label>
            <Input 
              type="tel" 
              name="phone" 
              id="phone" 
              placeholder="+7 (7xx) xxx xx xx" 
              className="bg-zinc-950/50 border-zinc-700 text-white focus:border-blue-500 transition-colors placeholder:text-zinc-600"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-6 text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Отправляем...
              </>
            ) : (
              'Найти запчасть'
            )}
          </Button>

        </form>
      </Card>
    </main>
  )
}