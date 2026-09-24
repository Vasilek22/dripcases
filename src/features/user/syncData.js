import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

const initialUserData = {
  balance: 0,
  wardrobe: [],
  listings: [],
  bonuses: {},
  createdAt: Date.now(),
}

// Загрузить данные пользователя
export async function loadUserData(uid) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    return { ...initialUserData, ...snap.data() }
  }

  // Новый юзер — создаём документ с нулями
  await setDoc(ref, initialUserData)
  return initialUserData
}

// Сохранить данные пользователя
export async function saveUserData(uid, data) {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, data, { merge: true })
}

// Сохранить только баланс (для быстрых операций)
export async function saveBalance(uid, balance) {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, { balance }, { merge: true })
}

// Сохранить только гардероб
export async function saveWardrobe(uid, wardrobe) {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, { wardrobe }, { merge: true })
}

// Сохранить только листинги
export async function saveListings(uid, listings) {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, { listings }, { merge: true })
}