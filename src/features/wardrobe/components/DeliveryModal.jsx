import { useEffect, useState } from 'react'
import { X, MapPin, Phone, User } from 'lucide-react'
import { RARITY_COLORS } from '../../../entities/item/model'

const DELIVERY_OPTIONS = [
  {
    id: 'cdek',
    label: 'СДЭК',
    desc: 'До пункта выдачи, 3-7 дней',
    price: 0,
    icon: '📦',
  },
  {
    id: 'post',
    label: 'Почта России',
    desc: 'До отделения, 5-14 дней',
    price: 0,
    icon: '📮',
  },
  {
    id: 'courier',
    label: 'Курьер',
    desc: 'До двери, 1-3 дня',
    price: 350,
    icon: '🚚',
  },
]

export const DeliveryModal = ({ open, onClose, items, onConfirm }) => {
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setStep(1)
      setMethod(null)
      setForm({ name: '', phone: '', city: '', address: '' })
      setError('')
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !items || items.length === 0) return null

  const totalItems = items.reduce((sum, i) => sum + i.price, 0)

  const handleNext = () => {
    if (!method) return setError('Выбери способ доставки')
    setError('')
    setStep(2)
  }

  const handleSubmit = () => {
    setError('')
    if (!form.name.trim()) return setError('Введи имя получателя')
    if (!form.phone.trim()) return setError('Введи телефон')
    if (!form.city.trim()) return setError('Введи город')
    if (!form.address.trim()) return setError('Введи адрес')

    onConfirm({
      method: method.id,
      methodLabel: method.label,
      price: method.price,
      ...form,
      orderedAt: Date.now(),
      itemCount: items.length,
      totalValue: totalItems,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/80 backdrop-blur-2xl overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-[#0d0d12] border border-white/[0.08] rounded-3xl p-7 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:rotate-90 transition-all"
        >
          <X size={16} />
        </button>

        <div className="mb-6">
          <div className="text-[11px] font-black tracking-[3px] text-white/50 uppercase mb-2">
            Доставка
          </div>
          <h2 className="text-3xl font-black tracking-[-1px] mb-2">
            {step === 1 ? 'Способ доставки' : 'Адрес получателя'}
          </h2>
          <p className="text-sm text-white/40">
            {items.length} {items.length === 1 ? 'вещь' : 'вещей'} ·{' '}
            {totalItems.toLocaleString('ru-RU')} ₽
          </p>
        </div>

        {/* Список вещей */}
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-[10px] font-black tracking-[2px] text-white/40 uppercase mb-3">
            В посылке
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((it) => (
              <div
                key={it.uid}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-[#15151c]">
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-white/80 line-clamp-1 max-w-[100px]">
                  {it.name}
                </span>
                <span
                  className="text-[10px] font-black"
                  style={{ color: RARITY_COLORS[it.rarity] }}
                >
                  {it.price.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Шаг 1: Способ */}
        {step === 1 && (
          <div className="flex flex-col gap-3 mb-6">
            {DELIVERY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setMethod(opt)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                  method?.id === opt.id
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-3xl flex-shrink-0">{opt.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm mb-0.5">{opt.label}</div>
                  <div className="text-xs text-white/50">{opt.desc}</div>
                </div>
                <div className="text-sm font-black flex-shrink-0">
                  {opt.price === 0 ? (
                    <span className="text-green-400">0 ₽</span>
                  ) : (
                    <span>{opt.price} ₽</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Шаг 2: Адрес */}
        {step === 2 && (
          <div className="flex flex-col gap-3 mb-6">
            <div>
              <label className="text-[10px] font-black tracking-[2px] uppercase text-white/40 mb-2 block">
                Имя получателя
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Иван Иванов"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/60 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black tracking-[2px] uppercase text-white/40 mb-2 block">
                Телефон
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+7 999 123-45-67"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/60 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black tracking-[2px] uppercase text-white/40 mb-2 block">
                Город
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Москва"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/60 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-black tracking-[2px] uppercase text-white/40 mb-2 block">
                Адрес
              </label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-4 top-3 text-white/30"
                />
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder={
                    method?.id === 'courier'
                      ? 'ул. Пушкина, д. 10, кв. 5'
                      : 'ПВЗ на ул. Ленина, 15'
                  }
                  rows={2}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/60 focus:outline-none text-sm text-white placeholder-white/30 transition-all resize-none"
                />
              </div>
            </div>

            {/* Итого */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/50">
                  Товаров ({items.length})
                </span>
                <span>{totalItems.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/50">Доставка</span>
                <span>
                  {method?.price === 0 ? (
                    <span className="text-green-400">0 ₽</span>
                  ) : (
                    `${method?.price} ₽`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/[0.08]">
                <span className="font-bold">Итого</span>
                <span className="font-black text-lg">
                  {(totalItems + (method?.price || 0)).toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] font-bold hover:bg-white/[0.06] transition-all text-sm"
            >
              Назад
            </button>
          )}
          <button
            onClick={step === 1 ? handleNext : handleSubmit}
            className="flex-1 py-4 rounded-2xl bg-white text-black font-black tracking-[2px] uppercase text-sm hover:-translate-y-0.5 transition-all"
          >
            {step === 1 ? 'Далее' : 'Оформить доставку'}
          </button>
        </div>
      </div>
    </div>
  )
}