import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '../../shared/ui/Layout'
import { HomePage } from '../../pages/home/HomePage'
import { CaseDetailPage } from '../../pages/case-detail/CaseDetailPage'
import { ProfilePage } from '../../pages/profile/ProfilePage'
import { BonusesPage } from '../../pages/bonuses/BonusesPage'
import { DepositPage } from '../../pages/deposit/DepositPage'
import { RequireAuth } from '../../features/auth/RequireAuth'

// Определяем basename автоматически:
// - на GitHub Pages (vasilek22.github.io/dripcases) — '/dripcases'
// - локально (localhost:3000) — '/'
const basename =
  window.location.hostname === 'localhost'
    ? '/'
    : '/dripcases'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'case/:id', element: <CaseDetailPage /> },
        {
          path: 'deposit',
          element: (
            <RequireAuth>
              <DepositPage />
            </RequireAuth>
          ),
        },
        {
          path: 'bonuses',
          element: (
            <RequireAuth>
              <BonusesPage />
            </RequireAuth>
          ),
        },
        {
          path: 'profile',
          element: (
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          ),
        },
      ],
    },
  ],
  {
    basename,
  }
)

export const AppRouter = () => <RouterProvider router={router} />