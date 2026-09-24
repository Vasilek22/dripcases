import { useState } from 'react'
import { LogOut, Coins, Truck, Clock, Wallet, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { useWallet } from '../../features/wallet/store'
import { useWardrobe } from '../../features/wardrobe/store'
import { RARITY_COLORS, RARITY_LABELS } from '../../entities/item/model'
import { DeliveryModal } from '../../features/wardrobe/components/DeliveryModal'

const MIN_ITEMS = 5
const MIN_VALUE = 1000

export const ProfilePage = () => {
  const { user, logout } = useAuth()
  const { balance, addFunds } = useWallet()
  const { items, removeItem, markShipped } = useWardrobe()

  const [selected, setSelected] = useState([]) // массив uid
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')

  const showToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(null), 2500)
  }

  const totalValue = items.reduce((sum, i) => sum + i.price, 0)

  // Доступные для выбора (не в доставке)
  const availableItems = items.filter((i) => i.status !== 'shipping')

  // Выбранные вещи
  const selectedItems = items.filter((i) => selected.includes(i.uid))
  const selectedValue = selectedItems.reduce((s, i) => s + i.price, 0)

  const toggleSelect = (uid) => {
    setError('')
    setSelected((prev) =>
      prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]
    )
  }

  const handleOpenDelivery = () => {
    if (selected.length < MIN_ITEMS) {
      setError(`Нужно минимум ${MIN_ITEMS} вещей. Выбрано: ${selected.length}`)
      return
    }
    if (selectedValue < MIN_VALUE) {
      setError(
        `Сумма минимум ${MIN_VALUE.toLocaleString('ru-RU')} ₽. Сейчас: ${selectedValue.toLocaleString('ru-RU')} ₽`
      )
      return
    }
    setError('')
    setDeliveryOpen(true)
  }

  const handleDeliveryConfirm = (deliveryInfo) => {
    markShipped(selected, deliveryInfo)
    setDeliveryOpen(false)
    setSelected([])
    showToast(`Доставка оформлена: ${selected.length} вещей`)
  }

