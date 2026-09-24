import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Plus, User, Wallet } from 'lucide-react'
import { useWallet } from '../../features/wallet/store'
import { useAuth } from '../../features/auth/useAuth'
import { GoogleSignInButton } from '../../features/auth/GoogleSignInButton'
import { CreateCaseModal } from '../../features/cases/components/CreateCaseModal'
import { useCases } from '../../features/cases/store'
import { isAdmin } from '../../config/admins'
import { cn } from '../utils/cn'

const NAV = [
  { to: '/', label: 'Кейсы' },
  { to: '/bonuses', label: 'Бонусы' },
]

export const Header = () => {
  const { balance } = useWallet()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [createOpen, setCreateOpen] = useState(false)
  const { addCase } = useCases()

  const isProfile = pathname === '/profile'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#06060a]/40 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between gap-8">
          {/* Лого */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <span className="text-white font-black text-xl tracking-[6px] uppercase">
              Drip<span className="text-white/40">cases</span>
            </span>
          </Link>

          {/* Меню по центру */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {NAV.map(({ to, label }) => {
              const isActive = pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'relative text-xs font-bold tracking-[3px] uppercase transition-colors py-2',
                    isActive
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/80'
                  )}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-white" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Правая часть */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Кнопка создать кейс — только админ */}
            {user && isAdmin(user) && (
              <button
                onClick={() => setCreateOpen(true)}
                className="hidden md:flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-white/60 hover:text-white transition-colors"
              >
                <Plus size={14} /> Создать
              </button>
            )}

            {/* Баланс — стеклянная плашка */}
            {user && (
              <button
                onClick={() => navigate('/deposit')}
                className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-blue-500/40 backdrop-blur-md transition-all hover:-translate-y-0.5"
              >
                {/* Мягкое свечение сзади */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Иконка кошелька с синим свечением */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Wallet
                    size={15}
                    className="relative text-blue-400"
                    strokeWidth={2.2}
                  />
                </div>

                {/* Сумма */}
                <span className="relative text-sm  text-white tracking-tight">
                  {balance.toLocaleString('ru-RU')}
                  <span className="text-white/40 ml-1 font-bold">₽</span>
                </span>
              </button>
            )}

            {/* Профиль / вход */}
            {loading ? (
              <div className="w-11 h-11 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <button
                onClick={() => navigate('/profile')}
                className={cn(
                  'group relative flex items-center gap-2.5 pl-1 pr-4 py-1 rounded-full border transition-all hover:-translate-y-0.5',
                  isProfile
                    ? 'bg-white/10 border-white/30'
                    : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/30'
                )}
              >
                {/* Аватарка */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 blur-[2px] opacity-80 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.displayName || 'User'
                      )}&background=3b82f6&color=fff`
                    }
                    alt={user.displayName || 'User'}
                    className="relative w-9 h-9 rounded-full border-2 border-[#06060a] object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.displayName || 'User'
                      )}&background=3b82f6&color=fff`
                    }}
                  />
                  {/* Индикатор онлайн */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#06060a] shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                </div>

                {/* Имя */}
                <span className="hidden md:block text-xs font-bold text-white max-w-[120px] truncate">
                  {user.displayName?.split(' ')[0] || 'Профиль'}
                </span>
              </button>
            ) : (
              <GoogleSignInButton compact />
            )}
          </div>
        </div>
      </header>

      <CreateCaseModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={async (newCase) => {
          try {
            await addCase(newCase)
          } catch (err) {
            alert('Не удалось создать кейс: ' + err.message)
          }
        }}
      />
    </>
  )
}