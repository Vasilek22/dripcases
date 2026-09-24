import { create } from 'zustand'
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { auth } from '../../lib/firebase'
import { isAdmin } from '../../config/admins'

export const useCases = create((set, get) => ({
  cases: [],
  loading: true,
  loaded: false,
  unsubscribe: null,

  subscribe: () => {
    const state = get()

    // Уже подписаны — не пересоздаём
    if (state.unsubscribe) return

    const unsubscribe = onSnapshot(
      collection(db, 'cases'),
      (snapshot) => {
        const cases = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        cases.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        set({ cases, loading: false, loaded: true })
      },
      (error) => {
        console.error('Ошибка загрузки кейсов:', error)
        set({ loading: false, loaded: true })
      }
    )

    set({ unsubscribe })
  },

  unsubscribeAll: () => {
    const state = get()
    if (state.unsubscribe) {
      state.unsubscribe()
      set({ unsubscribe: null })
    }
  },

addCase: async (newCase) => {
  const currentUser = auth.currentUser
  if (!currentUser || !isAdmin(currentUser)) {
    throw new Error('Нет прав для создания кейсов')
  }

  try {
    const docRef = await addDoc(collection(db, 'cases'), {
      ...newCase,
      authorId: currentUser.uid, // привязка к создателю
      author: newCase.author || '@you',
      verified: false,
      likes: 0,
      badge: 'new',
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Ошибка создания кейса:', error)
    throw error
  }
},

  removeCase: async (id) => {
    const { deleteDoc, doc } = await import('firebase/firestore')
    try {
      await deleteDoc(doc(db, 'cases', id))
    } catch (error) {
      console.error('Ошибка удаления кейса:', error)
    }
  },

  reset: () => set({ cases: [], loaded: false }),
}))