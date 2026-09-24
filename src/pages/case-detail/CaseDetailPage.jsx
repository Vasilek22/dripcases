import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCases } from '../../features/cases/store'
import { RouletteWheel } from '../../features/roulette/components/RouletteWheel'
import { RARITY_COLORS, RARITY_LABELS } from '../../entities/item/model'

export const CaseDetailPage = () => {
  const { id } = useParams()
  const { cases } = useCases()
  const caseData = cases.find((c) => c.id === id)

  if (!caseData) {
    return (
      <div className="max-w-[900px] mx-auto px-6 pt-32 pb-20 text-center">
        <div className="text-6xl mb-4 opacity-30">📦</div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">
          Кейс не найден
        </h1>
        <p className="text-white/40 mb-8">Возможно, он был удалён</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:gap-3 transition-all"
        >
          <ArrowLeft size={16} /> На главную
        </Link>
      </div>
    )
  }

  // Сортируем по редкости (легендарные вперёд)
  const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 }
  const sortedItems = [...caseData.items].sort(
    (a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]
  )

  return (
    <div className="pt-28 pb-24">
      {/* Кнопка назад */}
      <div className="max-w-[1200px] mx-auto px-6 mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[2px] uppercase text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Назад к кейсам
        </Link>
      </div>

      {/* РУЛЕТКА */}
      <div className="max-w-[1000px] mx-auto px-6 mb-24">
<RouletteWheel
  items={caseData.items}
  caseTitle={caseData.title}
  casePrice={caseData.price}
  caseCover={caseData.cover}
/>    </div>

      {/* ВСЕ ВЕЩИ */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-[11px] font-bold tracking-[3px] text-white/50 uppercase mb-3">
              Содержимое
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-2px] leading-none">
              Все вещи <span className="text-white/40">кейса</span>
            </h2>
          </div>
          <div className="text-xs text-white/40 tracking-wider uppercase font-bold">
            {sortedItems.length} вещей
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-[#0d0d12] border border-white/[0.06] transition-all duration-500 hover:border-white/20 hover:bg-[#111117]"
            >
              {/* Витрина */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#15151c] to-[#0a0a0f]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] rounded-full bg-white/[0.03] blur-[60px]" />
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d0d12] to-transparent" />

                {/* Плашка редкости */}
                <div
                  className="absolute top-4 left-4 px-2.5 py-1 rounded-full backdrop-blur-md text-[9px] font-black tracking-[2px] uppercase"
                  style={{
                    color: RARITY_COLORS[item.rarity],
                    border: `1px solid ${RARITY_COLORS[item.rarity]}60`,
                    background: 'rgba(0,0,0,0.6)',
                  }}
                >
                  {RARITY_LABELS[item.rarity]}
                </div>
              </div>

              {/* Инфо */}
              <div className="p-5">
                <h3 className="text-sm font-black tracking-wider uppercase text-white mb-1.5 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-white/40 mb-4 line-clamp-1">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="text-lg font-black text-white">
                    {item.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}