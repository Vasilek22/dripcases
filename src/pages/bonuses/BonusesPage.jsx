import { useState } from 'react'
import { Check, ExternalLink, Gift, Clock } from 'lucide-react'
import { useAuth } from '../../features/auth/useAuth'
import { useWallet } from '../../features/wallet/store'
import { useBonuses } from '../../features/bonuses/store'
import { TASKS } from '../../features/bonuses/tasks'

export const BonusesPage = () => {
  const { user } = useAuth()
  const { addFunds } = useWallet()
  const { completed, markCompleted, isCompleted } = useBonuses()
  const [toast, setToast] = useState(null)

  const showToast = (text, type = 'success') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleTask = (task) => {
    if (isCompleted(task.id)) {
      showToast('Это задание уже выполнено', 'info')
      return
    }

    // Ежедневный вход — проверка кулдауна
    if (task.id === 'daily_login') {
      const lastDone = completed[task.id]
      if (lastDone) {
        const hoursPassed = (Date.now() - lastDone) / (1000 * 60 * 60)
        if (hoursPassed < task.cooldownHours) {
          const left = Math.ceil(task.cooldownHours - hoursPassed)
          showToast(`Приходи через ${left} ч.`, 'info')
          return
        }
      }
      addFunds(task.reward)
      markCompleted(task.id)
      showToast(`+${task.reward} ₽ зачислено`, 'success')
      return
    }

    // Пригласи друга — копирование ссылки
    if (task.id === 'invite_friend') {
      const link = `${window.location.origin}/?ref=${user?.uid || 'anon'}`
      navigator.clipboard.writeText(link)
      showToast('Ссылка скопирована', 'success')
      return
    }

    // Первая продажа — проверяем, есть ли уже продажи
    if (task.id === 'first_sale') {
      // TODO: проверка факта продажи из статистики (пока заглушка)
      showToast('Сначала продай хотя бы одну вещь', 'info')
      return
    }

    // TG-канал — открываем ссылку
    if (task.id === 'tg_channel' && task.link) {
      window.open(task.link, '_blank')
      // Даём юзеру время подписаться, потом проверяем
      setTimeout(() => {
        if (window.confirm('Ты подписался на канал?')) {
          addFunds(task.reward)
          markCompleted(task.id)
          showToast(`+${task.reward} ₽ за подписку`, 'success')
        }
      }, 8000)
      return
    }
  }

  // Считаем, сколько заработано с бонусов
  const totalEarned = Object.keys(completed).reduce((sum, id) => {
    const task = TASKS.find((t) => t.id === id)
    return sum + (task?.reward || 0)
  }, 0)

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-10">
      {/* Заголовок */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-br from-orange-500/15 to-pink-500/15 border border-orange-500/30 text-xs font-bold text-orange-300 mb-4">
          <Gift size={13} />
          БОНУСЫ
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-3">
          Заработай{' '}
          <span className="bg-gradient-to-br from-orange-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
            бесплатно
          </span>
        </h1>
        <p className="text-white/50 max-w-xl">
          Выполняй задания — получай деньги на баланс. Никакой халявы,
          только реальные действия.
        </p>
      </div>

      {/* Стата */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[1.8px] font-bold text-white/40 mb-2">
            Заработано с бонусов
          </div>
          <div className="text-3xl font-black bg-gradient-to-br from-green-400 to-cyan-400 bg-clip-text text-transparent">
            {totalEarned.toLocaleString('ru-RU')} ₽
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[1.8px] font-bold text-white/40 mb-2">
            Выполнено заданий
          </div>
          <div className="text-3xl font-black">
            {Object.keys(completed).length} / {TASKS.length}
          </div>
        </div>
      </div>

      {/* Задания */}
      <div className="flex flex-col gap-4">
        {TASKS.map((task) => {
          const done = isCompleted(task.id)
          // Для daily_login проверяем кулдаун
          const isDailyCooldown =
            task.id === 'daily_login' &&
            completed[task.id] &&
            (Date.now() - completed[task.id]) / (1000 * 60 * 60) < task.cooldownHours

          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border backdrop-blur-xl transition-all ${
                done
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-orange-500/5'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Иконка */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    done
                      ? 'bg-green-500/15 border border-green-500/30'
                      : 'bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/30'
                  }`}
                >
                  {done ? <Check size={24} className="text-green-400" /> : task.icon}
                </div>

                {/* Инфо */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-lg font-black tracking-tight">
                      {task.title}
                    </h3>
                    {done && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-green-500/15 border border-green-500/40 text-green-400">
                        Выполнено
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/50 mb-3">{task.description}</p>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Награда */}
                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-br from-green-500/15 to-cyan-500/15 border border-green-500/30 text-sm font-extrabold bg-clip-text text-transparent">
                      +{task.reward} ₽
                    </div>

                    {/* Кнопка */}
                    {!done ? (
                      <button
                        onClick={() => handleTask(task)}
                        disabled={isDailyCooldown}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-sm font-bold shadow-[0_8px_24px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                      >
                        {isDailyCooldown ? (
                          <>
                            <Clock size={14} /> Кулдаун
                          </>
                        ) : task.link ? (
                          <>
                            <ExternalLink size={14} /> {task.actionLabel || 'Перейти'}
                          </>
                        ) : (
                          task.verifyLabel || 'Выполнить'
                        )}
                      </button>
                    ) : (
                      <div className="text-xs text-green-400/70 font-bold">
                        ✓ Бонус получен
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Инфо */}
      <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <h3 className="text-sm font-black mb-3">Как это работает</h3>
        <ul className="text-sm text-white/50 space-y-2">
          <li>• Бонусы зачисляются мгновенно после выполнения задания</li>
          <li>• Ежедневный вход — раз в 24 часа</li>
          <li>• Пригласи друга — он должен зарегаться, ты получишь +500 ₽</li>
          <li>• Всего можно заработать до 1000 ₽ с бонусов</li>
        </ul>
      </div>

      {/* Тост */}
      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold text-sm shadow-2xl backdrop-blur-2xl border transition-all ${
            toast.type === 'success'
              ? 'bg-green-500/90 border-green-400/50 text-white'
              : 'bg-white/10 border-white/20 text-white'
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  )
}