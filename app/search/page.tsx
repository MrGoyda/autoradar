"use client"

import { useState, useEffect, useRef, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Search, ArrowLeft, ScanBarcode, Component, Sparkles, 
  Clock, ChevronRight, Loader2, Camera, Car, Wrench, X, Phone, ShieldCheck 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createLead } from './actions' // Импортируем наш защищенный экшен
import { toast } from 'sonner'

const MOCK_DB = [
  { type: 'car', label: 'Toyota Camry 70', subtext: '2017 - 2021' },
  { type: 'car', label: 'Toyota Camry 50/55', subtext: '2011 - 2017' },
  { type: 'car', label: 'Toyota Land Cruiser 200', subtext: 'Все поколения' },
  { type: 'part', label: 'Бампер передний', subtext: 'Кузовные детали' },
  { type: 'part', label: 'Фара левая (Full LED)', subtext: 'Оптика' },
  { type: 'part', label: 'Колодки тормозные', subtext: 'Расходники' },
]

export default function SearchPage() {
  const [step, setStep] = useState<1 | 2>(1) // Шаг 1: Поиск, Шаг 2: Телефон
  const [mode, setMode] = useState<'part' | 'vin'>('part')
  const [query, setQuery] = useState('')
  const [phone, setPhone] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition() // Для обработки Server Action
  
  const [suggestions, setSuggestions] = useState<typeof MOCK_DB>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }
    const filtered = MOCK_DB.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase())
    )
    setSuggestions(filtered)
    setIsOpen(true)
    setSelectedIndex(-1)
  }, [query])

  // Переход к вводу телефона
  const proceedToPhone = (overrideQuery?: string) => {
    const finalQuery = overrideQuery || query
    if (finalQuery.length < 3) {
      toast.error("Пожалуйста, уточните название детали")
      return
    }
    setQuery(finalQuery)
    setIsOpen(false)
    setStep(2)
  }

  // Финальная отправка в базу и Telegram
  const handleFinalSubmit = async () => {
    if (phone.length < 10) {
      toast.error("Введите корректный номер телефона")
      return
    }

    const formData = new FormData()
    formData.append('description', query)
    formData.append('phone', phone)

    startTransition(async () => {
      const result = await createLead(formData)
      if (result?.error) {
        toast.error(result.error)
      }
      // Редирект на /success произойдет автоматически внутри createLead
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') proceedToPhone()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = selectedIndex >= 0 ? suggestions[selectedIndex].label : query
      proceedToPhone(selected)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight) return text
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <span key={i} className="text-radar-blue font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">{part}</span> 
        : part
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 bg-cyber-grid bg-cyber-grid-size text-white font-sans relative flex flex-col overflow-hidden">
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-radar-blue/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <header className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => step === 2 ? setStep(1) : window.history.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{step === 2 ? 'Назад к поиску' : 'Назад'}</span>
          </button>
          <div className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            AUTORADAR
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-16 px-4 pb-12">
        <div className={cn(
            "w-full max-w-2xl transition-all duration-700 ease-out",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          
          {/* ИНДИКАТОР ПРОГРЕССА */}
          <div className="flex justify-center gap-3 mb-8">
            <div className={cn("h-1 w-12 rounded-full transition-all", step >= 1 ? "bg-radar-blue shadow-[0_0_10px_#3b82f6]" : "bg-zinc-800")} />
            <div className={cn("h-1 w-12 rounded-full transition-all", step === 2 ? "bg-radar-blue shadow-[0_0_10px_#3b82f6]" : "bg-zinc-800")} />
          </div>

          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 italic uppercase tracking-tighter">Найдем любую деталь</h1>
                <p className="text-zinc-400">Сканируем склады и разборы Астаны за 15 минут</p>
              </div>

              <div ref={wrapperRef} className="relative z-20">
                <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-2 backdrop-blur-md shadow-2xl relative">
                  {/* Декоративные уголки */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-radar-blue/30 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-radar-blue/30 rounded-tr-lg" />

                  <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-950/50 rounded-xl mb-2">
                    <button onClick={() => setMode('part')} className={cn("flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all", mode === 'part' ? "bg-radar-blue text-white shadow-lg" : "text-zinc-500 hover:bg-white/5")}>
                      <Component className="w-4 h-4" /> <span>Название</span>
                    </button>
                    <button onClick={() => setMode('vin')} className={cn("flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all", mode === 'vin' ? "bg-radar-purple text-white shadow-lg" : "text-zinc-500 hover:bg-white/5")}>
                      <ScanBarcode className="w-4 h-4" /> <span>VIN код</span>
                    </button>
                    <button disabled className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-zinc-600 bg-zinc-900/50 opacity-50 cursor-not-allowed">
                      <Camera className="w-4 h-4" /> <span>По фото</span>
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      <Search className="w-6 h-6" />
                    </div>
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={mode === 'part' ? "Бампер Camry 70..." : "Введите VIN (17 символов)"}
                      className="w-full h-16 bg-zinc-900/50 border border-white/5 rounded-xl pl-14 pr-32 text-lg focus:outline-none focus:border-radar-blue/50 transition-all"
                      autoFocus
                      autoComplete="off"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Button onClick={() => proceedToPhone()} disabled={query.length < 3} className="h-12 px-6 font-bold bg-white text-black hover:bg-zinc-200">
                        Далее
                      </Button>
                    </div>
                  </div>
                </div>

                {isOpen && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950/90 border border-white/10 rounded-xl backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Подходящие варианты</div>
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => proceedToPhone(item.label)}
                        className={cn("flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors border-l-2", selectedIndex === index ? "bg-white/10 border-radar-blue" : "hover:bg-white/5 border-transparent")}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.type === 'car' ? "bg-radar-purple/20 text-radar-purple" : "bg-radar-blue/20 text-radar-blue")}>
                          {item.type === 'car' ? <Car className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{highlightMatch(item.label, query)}</div>
                          <div className="text-zinc-500 text-xs">{item.subtext}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-10">
                <div className="inline-flex p-3 rounded-2xl bg-radar-blue/10 text-radar-blue mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 italic uppercase">Почти готово!</h1>
                <p className="text-zinc-400">Куда прислать предложения от продавцов?</p>
              </div>

              <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative">
                <div className="absolute -top-3 -left-3 bg-radar-blue px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase">Заявка</div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Вы ищете:</label>
                    <div className="mt-2 p-4 bg-zinc-950/50 rounded-xl border border-white/5 flex items-center justify-between group">
                      <span className="text-radar-blue font-bold tracking-tight">{query}</span>
                      <button onClick={() => setStep(1)} className="text-xs text-zinc-500 hover:text-white underline decoration-zinc-700">Изменить</button>
                    </div>
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-6 h-6" />
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="8 (707) 000-00-00"
                      className="w-full h-20 bg-zinc-950/50 border border-white/10 rounded-xl pl-14 text-2xl font-mono tracking-tighter focus:outline-none focus:border-radar-blue focus:ring-1 focus:ring-radar-blue/50 transition-all"
                      autoFocus
                    />
                  </div>

                  <Button 
                    onClick={handleFinalSubmit}
                    disabled={isPending || phone.length < 10}
                    className="w-full h-16 text-lg font-black uppercase tracking-widest bg-radar-blue hover:bg-radar-blue/90 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98]"
                  >
                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Запустить Радар"}
                  </Button>

                  <p className="text-[10px] text-center text-zinc-600 font-medium leading-relaxed">
                    Ваша заявка будет анонимно разослана проверенным продавцам. <br/> Обычно ответы приходят в течение 15 минут.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}