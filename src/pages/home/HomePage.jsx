import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { useCases } from '../../features/cases/store'
import { CaseCard } from '../../features/cases/components/CaseCard'
import { cn } from '../../shared/utils/cn'

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'streetwear', label: 'Streetwear' },
  { id: 'вечерний', label: 'Вечерний' },
  { id: 'спорт', label: 'Спорт' },
  { id: 'y2k', label: 'Y2K' },
]

const STATS = [
  { value: '18 429', label: 'кейсов' },
  { value: '3 214', label: 'авторов' },
  { value: '1.8M ₽', label: 'выплачено' },
  { value: '420', label: 'брендов' },
]

export const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const { cases, loading } = useCases()

  const filtered =
    activeFilter === 'all'
      ? cases
      : cases.filter((c) =>
          c.tags?.some((t) =>
            t.toLowerCase().includes(activeFilter.toLowerCase())
          )
        )

  const featuredCase = cases[0]

  return (
    <div className="relative">
      {/* ============ HERO С ФОНОМ ============ */}
{/* ============ HERO С ФОНОМ ============ */}
<section className="relative overflow-hidden min-h-[110vh] flex items-center">  {/* Фоновое изображение */}
  <div className="absolute inset-0 -z-10">
    <img
      src="/images/hero-bg.png"
      alt=""
      className="w-full h-full object-cover"
      loading="eager"
    />
    {/* Лёгкое затемнение сверху — под хедер */}
    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#06060a]/60 to-transparent" />
    {/* Тень слева для читаемости текста */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#06060a]/90 via-[#06060a]/50 to-transparent" />
    {/* Плавный переход вниз */}
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06060a] to-transparent" />
  </div>

  <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-40 relative w-full">
    {/* Левая часть: текст */}
    <div className="max-w-2xl">
      {/* Бейдж */}
      <div className="inline-flex items-center gap-2 mb-8">
        <div className="w-1.5 h-1.5 rounded-full bg-white-500" />
        <span className="text-[11px] font-bold tracking-[3px] text-white/50 uppercase">
          Стиль в каждом кейсе
        </span>
      </div>

      {/* Заголовок */}
      <h1 className="text-[56px] md:text-[88px] font-black leading-[0.9] tracking-[-0px] mb-12">
        <span className="text-white">ОТКРОЙ</span>
        <br />
        <span className="text-white/40">СВОЙ СТИЛЬ</span>
      </h1>

      {/* Описание */}
      <p className="text-white/50 max-w-md text-base md:text-lg leading-relaxed mb-10">
        Каждый кейс — готовый образ от стилистов. Крути, собирай лук из
        реальных вещей и забирай их к себе.
      </p>

      {/* Кнопки */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => {
            document
              .getElementById('cases')
              ?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white text-black font-bold text-sm hover:gap-4 transition-all"
        >
          Перейти к кейсам
          <ArrowRight
            size={16}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>

        <button className="group inline-flex items-center gap-3 text-sm font-semibold text-white/70 hover:text-white transition-all">
          <span className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-white/5 transition-all">
            <Play size={14} fill="currentColor" />
          </span>
          Как это работает
        </button>
      </div>
    </div>

    {/* Нижняя строка со счётчиком */}
    <div className="hidden lg:flex items-center mt-20 pt-6 border-t border-white/5 max-w-md">
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span>Присоединились 500+ человек</span>
      </div>
    </div>
  </div>
</section>

      {/* ============ СТАТИСТИКА ============ */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="p-8 bg-[#06060a] hover:bg-white/[0.02] transition-colors"
            >
              <div className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
                {s.value}
              </div>
              <div className="text-[11px] text-white/40 uppercase tracking-[2px] font-bold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ КЕЙСЫ ============ */}
      <section id="cases" className="max-w-[1400px] mx-auto px-6 pb-24">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles size={12} className="text-blue-400" />
              <span className="text-[11px] font-bold tracking-[3px] text-white/50 uppercase">
                Каталог
              </span>
            </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-[-2px] leading-none">
            Все <span className="text-white/40">кейсы</span>
          </h2>
          </div>

          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all tracking-wide uppercase',
                  activeFilter === f.id
                    ? 'bg-white text-black'
                    : 'text-white/50 hover:text-white border border-white/10 hover:border-white/20'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] animate-pulse"
              >
                <div className="aspect-[3/4] bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-dashed border-white/10">
            <div className="text-5xl mb-4 opacity-30">📦</div>
            <div className="text-lg font-black mb-2">
              {cases.length === 0 ? 'Кейсов пока нет' : 'Ничего не найдено'}
            </div>
            <div className="text-sm text-white/40">
              {cases.length === 0
                ? 'Первый кейс появится здесь'
                : 'Попробуй другой фильтр'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((c) => (
              <CaseCard key={c.id} data={c} />
            ))}
          </div>
        )}
      </section>


    </div>
  )
}