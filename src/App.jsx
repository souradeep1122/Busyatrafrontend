import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useUser, SignIn, SignUp } from '@clerk/clerk-react'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import AdminDashboard from './pages/AdminDashboard'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@busyatra.com'

function AdminRoute({ children }) {
  const { user, isLoaded } = useUser()
  if (!isLoaded) return null
  const email = user?.primaryEmailAddress?.emailAddress
  if (!email || email !== ADMIN_EMAIL) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cover / landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Search page */}
        <Route path="/search" element={<HomePage />} />

        {/* Results page */}
        <Route path="/results" element={<ResultsPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Auth pages */}
        <Route
          path="/sign-in/*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
              <SignIn routing="path" path="/sign-in" afterSignInUrl="/" />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
              <SignUp routing="path" path="/sign-up" afterSignUpUrl="/" />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
