import { useEffect, useState } from 'react'
import { X, PackagePlus, Coins, Check } from 'lucide-react'
import { RARITY_COLORS, RARITY_LABELS } from '../../../entities/item/model'
import { useWallet } from '../../wallet/store'
import { useWardrobe } from '../../wardrobe/store'

export const ResultModal = ({ open, onClose, items, caseTitle }) => {
  const { addFunds } = useWallet()
  const { addItems } = useWardrobe()

  const [selected, setSelected] = useState([]) // массив dropId
  const [remaining, setRemaining] = useState([]) // вещи, которые ещё не обработаны
  const [sold, setSold] = useState(0) // сколько уже продано (для сводки)
  const [kept, setKept] = useState(0) // сколько уже забрано

  // При открытии — инициализируем remaining всеми вещами
  useEffect(() => {
    if (open) {
      setRemaining(items || [])
      setSelected([])
      setSold(0)
      setKept(0)
    }
  }, [open, items])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  // Все обработаны — автозакрытие
  if (remaining.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/80 backdrop-blur-2xl"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="w-full max-w-md bg-[#0d0d12] border border-white/[0.08] rounded-3xl p-8 relative shadow-2xl text-center">
          <div className="text-6xl mb-4">✨</div>
          <div className="text-2xl font-black tracking-tight mb-2">
            Всё обработано
          </div>
          <div className="text-sm text-white/50 mb-6">
            {kept > 0 && `Забрано: ${kept} вещ.`}
            {kept > 0 && sold > 0 && ' · '}
            {sold > 0 && `Продано на ${sold.toLocaleString('ru-RU')} ₽`}
          </div>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm tracking-wider uppercase hover:-translate-y-0.5 transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    )
  }

  const list = remaining

  // Все вещи выбраны?
  const allSelected = selected.length === list.length && list.length > 0
  // Выбранные вещи
  const selectedItems = list.filter((it) => selected.includes(it.dropId))
  // Выбранная сумма
  const selectedValue = selectedItems.reduce((s, i) => s + i.price, 0)
  // Общая сумма оставшихся
  const totalValue = list.reduce((sum, i) => sum + i.price, 0)

  const toggleSelect = (dropId) => {
    setSelected((prev) =>
      prev.includes(dropId)
        ? prev.filter((id) => id !== dropId)
        : [...prev, dropId]
    )
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelected([])
    } else {
      setSelected(list.map((it) => it.dropId))
    }
  }

  // Забрать выбранные
  const handleKeep = () => {
    if (selected.length === 0) return
    const toKeep = selectedItems.map((item) => ({
      ...item,
      uid: item.dropId,
      purchasedAt: Date.now(),
    }))
    addItems(toKeep)

    // Убираем из remaining
    const newRemaining = list.filter((it) => !selected.includes(it.dropId))
    setRemaining(newRemaining)
    setKept((prev) => prev + selectedItems.length)
    setSelected([])
  }

  // Продать выбранные
  const handleSell = () => {
    if (selected.length === 0) return
    addFunds(selectedValue)

    // Убираем из remaining
    const newRemaining = list.filter((it) => !selected.includes(it.dropId))
    setRemaining(newRemaining)
    setSold((prev) => prev + selectedValue)
    setSelected([])
  }

  // Забрать всё
  const handleKeepAll = () => {
    const toKeep = list.map((item) => ({
      ...item,
      uid: item.dropId,
      purchasedAt: Date.now(),
    }))
    addItems(toKeep)
    setKept((prev) => prev + list.length)
    setRemaining([])
    setSelected([])
  }

  // Продать всё
  const handleSellAll = () => {
    addFunds(totalValue)
    setSold((prev) => prev + totalValue)
    setRemaining([])
    setSelected([])
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/80 backdrop-blur-2xl overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-3xl bg-[#0d0d12] border border-white/[0.08] rounded-3xl p-7 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:rotate-90 transition-all z-10"
        >
          <X size={16} />
        </button>

        {/* Заголовок */}
        <div className="text-center mb-6">
          <div className="text-[11px] font-black tracking-[3px] text-blue-400 uppercase mb-2">
            🎉 Осталось обработать
          </div>
          <div className="text-sm text-white/40">{caseTitle}</div>
          <div className="text-xs text-white/30 mt-1">
            {list.length} {list.length === 1 ? 'вещь' : 'вещей'} ·{' '}
            {totalValue.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        {/* Мини-сводка по уже обработанному */}
        {(kept > 0 || sold > 0) && (
          <div className="mb-4 flex items-center justify-center gap-4 text-xs flex-wrap">
            {kept > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30">
                <PackagePlus size={12} className="text-blue-400" />
                <span className="text-blue-400 font-bold">
                  Забрано: {kept}
                </span>
              </div>
            )}
            {sold > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                <Coins size={12} className="text-green-400" />
                <span className="text-green-400 font-bold">
                  Продано: +{sold.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            )}
          </div>
        )}

        {/* Кнопка «Выбрать все» */}
        {list.length > 1 && (
          <div className="flex justify-end mb-3">
            <button
              onClick={toggleAll}
              className="text-[10px] font-black tracking-wider uppercase text-white/50 hover:text-white transition-colors"
            >
              {allSelected ? 'Снять все' : 'Выбрать все'}
            </button>
          </div>
        )}

        {/* Сетка оставшихся вещей */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {list.map((item) => {
            const isSelected = selected.includes(item.dropId)
            return (
              <button
                key={item.dropId}
                onClick={() => toggleSelect(item.dropId)}
                className={`relative rounded-2xl overflow-hidden border transition-all text-left ${
                  isSelected
                    ? 'border-blue-500/60 shadow-[0_0_25px_rgba(59,130,246,0.25)]'
                    : 'border-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="aspect-square overflow-hidden bg-[#15151c] relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  <div
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-black/40 border-white/30 backdrop-blur-md'
                    }`}
                  >
                    {isSelected && (
                      <Check size={12} className="text-white" strokeWidth={3} />
                    )}
                  </div>

                  <div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full backdrop-blur-md text-[8px] font-black tracking-wider uppercase"
                    style={{
                      color: RARITY_COLORS[item.rarity],
                      border: `1px solid ${RARITY_COLORS[item.rarity]}60`,
                      background: 'rgba(0,0,0,0.6)',
                    }}
                  >
                    {RARITY_LABELS[item.rarity]}
                  </div>
                </div>

                <div className="p-2.5">
                  <div className="text-[11px] font-black tracking-wider uppercase text-white line-clamp-1 mb-0.5">
                    {item.name}
                  </div>
                  <div className="text-[10px] font-black text-white/70">
                    {item.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Кнопки действий */}
        {selected.length > 0 ? (
          <>
            <div className="mb-4 p-4 rounded-2xl bg-blue-500/[0.08] border border-blue-500/30">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-blue-400" />
                  <span className="text-sm font-bold">
                    Выбрано: {selected.length}
                  </span>
                  <span className="text-xs text-white/50">
                    на {selectedValue.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <button
                  onClick={() => setSelected([])}
                  className="text-xs font-bold text-white/50 hover:text-white transition-colors"
                >
                  Сбросить
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleKeep}
                className="py-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] font-black text-sm tracking-wider uppercase text-white hover:bg-white/[0.06] hover:border-white/20 transition-all flex items-center justify-center gap-2.5"
              >
                <PackagePlus size={18} />
                Забрать
              </button>

              <button
                onClick={handleSell}
                className="py-5 rounded-2xl bg-white text-black font-black text-sm tracking-wider uppercase hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5"
              >
                <Coins size={18} />
                Продать за {selectedValue.toLocaleString('ru-RU')} ₽
              </button>
            </div>

            <div className="text-center text-[10px] text-white/40 mt-3">
              Выбранные вещи обработаются. Остальные останутся здесь — сможешь
              решить с ними потом.
            </div>
          </>
        ) : (
          <>
            <div className="text-center text-[10px] font-black tracking-wider uppercase text-white/40 mb-3">
              Выбери вещи или обработай всё сразу
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleKeepAll}
                className="py-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] font-black text-xs tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <PackagePlus size={14} />
                Забрать всё
              </button>

              <button
                onClick={handleSellAll}
                className="py-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] font-black text-xs tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Coins size={14} />
                Продать всё за {totalValue.toLocaleString('ru-RU')} ₽
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}