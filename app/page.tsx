import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Camera, Zap, ShieldCheck, Wallet, ChevronRight, MessageCircle, Truck, FileText } from 'lucide-react'

// Список брендов для бегущей строки (можно повторять для длинны)
const BRANDS = [
  "Toyota", "BMW", "Mercedes-Benz", "Lexus", "Kia", "Hyundai", 
  "Audi", "Volkswagen", "Nissan", "Chevrolet", "Ford", "Land Rover",
  "Porsche", "Mazda", "Subaru", "Honda", "Skoda", "Volvo"
]

export default function Home() {
  return (
    <div className="min-h-screen bg-cyber-grid bg-cyber-grid-size text-white selection:bg-radar-blue/30 font-sans relative overflow-x-hidden">
      
      {/* --- ГЛОБАЛЬНЫЙ СВЕТ --- */}
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
        <section className="relative px-6 max-w-5xl mx-auto flex flex-col items-center text-center mb-24">
          
          {/* ЭФФЕКТ РАДАРА */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <div className="w-[600px] h-[600px] animate-radar-pulse relative">
                 <div className="absolute inset-0 border border-radar-blue/50 rounded-full animate-radar-spin" />
                 <div className="absolute inset-[15%] border border-radar-purple/40 rounded-full animate-radar-reverse" />
                 <div className="absolute inset-[40%] border border-white/20 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.2)]" />
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                System Online • 150+ складов
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
              Не трать время на обзвон разборов. Оставь заявку — продавцы сами предложат лучшую цену в течение 15 минут.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
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

              <div className="group relative overflow-hidden bg-zinc-900/40 border border-white/5 p-6 rounded-2xl opacity-60 cursor-not-allowed">
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-500">Скоро</div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-zinc-800/50 rounded-xl text-zinc-500 grayscale">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-zinc-500 mb-1">Поиск по фото</h3>
                  <p className="text-sm text-zinc-600">ИИ распознает деталь по снимку</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- MARQUEE (БЕГУЩАЯ СТРОКА) --- */}
        <section className="py-10 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm mb-32 relative overflow-hidden">
          {/* Градиенты по бокам для плавного исчезновения */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-950 to-transparent z-10" />
          
          <div className="flex flex-col items-center mb-6 relative z-10">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Поддерживаем все марки</span>
          </div>

          <div className="flex w-full overflow-hidden whitespace-nowrap mask-image-linear-gradient">
            <div className="flex animate-scroll min-w-full gap-16 items-center">
              {/* Первый набор брендов */}
              {BRANDS.map((brand, i) => (
                <span key={i} className="text-2xl font-bold text-zinc-600 hover:text-white transition-colors cursor-default uppercase font-mono tracking-tighter">
                  {brand}
                </span>
              ))}
              {/* Дубликат для бесшовности */}
              {BRANDS.map((brand, i) => (
                <span key={`dup-${i}`} className="text-2xl font-bold text-zinc-600 hover:text-white transition-colors cursor-default uppercase font-mono tracking-tighter">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURES (РУСИФИЦИРОВАНО) --- */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
            Технологии поиска
          </h2>
          <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-16">
            Мы объединили современные алгоритмы и проверенных поставщиков, чтобы вы получали запчасти быстрее и дешевле.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              title="Турбо-поиск"
              desc="Ваша заявка мгновенно разлетается по всем подключенным авторазборам и магазинам города."
            />
            <FeatureCard 
              icon={<Wallet className="w-6 h-6 text-green-400" />}
              title="Честный аукцион"
              desc="Продавцы видят конкуренцию и снижают цены, чтобы вы выбрали именно их предложение."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-radar-blue" />}
              title="Только проверенные"
              desc="Мы вручную проверяем каждого продавца. Рейтинг и отзывы гарантируют безопасность сделки."
            />
          </div>
        </section>

        {/* --- HOW IT WORKS (ОБНОВЛЕНО) --- */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-12">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Как это работает?</h2>
              <p className="text-zinc-400">Путь от заявки до детали занимает 3 шага</p>
            </div>
            <Link href="/search">
              <Button className="bg-white text-zinc-950 hover:bg-zinc-200">
                Начать поиск <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Линия соединения (видна только на десктопе) */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-radar-blue/0 via-radar-blue/30 to-radar-blue/0 -z-10" />

            <StepCard 
              number="01" 
              icon={<FileText className="w-6 h-6 text-radar-blue" />}
              title="Оставьте заявку" 
              desc="Опишите деталь или просто прикрепите фото. Укажите марку и модель авто."
            />
            <StepCard 
              number="02" 
              icon={<MessageCircle className="w-6 h-6 text-radar-purple" />}
              title="Сравните цены" 
              desc="Получите предложения с фото и ценами от разных продавцов в WhatsApp или на сайте."
            />
            <StepCard 
              number="03" 
              icon={<Truck className="w-6 h-6 text-green-400" />}
              title="Заберите деталь" 
              desc="Выберите лучший вариант, свяжитесь с продавцом и договоритесь о доставке."
            />
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
            <Link href="#" className="hover:text-radar-blue transition-colors">Поддержка</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

// --- НОВЫЕ КОМПОНЕНТЫ ---

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-radar-blue/30 hover:bg-zinc-900/50 transition-all duration-300 group hover:-translate-y-1">
      <div className="w-14 h-14 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-radar-blue transition-colors">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}

function StepCard({ number, icon, title, desc }: { number: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="relative p-6 rounded-2xl bg-zinc-950 border border-white/10 hover:border-radar-blue/40 transition-colors z-10 group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-radar-blue/50 transition-colors">
          {icon}
        </div>
        <span className="text-4xl font-black text-zinc-800/50 font-mono select-none group-hover:text-radar-blue/10 transition-colors">{number}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  )
}