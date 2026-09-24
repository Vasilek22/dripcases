import { useState } from 'react'
import { ArrowLeft, CreditCard, Wallet as WalletIcon, Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWallet } from '../../features/wallet/store'
import { useTransactions } from '../../features/wallet/transactions'

const AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000]

const METHODS = [
  {
    id: 'card',
    label: 'Банковская карта',
    desc: 'Visa, MasterCard, МИР',
    icon: CreditCard,
  },
  {
    id: 'sbp',
    label: 'СБП',
    desc: 'Система быстрых платежей',
    icon: WalletIcon,
  },
  {
    id: 'crypto',
    label: 'Криптовалюта',
    desc: 'USDT, BTC, ETH',
    icon: Sparkles,
  },
]

export const DepositPage = () => {
  const { balance, addFunds } = useWallet()
  const { addTransaction } = useTransactions()

  const [amount, setAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [method, setMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const finalAmount = customAmount ? Number(customAmount) : amount

  const handleTopUp = async () => {
    if (!finalAmount || finalAmount < 100) {
      alert('Минимальная сумма — 100 ₽')
      return
    }

    setLoading(true)

    // Эмуляция платежа (потом подключим ЮKassa)
    setTimeout(() => {
      addFunds(finalAmount)
      addTransaction({
        type: 'deposit',
        amount: finalAmount,
        method: METHODS.find((m) => m.id === method)?.label,
        status: 'success',
      })
      setLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Кнопка назад */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[2px] uppercase text-white/40 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Назад в профиль
        </Link>

        {/* Заголовок */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[11px] font-bold tracking-[3px] text-white/50 uppercase">
              Пополнение
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-[-3px] leading-[0.9] mb-6">
            <span className="text-white">Пополни</span>
            <br />
            <span className="text-white/40">баланс</span>
          </h1>
          <p className="text-white/50 max-w-md">
            Выбери сумму и способ оплаты. Деньги зачислятся мгновенно.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div className="space-y-6">
            {/* Сумма */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
              <div className="text-xs font-bold tracking-[2px] uppercase text-white/50 mb-4">
                Сумма пополнения
              </div>

              {/* Быстрые суммы */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setAmount(a)
                      setCustomAmount('')
                    }}
                    className={`py-4 rounded-2xl border font-black text-base transition-all ${
                      amount === a && !customAmount
                        ? 'bg-white text-black border-white'
                        : 'bg-white/[0.03] border-white/[0.08] text-white/70 hover:bg-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    {a.toLocaleString('ru-RU')} ₽
                  </button>
                ))}
              </div>

              {/* Своя сумма */}
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Своя сумма"
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/60 focus:outline-none text-base font-bold text-white placeholder-white/30 transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 font-bold">
                  ₽
                </span>
              </div>
            </div>

            {/* Способы оплаты */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
              <div className="text-xs font-bold tracking-[2px] uppercase text-white/50 mb-4">
                Способ оплаты
              </div>

              <div className="space-y-2">
                {METHODS.map((m) => {
                  const Icon = m.icon
                  const active = method === m.id
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        active
                          ? 'bg-blue-500/10 border-blue-500/40'
                          : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          active
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-white/[0.04] text-white/50'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">
                          {m.label}
                        </div>
                        <div className="text-xs text-white/40">{m.desc}</div>
                      </div>
                      {active && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ — СВОДКА */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="relative p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl overflow-hidden">
              {/* Свечение */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-500/10 blur-[80px]" />

              <div className="relative">
                <div className="text-xs font-bold tracking-[2px] uppercase text-white/50 mb-6">
                  Детали
                </div>

                {/* Текущий баланс */}
                <div className="mb-6 pb-6 border-b border-white/[0.06]">
                  <div className="text-xs text-white/40 mb-2">
                    Текущий баланс
                  </div>
                  <div className="text-3xl font-black text-white">
                    {balance.toLocaleString('ru-RU')} ₽
                  </div>
                </div>

                {/* Пополнение */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-white/50">Сумма</span>
                    <span className="font-bold text-white">
                      {finalAmount?.toLocaleString('ru-RU') || 0} ₽
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-white/50">Комиссия</span>
                    <span className="font-bold text-green-400">0 ₽</span>
                  </div>
                </div>

                {/* Итого */}
                <div className="pt-4 border-t border-white/[0.06] mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-white/50">К оплате</span>
                    <span className="text-2xl font-black text-white">
                      {finalAmount?.toLocaleString('ru-RU') || 0} ₽
                    </span>
                  </div>
                </div>

                {/* Кнопка */}
                <button
                  onClick={handleTopUp}
                  disabled={loading || !finalAmount}
                  className={`w-full py-4 rounded-2xl font-black text-sm tracking-[2px] uppercase transition-all ${
                    success
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-black hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0'
                  }`}
                >
                  {loading ? 'Обработка...' : success ? '✓ Зачислено' : 'Пополнить'}
                </button>

                <p className="text-[10px] text-white/30 text-center mt-4 leading-relaxed">
                  Нажимая «Пополнить», ты соглашаешься с условиями сервиса
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}