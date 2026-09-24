import { useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useAuthStore } from './store'

export const useAuth = () => {
  const { user, loading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [setUser, setLoading])

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return { user, loading, logout }
}