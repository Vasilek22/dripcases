import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Send,
  Mail,
  ArrowRight,
  Check,
  MessageCircle,
  Play,
} from 'lucide-react'

const COLUMNS = [
  {
    title: 'Платформа',
    links: [
      { label: 'Кейсы', to: '/' },
      { label: 'Бонусы', to: '/bonuses' },
      { label: 'Профиль', to: '/profile' },
      { label: 'Пополнить', to: '/deposit' },
    ],
  },
  {
    title: 'Авторам',
    links: [
      { label: 'Создать кейс', to: '/' },
      { label: 'Статистика', to: '/profile' },
      { label: 'Выплаты', to: '/profile' },
      { label: 'Продвижение', to: '/' },
    ],
  },
  {
    title: 'Помощь',
    links: [
      { label: 'FAQ', to: '/' },
      { label: 'Поддержка', to: '/' },
      { label: 'Оферта', to: '/' },
      { label: 'Контакты', to: '/' },
    ],
  },
]

const SOCIALS = [
  { icon: Send, label: 'Telegram', href: 'https://t.me/' },
  { icon: MessageCircle, label: 'VK', href: 'https://vk.com/' },
  { icon: Play, label: 'YouTube', href: 'https://youtube.com/' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@dripcases.ru' },
]

export const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3500)
  }

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Верхняя граница-градиент */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Мягкое свечение снизу */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-500/[0.06] blur-[150px] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 pt-20 pb-10">
        {/* ГИГАНТСКОЕ ЛОГО + ПОДПИСКА */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 mb-16">
          {/* Левая часть */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <div className="text-white font-black text-3xl md:text-5xl tracking-[8px] uppercase leading-none">
                Drip<span className="text-white/30">cases</span>
              </div>
            </Link>

            <p className="text-white/40 max-w-md text-sm leading-relaxed mb-6">
              Открывай кейсы, собирай образы из реальных вещей, зарабатывай на
              дропах. Платформа для тех, кто ценит стиль и любит риск.
            </p>

            {/* Живой статус */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping" />
              </div>
              <span className="text-xs text-white/60 font-bold">
                247 человек онлайн прямо сейчас
              </span>
            </div>
          </div>

          {/* Правая часть — подписка */}
          <div>
            <div className="text-[11px] font-black tracking-[3px] text-white/40 uppercase mb-4">
              Подпишись на дропы
            </div>
            <div className="text-2xl font-black tracking-tight mb-4">
              Узнавай первым о новых кейсах
            </div>
            <p className="text-white/40 text-sm mb-6">
              Раз в неделю присылаем дайджест: свежие кейсы, топ-дропы, промокоды.
            </p>

            {/* Инпут подписки */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  placeholder="твой@email.ru"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-blue-500/60 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
                />
              </div>
              <button
                onClick={handleSubscribe}
                className={`px-5 rounded-2xl font-black text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
                  subscribed
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black hover:-translate-y-0.5'
                }`}
              >
                {subscribed ? (
                  <>
                    <Check size={14} /> Готово
                  </>
                ) : (
                  <>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>

            <div className="text-[10px] text-white/30 mt-3">
              Подписываясь, ты соглашаешься с политикой конфиденциальности
            </div>
          </div>
        </div>

        {/* ЛИНИЯ-РАЗДЕЛИТЕЛЬ */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* КОЛОНКИ ССЫЛОК */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-black tracking-[2.5px] text-white/40 uppercase mb-5">
                {col.title}
              </div>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-sm text-white/60 hover:text-white transition-colors w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Соцсети */}
          <div>
            <div className="text-[11px] font-black tracking-[2.5px] text-white/40 uppercase mb-5">
              Соцсети
            </div>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    title={s.label}
                    className="group w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 transition-all"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>

            <div className="mt-6 text-[11px] font-black tracking-[2.5px] text-white/40 uppercase mb-3">
              Поддержка
            </div>
            <a
              href="mailto:hello@dripcases.ru"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              hello@dripcases.ru
            </a>
          </div>
        </div>

        {/* ГИГАНТСКОЕ СЛОВО НА ФОНЕ */}
        <div className="relative mb-8 select-none pointer-events-none overflow-hidden">
          <div className="text-center text-[80px] md:text-[160px] lg:text-[200px] font-black tracking-[-8px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.04] to-transparent">
            DRIP
          </div>
        </div>

        {/* НИЖНЯЯ СТРОКА */}
        <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-4">
          <div className="text-xs text-white/30">
            © {new Date().getFullYear()} DRIPCASES. Сделано с 💙 для тех, кто
            любит стиль
          </div>

          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link to="/" className="hover:text-white/60 transition-colors">
              Политика
            </Link>
            <Link to="/" className="hover:text-white/60 transition-colors">
              Условия
            </Link>
            <Link to="/" className="hover:text-white/60 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}