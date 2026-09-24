import { useState, useRef } from 'react'
import { RARITY_COLORS } from '../../../entities/item/model'
import { getRandomItem, buildRouletteTrack } from '../utils'
import { ResultModal } from './ResultModal'
import { useWallet } from '../../wallet/store'

const TRACK_REPEATS = 40

const CountSelector = ({ value, onChange }) => {
  const counts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {counts.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
            value === n
              ? 'bg-white text-black'
              : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:border-white/20'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

// Размеры карточек и лент
const SIZES = {
  xl: { card: 160, gap: 12, py: 'py-5', pointer: 12, line: 'via-blue-500/60' },
  lg: { card: 120, gap: 10, py: 'py-4', pointer: 10, line: 'via-blue-500/55' },
  md: { card: 90, gap: 8, py: 'py-3', pointer: 8, line: 'via-blue-500/50' },
  sm: { card: 64, gap: 6, py: 'py-2', pointer: 6, line: 'via-blue-500/50' },
}

const SingleRoulette = ({ items, offset, isSpinning, duration, size = 'md' }) => {
  const track = buildRouletteTrack(items, TRACK_REPEATS)
  const cfg = SIZES[size] || SIZES.md
  const { card, gap, py, pointer, line } = cfg

  return (
    <div className="relative rounded-2xl border border-white/[0.06] p-3 bg-black/40 overflow-hidden">
      {/* Указатель */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
        <div
          className="w-0 h-0 drop-shadow-[0_0_10px_rgba(59,130,246,0.9)]"
          style={{
            borderLeftWidth: pointer,
            borderRightWidth: pointer,
            borderTopWidth: pointer + 4,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#3b82f6',
            borderStyle: 'solid',
          }}
        />
      </div>

      {/* Центральная линия */}
      <div
        className={`absolute top-3 bottom-3 left-1/2 w-px -translate-x-1/2 z-10 bg-gradient-to-b from-transparent ${line} to-transparent pointer-events-none`}
      />

      {/* Лента */}
      <div className={`relative rounded-xl overflow-hidden bg-black/60 ${py}`}>
        <div
          className="flex will-change-transform px-1"
          style={{
            gap: `${gap}px`,
            transform: `translateX(${offset}px)`,
            transition: isSpinning
              ? `transform ${duration}ms cubic-bezier(0.15, 0.9, 0.25, 1)`
              : 'none',
          }}
        >
          {track.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="flex-shrink-0 rounded-lg overflow-hidden relative"
              style={{
                width: `${card}px`,
                height: `${card}px`,
                boxShadow: `0 0 18px ${RARITY_COLORS[item.rarity]}50, inset 0 0 25px ${RARITY_COLORS[item.rarity]}20`,
                border: `1px solid ${RARITY_COLORS[item.rarity]}70`,
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const RouletteWheel = ({
  items,
  caseTitle,
  casePrice,
  caseCover,
}) => {
  const { balance, spend } = useWallet()

  const [count, setCount] = useState(1)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showWheels, setShowWheels] = useState(false)
  const [results, setResults] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')

  const [offsets, setOffsets] = useState(Array(10).fill(0))
  const offsetsRef = useRef(Array(10).fill(0))

  const totalPrice = casePrice * count
  const canAfford = balance >= totalPrice

  // Длительность — короче для больших партий
  const duration = count >= 8 ? 5500 : 7000

  // Размер рулетки по количеству
  const getRouletteSize = () => {
    if (count === 1) return 'xl'
    if (count === 2) return 'lg'
    if (count <= 4) return 'md'
    return 'sm'
  }

  // Сетка по количеству
  const getGridClass = () => {
    if (count === 1) return 'grid-cols-1 max-w-3xl mx-auto'
    if (count === 2) return 'grid-cols-1 md:grid-cols-2'
    if (count === 3) return 'grid-cols-1 md:grid-cols-3'
    if (count === 4) return 'grid-cols-2 md:grid-cols-4'
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3'
    if (count <= 8) return 'grid-cols-2 md:grid-cols-4'
    return 'grid-cols-2 md:grid-cols-5'
  }

  const handleOpen = () => {
    setError('')

    if (!canAfford) {
      setError(
        `Недостаточно средств. Нужно ${totalPrice.toLocaleString('ru-RU')} ₽, у тебя ${balance.toLocaleString('ru-RU')} ₽`
      )
      return
    }

    const ok = spend(totalPrice)
    if (!ok) {
      setError('Не удалось списать деньги')
      return
    }

    setShowWheels(true)

    // Генерируем победителей (без дублей, пока есть варианты)
    const winners = []
    const usedIds = new Set()

    for (let i = 0; i < count; i++) {
      const availableItems = items.filter((it) => !usedIds.has(it.id))
      let winner

      if (availableItems.length > 0) {
        winner = getRandomItem(availableItems)
      } else {
        usedIds.clear()
        winner = getRandomItem(items)
      }

      usedIds.add(winner.id)

      winners.push({
        ...winner,
        dropId: `drop-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
      })
    }

    // Даём рулеткам отрисоваться, потом крутим
    setTimeout(() => {
      setIsSpinning(true)

      const sizeKey = getRouletteSize()
      const cfg = SIZES[sizeKey] || SIZES.md
      const ITEM_WIDTH = cfg.card + cfg.gap

      const newOffsets = []
      const itemsPerRepeat = items.length

      for (let w = 0; w < count; w++) {
        const winner = winners[w]
        const winnerIndexInItems = items.findIndex((i) => i.id === winner.id)
        const currentAbs = Math.abs(offsetsRef.current[w] || 0)
        const currentRepeat = Math.floor(
          currentAbs / (itemsPerRepeat * ITEM_WIDTH)
        )
        const repeatsToAdvance = 6 + Math.floor(Math.random() * 3)
        const targetRepeat = currentRepeat + repeatsToAdvance
        const targetIndex = targetRepeat * itemsPerRepeat + winnerIndexInItems

        // Реальная ширина контейнера (для центрирования)
        const wrapWidth = 600
        const targetOffsetPx =
          targetIndex * ITEM_WIDTH - wrapWidth / 2 + ITEM_WIDTH / 2
        const jitter = (Math.random() - 0.5) * 30
        newOffsets.push(-(targetOffsetPx + jitter))
      }

      offsetsRef.current = newOffsets
      setOffsets(newOffsets)

      setTimeout(() => {
        setResults(winners)
        setIsSpinning(false)
        setModalOpen(true)
      }, duration + 100)
    }, 200)
  }

  const handleCountChange = (n) => {
    if (isSpinning) return
    setCount(n)
    setShowWheels(false)
    setOffsets(Array(10).fill(0))
    offsetsRef.current = Array(10).fill(0)
  }

  return (
    <>
      <div className="relative">
        {/* Заголовок */}
        <div className="text-center mb-3">
          <h2 className="text-3xl md:text-4xl font-black tracking-[-2px]">
            Открой <span className="text-white/40">кейс</span>
          </h2>
        </div>

        {/* Селектор количества */}
        <div className="mb-8">
          <div className="text-[10px] font-black tracking-[2px] text-white/40 uppercase text-center mb-4">
            Сколько кейсов открыть
          </div>
          <CountSelector value={count} onChange={handleCountChange} />
        </div>

        {/* Обложка кейса — скрывается при открытии */}
        {!showWheels && caseCover && (
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="w-[80%] h-[80%] rounded-full bg-blue-500/15 blur-[80px]" />
              </div>

              <div className="relative rounded-3xl border border-white/[0.08] p-3 bg-black/40 backdrop-blur-md">
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-blue-500/50 rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-blue-500/50 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-blue-500/50 rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-blue-500/50 rounded-br-3xl" />

                <div className="relative rounded-2xl overflow-hidden aspect-square">
                  <img
                    src={caseCover}
                    alt={caseTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <div className="text-[10px] font-black tracking-[3px] text-blue-400 uppercase mb-1">
                      Кейс
                    </div>
                    <div className="text-lg font-black tracking-tight truncate">
                      {caseTitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Рулетки */}
        {showWheels && (
          <div className={`grid gap-3 mb-6 ${getGridClass()}`}>
            {Array.from({ length: count }).map((_, i) => (
              <SingleRoulette
                key={i}
                items={items}
                offset={offsets[i] || 0}
                isSpinning={isSpinning}
                duration={duration}
                size={getRouletteSize()}
              />
            ))}
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Кнопка открыть */}
        <button
          onClick={handleOpen}
          disabled={isSpinning || !canAfford}
          className={`w-full py-5 rounded-2xl font-black text-sm tracking-[3px] uppercase transition-all ${
            canAfford
              ? 'bg-white text-black hover:-translate-y-0.5'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          } disabled:cursor-not-allowed disabled:hover:translate-y-0`}
        >
          {isSpinning
            ? `Открывается ${count}...`
            : canAfford
            ? `Открыть за ${totalPrice.toLocaleString('ru-RU')} ₽`
            : `Не хватает ${(totalPrice - balance).toLocaleString('ru-RU')} ₽`}
        </button>

        {/* Баланс */}
        <div className="text-center text-xs text-white/40 mt-4">
          Баланс: {balance.toLocaleString('ru-RU')} ₽
        </div>
      </div>

      <ResultModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setShowWheels(false)
        }}
        items={results}
        caseTitle={caseTitle}
      />
    </>
  )
}