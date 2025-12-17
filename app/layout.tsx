import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from "@/components/ui/sonner" // <--- Импортируем Toaster

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Autoradar — Поиск запчастей в Астане',
  description: 'Агрегатор автозапчастей. Находим детали за 15 минут.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="dark">
      <body className={cn(
        inter.className, 
        "bg-zinc-950 text-zinc-50 antialiased min-h-screen"
      )}>
        {children}
        <Toaster position="top-center" /> {/* <--- Добавляем его сюда */}
      </body>
    </html>
  )
}