const handleSell = (item) => {
  addFunds(item.price)
  removeItem(item.uid)
  setSelected((prev) => prev.filter((u) => u !== item.uid))
  showToast(`Продано за ${item.price.toLocaleString('ru-RU')} ₽`)
}

  const handleSelectAll = () => {
    if (selected.length === availableItems.length) {
      setSelected([])
    } else {
      setSelected(availableItems.map((i) => i.uid))
    }
  }

  const getStatusBadge = (item) => {
    if (item.status === 'shipping') {
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-[1.5px] uppercase bg-blue-500/15 border border-blue-500/40 text-blue-400 backdrop-blur-md">
          <Clock size={9} /> В доставке
        </div>
      )
    }
    return null
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Шапка */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[11px] font-bold tracking-[3px] text-white/50 uppercase">
              Профиль
            </span>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 blur-md opacity-60" />
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.displayName || 'User'
                  )}&background=3b82f6&color=fff`
                }
                alt={user?.displayName || 'User'}
                className="relative w-20 h-20 rounded-full border-4 border-[#06060a] object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 border-2 border-[#06060a] shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-black tracking-[-1px] truncate">
                {user?.displayName || 'Пользователь'}
              </h1>
              <p className="text-sm text-white/40 mt-1 truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md text-xs font-bold tracking-wider uppercase text-white/50 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
            >
              <LogOut size={14} />
              Выйти
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05] rounded-3xl overflow-hidden border border-white/[0.05] mb-14">
          <div className="p-7 bg-[#06060a] hover:bg-white/[0.02] transition-colors">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/40 mb-4">
              Баланс
            </div>
            <div className="text-4xl font-black tracking-tight text-white mb-6">
              {balance.toLocaleString('ru-RU')}
              <span className="text-white/40 text-2xl ml-2 font-bold">₽</span>
            </div>
            <Link
              to="/deposit"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-black tracking-wider uppercase hover:gap-3 transition-all"
            >
              <Wallet size={13} />
              Пополнить
            </Link>
          </div>

          <div className="p-7 bg-[#06060a] hover:bg-white/[0.02] transition-colors">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/40 mb-4">
              Вещей в гардеробе
            </div>
            <div className="text-4xl font-black tracking-tight text-white mb-2">
              {items.length}
            </div>
            <div className="text-xs text-white/40">Выпало из кейсов</div>
          </div>

          <div className="p-7 bg-[#06060a] hover:bg-white/[0.02] transition-colors">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/40 mb-4">
              Общая стоимость
            </div>
            <div className="text-4xl font-black tracking-tight text-white mb-2">
              {totalValue.toLocaleString('ru-RU')}
              <span className="text-white/40 text-2xl ml-2 font-bold">₽</span>
            </div>
            <div className="text-xs text-white/40">По цене покупки</div>
          </div>
        </div>

        {/* Гардероб — заголовок */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="text-[11px] font-bold tracking-[3px] text-white/50 uppercase mb-3">
              Содержимое
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-2px] leading-none">
              Мой <span className="text-white/40">гардероб</span>
            </h2>
          </div>

          {availableItems.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-xs font-black tracking-wider uppercase text-white/50 hover:text-white transition-colors"
            >
              {selected.length === availableItems.length
                ? 'Снять все'
                : 'Выбрать все'}
            </button>
          )}
        </div>

        {/* Панель корзины доставки */}
        {selected.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-500/[0.08] border border-blue-500/30 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-blue-400" />
                  <span className="text-sm font-bold">
                    Выбрано: {selected.length} из {MIN_ITEMS} мин.
                  </span>
                </div>
                <div className="w-px h-5 bg-white/10 hidden md:block" />
                <div className="text-sm">
                  <span className="text-white/50">Сумма: </span>
                  <span className="font-bold">
                    {selectedValue.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-white/40 text-xs ml-1">
                    / мин. {MIN_VALUE.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelected([])}
                  className="px-4 py-2 rounded-full text-xs font-bold text-white/50 hover:text-white transition-colors"
                >
                  Сбросить
                </button>
                <button
                  onClick={handleOpenDelivery}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-black tracking-wider uppercase hover:-translate-y-0.5 transition-all"
                >
                  <Truck size={13} />
                  Оформить доставку
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-3 pt-3 border-t border-blue-500/20 text-xs text-red-300 font-bold">
                {error}
              </div>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-dashed border-white/[0.08]">
            <div className="text-5xl mb-4 opacity-30">🛍️</div>
            <div className="text-lg font-black mb-2">Гардероб пуст</div>
            <div className="text-sm text-white/40 max-w-sm mx-auto">
              Крути кейсы на главной и забирай выпавшие вещи к себе
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item) => {
              const isShipping = item.status === 'shipping'
              const isSelected = selected.includes(item.uid)

              return (
                <div
                  key={item.uid}
                  onClick={() => !isShipping && toggleSelect(item.uid)}
                  className={`group relative rounded-2xl overflow-hidden bg-[#0d0d12] border transition-all duration-300 ${
                    isShipping
                      ? 'border-blue-500/20 opacity-90'
                      : isSelected
                      ? 'border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.2)] cursor-pointer'
                      : 'border-white/[0.06] hover:border-white/20 hover:bg-[#111117] cursor-pointer'
                  }`}
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

                    {/* Чекбокс выбора */}
                    {!isShipping && (
                      <div
                        className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-black/40 border-white/30 backdrop-blur-md'
                        }`}
                      >
                        {isSelected && (
                          <Check size={14} className="text-white" strokeWidth={3} />
                        )}
                      </div>
                    )}

                    {/* Редкость */}
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

                    {/* Статус доставки */}
                    {isShipping && (
                      <div className="absolute bottom-4 left-4">
                        {getStatusBadge(item)}
                      </div>
                    )}
                  </div>

                  {/* Инфо */}
                  <div className="p-5">
                    <h3 className="text-sm font-black tracking-wider uppercase text-white mb-1.5 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-white/40 mb-4 line-clamp-1">
                      {item.description}
                    </p>

                    <div className="pt-3 border-t border-white/[0.06] mb-4">
                      <div className="text-lg font-black text-white">
                        {item.price.toLocaleString('ru-RU')}
                        <span className="text-white/40 ml-1.5">₽</span>
                      </div>
                    </div>

                    {isShipping ? (
                      <div className="p-3 rounded-xl bg-blue-500/[0.08] border border-blue-500/30">
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-wider uppercase text-blue-400 mb-1">
                          <Truck size={12} /> В доставке
                        </div>
                        <div className="text-[11px] text-white/50 truncate">
                          {item.delivery?.methodLabel} · {item.delivery?.city}
                        </div>
                      </div>
                    ) : (
<button
  onClick={(e) => {
    e.stopPropagation()
    handleSell(item)
  }}
  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[11px] font-black tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
>
  <Coins size={12} />
  Продать за {item.price.toLocaleString('ru-RU')} ₽
</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Подсказка */}
        {availableItems.length > 0 && selected.length === 0 && (
          <div className="mt-8 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <div className="text-sm text-white/50">
              Выбери минимум{' '}
              <span className="text-white font-bold">{MIN_ITEMS} вещей</span> на
              сумму от{' '}
              <span className="text-white font-bold">
                {MIN_VALUE.toLocaleString('ru-RU')} ₽
              </span>
              , чтобы оформить доставку
            </div>
          </div>
        )}
      </div>

      {/* Модалка доставки */}
      <DeliveryModal
        open={deliveryOpen}
        onClose={() => setDeliveryOpen(false)}
        items={selectedItems}
        onConfirm={handleDeliveryConfirm}
      />

      {/* Тост */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold text-sm shadow-2xl backdrop-blur-2xl border bg-white text-black border-white/40">
          {toast}
        </div>
      )}
    </div>
  )
}