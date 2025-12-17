import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Заявка принята!</h1>
      <p className="text-zinc-400 max-w-md mb-8">
        Мы уже отправили ваш запрос продавцам в Астане. <br/>
        Как только появятся цены, мы свяжемся с вами.
      </p>
      <Link href="/">
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
          Вернуться на главную
        </Button>
      </Link>
    </main>
  )
}