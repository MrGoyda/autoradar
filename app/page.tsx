import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Camera, Zap, ShieldCheck, Wallet, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    // 1. УБРАЛ bg-zinc-950 отсюда (он перекрывал кольца)
    <div className="min-h-screen bg-cyber-grid bg-cyber-grid-size text-white selection:bg-radar-blue/30 font-sans relative overflow-x-hidden">
      
      {/* --- ГЛОБАЛЬНЫЙ СВЕТ (Ambient) --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-radar-blue/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center bg-zinc-900 border border-white/10 rounded-xl overflow-hidden group-hover:border-radar-blue/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-radar-blue/20 to-radar-purple/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Search className="w-5 h-5 text-white relative z-10" />
            </div>
            <span className="font-bold text-xl tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Autoradar
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="hidden md:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Продавцам
            </Link>
            <Link href="/search">
              <Button variant="outline" size="sm" className="border-radar-blue/30 text-radar-blue hover:bg-radar-blue/10 hover:text-white backdrop-blur-md transition-all">
                Найти деталь
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 max-w-5xl mx-auto flex flex-col items-center text-center mb-32">
          
        {/* ЭФФЕКТ РАДАРА (ИСПРАВЛЕНО СМЕЩЕНИЕ) */}
          {/* 1. Внешняя обертка: Отвечает ТОЛЬКО за позицию (Центрирование) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             
             {/* 2. Внутренняя обертка: Отвечает за РАЗМЕР и ДЫХАНИЕ (animate-radar-pulse) */}
             <div className="w-[600px] h-[600px] animate-radar-pulse relative">
                
                 {/* Внешнее кольцо */}
                 <div className="absolute inset-0 border border-radar-blue/50 rounded-full animate-radar-spin" />
                 
                 {/* Внутреннее кольцо */}
                 <div className="absolute inset-[15%] border border-radar-purple/40 rounded-full animate-radar-reverse" />
                 
                 {/* Центральный круг */}
                 <div className="absolute inset-[40%] border border-white/20 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.2)]" />
                 
             </div>
          </div>
          {/* КОНТЕНТ (Важно: relative z-10, чтобы текст был ПОВЕРХ колец) */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                System Online • 150+ баз
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50">
                Весь авторынок
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-br from-radar-blue via-white to-radar-purple drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                в одном клике.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-12">
              Агрегатор автозапчастей нового поколения. <br className="hidden md:inline"/>
              Не звони — просто нажми кнопку.
            </p>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {/* Manual Search (Active) */}
              <Link href="/search" className="group relative overflow-hidden bg-zinc-900/80 hover:bg-zinc-900 border border-white/10 p-6 rounded-2xl transition-all duration-300 hover:border-radar-blue/50 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-radar-blue/10 rounded-xl text-radar-blue group-hover:bg-radar-blue group-hover:text-white transition-colors">
                    <Search className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:translate-x-1 transition-transform group-hover:text-radar-blue" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-radar-blue transition-colors">Поиск по названию</h3>
                  <p className="text-sm text-zinc-500">VIN, номер кузова или название</p>
                </div>
              </Link>

              {/* AI Vision Search (Locked) */}
              <div className="group relative overflow-hidden bg-zinc-900/40 border border-white/5 p-6 rounded-2xl opacity-60 cursor-not-allowed">
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-500">Soon</div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-zinc-800/50 rounded-xl text-zinc-500 grayscale">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-zinc-500 mb-1">Поиск по фото</h3>
                  <p className="text-sm text-zinc-600">AI Vision определит деталь</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- STATS / LOGOS --- */}
        <section className="border-y border-white/5 bg-white/[0.02] py-12 mb-32 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="text-2xl font-bold font-serif tracking-tighter">TOYOTA</span>
            <span className="text-2xl font-bold font-mono">BMW Service</span>
            <span className="text-2xl font-black italic">MERCEDES</span>
            <span className="text-2xl font-semibold">Lexus</span>
            <span className="text-2xl font-bold tracking-[0.2em]">KIA</span>
          </div>
        </section>

        {/* --- FEATURES --- */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Технологии поиска
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              title="Turbo Mode"
              desc="Алгоритм мгновенно рассылает запрос всем активным продавцам в радиусе города."
            />
            <FeatureCard 
              icon={<Wallet className="w-6 h-6 text-green-400" />}
              title="Smart Bidding"
              desc="Продавцы видят конкуренцию и предлагают лучшую цену, чтобы забрать ваш заказ."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-radar-blue" />}
              title="Verified Only"
              desc="Мы фильтруем продавцов. В системе только проверенные разборы с рейтингом."
            />
          </div>
        </section>

        {/* --- STEPS --- */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
          <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden relative backdrop-blur-md">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-radar-purple/10 rounded-full blur-[100px] pointer-events-none" />
            
            <h2 className="text-3xl font-bold mb-10 relative z-10">Как это работает</h2>
            <div className="space-y-8 relative z-10 border-l border-white/10 pl-8 ml-4">
              <Step number="01" text="Создайте заявку (текст или фото)" />
              <Step number="02" text="Система оповестит 150+ складов" />
              <Step number="03" text="Получите предложения в Telegram" />
            </div>

            <div className="mt-12 relative z-10 pl-4">
               <Link href="/search">
                <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-md h-14 px-8 rounded-xl shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] transition-shadow">
                  Запустить поиск <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-zinc-950 py-12 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
              <span className="font-bold text-xs">A</span>
            </div>
            <span className="font-bold text-lg">Autoradar</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link href="#" className="hover:text-radar-blue transition-colors">Оферта</Link>
            <Link href="#" className="hover:text-radar-blue transition-colors">Продавцам</Link>
            <Link href="#" className="hover:text-radar-blue transition-colors">Support</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-radar-blue/30 hover:bg-zinc-900/50 transition-all duration-300 group">
      <div className="w-14 h-14 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-radar-blue transition-colors">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}

function Step({ number, text }: { number: string, text: string }) {
  return (
    <div className="flex items-center gap-6 relative group">
      <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-900 border border-white/20 group-hover:border-radar-blue group-hover:bg-radar-blue transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
      <span className="text-4xl font-bold text-zinc-800 font-mono group-hover:text-white/20 transition-colors">{number}</span>
      <span className="text-lg text-zinc-300 font-medium group-hover:text-white transition-colors">{text}</span>
    </div>
  )
}