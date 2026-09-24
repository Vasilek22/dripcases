import { useEffect, useRef } from 'react'
import { useAuth } from '../auth/useAuth'
import { useWallet } from '../wallet/store'
import { useWardrobe } from '../wardrobe/store'
import { useBonuses } from '../bonuses/store'
import { loadUserData, saveUserData } from './syncData'

// Кэш на уровне модуля — живёт пока открыта вкладка
const syncedUsers = new Set()

export const useUserSync = () => {
  const { user } = useAuth()
  const wallet = useWallet()
  const wardrobe = useWardrobe()
  const bonuses = useBonuses()

  const isFirstSave = useRef(true)

  // === ЗАГРУЗКА ===
  useEffect(() => {
    if (!user) {
      wallet.reset()
      wardrobe.clear()
      bonuses.reset()
      syncedUsers.clear()
      return
    }

    // Уже грузили для этого юзера в этой сессии — пропускаем
    if (syncedUsers.has(user.uid)) {
      isFirstSave.current = false
      return
    }

    let cancelled = false

    loadUserData(user.uid).then((data) => {
      if (cancelled) return

      wallet.setBalance(data.balance || 0)
      wardrobe.setItems(data.wardrobe || [])
      bonuses.setCompleted(data.bonuses || {})

      syncedUsers.add(user.uid)
      isFirstSave.current = true
    })

    return () => {
      cancelled = true
    }
  }, [user?.uid])

  // === СОХРАНЕНИЕ ===
  useEffect(() => {
    if (!user) return
    if (!syncedUsers.has(user.uid)) return

    if (isFirstSave.current) {
      isFirstSave.current = false
      return
    }

    const timer = setTimeout(() => {
      saveUserData(user.uid, {
        balance: wallet.balance,
        wardrobe: wardrobe.items,
        bonuses: bonuses.completed,
      }).catch((err) => console.error('Sync error:', err))
    }, 400)

    return () => clearTimeout(timer)
  }, [user?.uid, wallet.balance, wardrobe.items, bonuses.completed])
}