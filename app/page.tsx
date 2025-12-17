import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Camera } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950 text-white selection:bg-blue-500/30">
      
      {/* Фоновые градиенты (Ambient Light) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-md px-6 flex flex-col items-center text-center space-y-8">
        
        {/* Логотип / Бейдж */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">System Online • Astana</span>
        </div>

        {/* Заголовки (Typography) */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Autoradar
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Находим автозапчасти за 15 минут. <br/> Просто загрузи фото или напиши VIN.
          </p>
        </div>

        {/* Карточка действия (CTA Card) */}
        <div className="w-full bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-4">
          
          {/* Кнопка поиска текстом */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <Link href="/search" className="relative flex items-center gap-4 w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-xl transition-all duration-200">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Search className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-white">Поиск по названию</span>
                <span className="text-xs text-zinc-500">Например: Бампер Camry 70</span>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 ml-auto" />
            </Link>
          </div>

          {/* Кнопка поиска по фото (AI Vision) */}
          <div className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <Link href="/scan" className="relative flex items-center gap-4 w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-xl transition-all duration-200">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-white">Распознать по фото</span>
                <span className="text-xs text-zinc-500">AI определит деталь автоматически</span>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 ml-auto" />
            </Link>
          </div>

        </div>

        {/* Футер */}
        <p className="text-xs text-zinc-600">
          Работаем с 120+ продавцами в Астане
        </p>

      </div>
    </main>
  )
}