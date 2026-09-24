import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />

  return children
}