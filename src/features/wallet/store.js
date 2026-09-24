import { create } from 'zustand'

export const useWallet = create((set, get) => ({
  balance: 0,
  hydrated: false, // загружено ли из Firestore

  setBalance: (value) => set({ balance: value }),
  addFunds: (amount) => set((s) => ({ balance: s.balance + amount })),
  spend: (amount) => {
    if (get().balance < amount) return false
    set((s) => ({ balance: s.balance - amount }))
    return true
  },
  reset: () => set({ balance: 0, hydrated: false }),
}))