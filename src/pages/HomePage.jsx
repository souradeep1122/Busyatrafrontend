import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, UserButton, SignInButton } from '@clerk/clerk-react'
import { Bus, ArrowUpDown, Search, ChevronRight } from 'lucide-react'
import StopAutocomplete from '../components/StopAutocomplete'

export default function HomePage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!from.trim() || !to.trim()) return
    navigate(`/results?from=${encodeURIComponent(from.trim())}&to=${encodeURIComponent(to.trim())}`)
  }

  const handleBack = () => navigate('/')

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* ── Top black section ── */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '52%',
          background: '#000000',
          borderRadius: '0 0 29px 29px',
          zIndex: 1,
        }}
      >
        {/* Navbar */}
        <div className="flex items-center justify-between px-6 pt-10">
          <span
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 'clamp(22px, 9vw, 36px)',
              color: '#493491',
              lineHeight: 1,
            }}
          >
            Go<span style={{ color: 'white' }}>Travel</span>
          </span>

          {/* Auth button */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                {user?.primaryEmailAddress?.emailAddress === import.meta.env.VITE_ADMIN_EMAIL && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: 'rgba(97,56,246,0.3)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}
                  >
                    Admin
                  </button>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="text-sm px-4 py-2 rounded-full font-medium transition-all"
                  style={{ background: '#6138f6', color: 'white' }}
                >
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Hero text */}
        <div className="px-8 mt-6">
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 'clamp(18px, 5vw, 28px)',
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            Let's Travel
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 300,
              fontSize: 'clamp(13px, 4vw, 18px)',
              color: '#d1d5db',
              marginTop: '4px',
              textTransform: 'capitalize',
            }}
          >
            Search bus Routes in Kolkata!
          </div>
        </div>

        {/* Bus icon decoration */}
        <div className="absolute right-6 bottom-10 opacity-20">
          <Bus size={64} color="white" />
        </div>
      </div>

      {/* ── Bottom background image ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '55%',
          backgroundImage: 'url(/bus-bg.jpg)',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))' }}
        />
      </div>

      {/* ── Floating Search Card ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: '28%',
          width: 'min(85%, 380px)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #ededed',
            boxShadow: '3px 3px 24px rgba(0,0,0,0.25)',
            borderRadius: '14px',
            padding: 'clamp(20px, 6vw, 28px) clamp(18px, 5vw, 24px)',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 'clamp(14px, 4vw, 18px)',
              color: '#1a1a2e',
              marginBottom: '18px',
            }}
          >
            Where are you going?
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* From input — with autosuggestion */}
            <StopAutocomplete
              id="from-stop"
              value={from}
              onChange={setFrom}
              placeholder="From — e.g. Gariahat"
              pinColor="#6138f6"
            />

            {/* Swap button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              <button
                type="button"
                onClick={handleSwap}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#6138f6'; e.currentTarget.style.borderColor = '#6138f6' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e5e7eb' }}
              >
                <ArrowUpDown size={16} color="#6138f6" />
              </button>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            </div>

            {/* To input — with autosuggestion */}
            <StopAutocomplete
              id="to-stop"
              value={to}
              onChange={setTo}
              placeholder="To — e.g. Esplanade"
              pinColor="#ef4444"
            />

            {/* Search button */}
            <button
              type="submit"
              style={{
                width: '100%',
                height: 'clamp(44px, 12vw, 52px)',
                background: 'linear-gradient(135deg, #6138f6, #4a27d4)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 'clamp(14px, 4vw, 16px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(97,56,246,0.4)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(97,56,246,0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(97,56,246,0.4)' }}
            >
              <Search size={16} />
              Search Buses
            </button>
          </form>
        </div>
      </div>

      {/* ── Bottom tip ── */}
      <div
        className="absolute bottom-6 left-0 right-0 flex justify-center"
        style={{ zIndex: 10 }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Bus size={14} color="#a78bfa" />
          <span style={{ color: '#d1d5db', fontSize: '12px', fontFamily: 'Inter' }}>
            Serving 200+ Kolkata Bus Routes
          </span>
          <ChevronRight size={12} color="#a78bfa" />
        </div>
      </div>
    </div>
  )
}
