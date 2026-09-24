import { create } from 'zustand'

export const useTransactions = create((set) => ({
  history: [],
  hydrated: false,

  setHistory: (history) => set({ history, hydrated: true }),

  addTransaction: (tx) =>
    set((s) => ({
      history: [
        {
          id: `tx-${Date.now()}-${Math.random()}`,
          date: Date.now(),
          ...tx,
        },
        ...s.history,
      ],
    })),

  clear: () => set({ history: [], hydrated: false }),
}))