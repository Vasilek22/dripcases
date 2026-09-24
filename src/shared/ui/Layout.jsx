import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Blobs } from './Blobs'
import { ScrollToTop } from './ScrollToTop'
import { useUserSync } from '../../features/user/useUserSync'
import { useCases } from '../../features/cases/store'

export const Layout = () => {
  useUserSync()

  const subscribe = useCases((s) => s.subscribe)
  const loaded = useCases((s) => s.loaded)

  useEffect(() => {
    if (!loaded) {
      subscribe()
    }
  }, [loaded, subscribe])

  return (
    <div className="relative min-h-screen flex flex-col">
      <ScrollToTop />
      <Blobs />
      <Header />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}