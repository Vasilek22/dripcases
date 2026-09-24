import { create } from 'zustand'

export const useWardrobe = create((set, get) => ({
  items: [],
  hydrated: false,

  setItems: (items) => set({ items, hydrated: true }),

  addItem: (item) =>
    set((s) => {
      if (s.items.find((i) => i.uid === item.uid)) return s
      return { items: [...s.items, item] }
    }),

  // Добавить НЕСКОЛЬКО вещей сразу
  addItems: (newItems) =>
    set((s) => {
      const filtered = newItems.filter(
        (ni) => !s.items.find((i) => i.uid === ni.uid)
      )
      return { items: [...s.items, ...filtered] }
    }),

  removeItem: (uid) =>
    set((s) => ({ items: s.items.filter((i) => i.uid !== uid) })),

  markShipped: (uids, deliveryInfo) =>
    set((s) => ({
      items: s.items.map((i) =>
        uids.includes(i.uid)
          ? { ...i, delivery: deliveryInfo, status: 'shipping' }
          : i
      ),
    })),

  removeItems: (uids) =>
    set((s) => ({ items: s.items.filter((i) => !uids.includes(i.uid)) })),

  clear: () => set({ items: [], hydrated: false }),
}))