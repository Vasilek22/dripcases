import { create } from 'zustand'

export const useBonuses = create((set, get) => ({
  // Выполненные задания: { [taskId]: timestamp }
  completed: {},
  hydrated: false,

  setCompleted: (completed) => set({ completed, hydrated: true }),

  // Отметить задание выполненным
  markCompleted: (taskId) =>
    set((s) => ({
      completed: { ...s.completed, [taskId]: Date.now() },
    })),

  isCompleted: (taskId) => !!get().completed[taskId],

  reset: () => set({ completed: {}, hydrated: false }),
}))