// Список email'ов, которые могут создавать кейсы
export const ADMIN_EMAILS = [
  'misavasin228@gmail.com', // ← ЗАМЕНИ НА СВОЙ GOOGLE EMAIL
]

export const isAdmin = (user) => {
  if (!user?.email) return false
  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}