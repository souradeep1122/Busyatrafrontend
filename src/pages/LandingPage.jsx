import { useNavigate } from 'react-router-dom'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react'
import { Bus, MapPin, Shield, Zap, ChevronRight, Star, Navigation, Route } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '16px 24px',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 800, fontSize: '22px', color: '#6138f6', letterSpacing: '-0.5px' }}>
          Go<span style={{ color: 'white' }}>Travel</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isSignedIn ? (
            <>
              {user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL && (
                <button onClick={() => navigate('/admin')} style={{
                  fontSize: '13px', padding: '7px 16px', borderRadius: '20px',
                  background: 'rgba(97,56,246,0.2)', color: '#a78bfa',
                  border: '1px solid rgba(167,139,250,0.3)', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600,
                }}>Admin</button>
              )}
              <button onClick={() => navigate('/search')} style={{
                fontSize: '13px', padding: '7px 18px', borderRadius: '20px',
                background: '#6138f6', color: 'white', border: 'none',
                cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600,
              }}>Search Buses</button>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button style={{
                  fontSize: '13px', padding: '7px 18px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.07)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontFamily: 'Inter',
                }}>Sign In</button>
              </SignInButton>
              <button onClick={() => navigate('/search')} style={{
                fontSize: '13px', padding: '7px 18px', borderRadius: '20px',
                background: '#6138f6', color: 'white', border: 'none',
                cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600,
              }}>Search Buses</button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>

        {/* Animated blobs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(97,56,246,0.18) 0%, transparent 70%)',
          animation: 'blobFloat 8s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '5%', width: '300px', height: '300px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
          animation: 'blobFloat 10s ease-in-out infinite reverse', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', right: '20%', width: '200px', height: '200px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
          animation: 'blobFloat 7s ease-in-out infinite 2s', pointerEvents: 'none',
        }} />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(97,56,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(97,56,246,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '780px', width: '100%' }}>
          {/* Pill badge */}
          <div className="hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', borderRadius: '40px', marginBottom: '28px',
            background: 'rgba(97,56,246,0.12)', border: '1px solid rgba(97,56,246,0.3)',
            fontSize: '13px', color: '#a78bfa', fontWeight: 600, animation: 'fadeInDown 0.6s ease forwards',
          }}>
            <Bus size={14} /> Kolkata's Smartest Bus Finder
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 900, lineHeight: 1.05, color: 'white',
            marginBottom: '24px', letterSpacing: '-2px',
            animation: 'fadeInUp 0.7s ease 0.1s both',
          }}>
            Find Your Bus,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6138f6, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Instantly.</span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(16px, 3vw, 20px)', color: '#94a3b8', lineHeight: 1.7,
            maxWidth: '560px', margin: '0 auto 36px',
            animation: 'fadeInUp 0.7s ease 0.2s both',
          }}>
            Search 200+ Kolkata bus routes by stop. Get real-time route maps,
            boarding &amp; alighting stops — all in one tap.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeInUp 0.7s ease 0.3s both',
          }}>
            <button
              onClick={() => navigate('/search')}
              style={{
                padding: '14px 32px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #6138f6, #4a27d4)',
                color: 'white', fontWeight: 700, fontSize: '16px',
                cursor: 'pointer', fontFamily: 'Inter',
                boxShadow: '0 8px 32px rgba(97,56,246,0.4)',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(97,56,246,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(97,56,246,0.4)' }}
            >
              <Navigation size={18} /> Search Buses <ChevronRight size={16} />
            </button>
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button style={{
                  padding: '14px 32px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white', fontWeight: 600, fontSize: '16px',
                  cursor: 'pointer', fontFamily: 'Inter',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <Star size={18} style={{ color: '#f59e0b' }} /> Sign Up Free
                </button>
              </SignInButton>
            )}
          </div>

          {/* Trust strip */}
          <div style={{
            marginTop: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap',
            animation: 'fadeInUp 0.7s ease 0.4s both',
          }}>
            {[
              { n: '200+', label: 'Bus Routes' },
              { n: '1000+', label: 'Unique Stops' },
              { n: '100%', label: 'Free to Use' },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>{n}</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: '20px', marginBottom: '16px',
            background: 'rgba(97,56,246,0.1)', border: '1px solid rgba(97,56,246,0.2)',
            fontSize: '12px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Features</div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: 'white', letterSpacing: '-1px', lineHeight: 1.1 }}>
            Everything you need to<br />
            <span style={{ color: '#6138f6' }}>travel smarter</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            {
              icon: <Navigation size={24} />, color: '#6138f6',
              title: 'Stop-by-Stop Navigation',
              desc: 'Search by any stop name — not just terminals. Find which bus passes through your exact location.',
            },
            {
              icon: <Zap size={24} />, color: '#f59e0b',
              title: 'Instant Results',
              desc: 'Smart matching algorithm scans 200+ routes instantly. No waiting, no signup required for basic search.',
            },
            {
              icon: <Route size={24} />, color: '#22c55e',
              title: 'Full Route Maps',
              desc: 'See every stop on the route with board & alight markers highlighted for your journey. Sign in to unlock.',
            },
            {
              icon: <MapPin size={24} />, color: '#ef4444',
              title: 'Autosuggestions',
              desc: 'As you type, real stop names pop up instantly — no need to remember exact spellings.',
            },
            {
              icon: <Shield size={24} />, color: '#a78bfa',
              title: 'Secure & Private',
              desc: 'Your search data stays private. Clerk-powered authentication keeps your account safe.',
            },
            {
              icon: <Bus size={24} />, color: '#06b6d4',
              title: 'Kolkata Coverage',
              desc: "Comprehensive dataset of Kolkata's WBTC and private bus network — constantly updated.",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '28px', transition: 'all 0.25s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.055)'
                e.currentTarget.style.borderColor = `rgba(97,56,246,0.3)`
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(97,56,246,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', marginBottom: '18px',
                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color,
              }}>
                {f.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: '17px', color: 'white', marginBottom: '10px' }}>{f.title}</div>
              <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: '20px', marginBottom: '16px',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            fontSize: '12px', color: '#22c55e', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 800, color: 'white', marginBottom: '48px', letterSpacing: '-1px' }}>
            3 steps to your bus
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', title: 'Enter Your Stop', desc: 'Type any stop name — autosuggestions will guide you.', color: '#6138f6' },
              { step: '02', title: 'See Matching Buses', desc: 'All direct routes are shown instantly with stop counts.', color: '#a78bfa' },
              { step: '03', title: 'Board & Travel', desc: 'Sign in to unlock full route maps with board/alight markers.', color: '#22c55e' },
            ].map((s) => (
              <div key={s.step} style={{ padding: '28px 24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'left' }}>
                <div style={{ fontSize: '40px', fontWeight: 900, color: `${s.color}40`, marginBottom: '16px', letterSpacing: '-2px' }}>{s.step}</div>
                <div style={{ fontWeight: 700, fontSize: '17px', color: 'white', marginBottom: '8px' }}>{s.title}</div>
                <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Auth CTA Banner ── */}
      {!isSignedIn && (
        <section style={{ padding: '80px 24px' }}>
          <div style={{
            maxWidth: '700px', margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(97,56,246,0.15), rgba(167,139,250,0.08))',
            border: '1px solid rgba(97,56,246,0.25)',
            borderRadius: '28px', padding: 'clamp(36px,6vw,60px)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '200px', height: '200px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(97,56,246,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(97,56,246,0.2)', border: '1px solid rgba(97,56,246,0.3)' }}>
              <Shield size={26} color="#a78bfa" />
            </div>
            <h3 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: 'white', marginBottom: '14px', letterSpacing: '-0.5px' }}>
              Unlock Full Route Details
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px' }}>
              Sign up for free to see complete stop-by-stop routes, board &amp; alight points, and more.
            </p>
            <SignInButton mode="modal">
              <button style={{
                padding: '14px 36px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #6138f6, #4a27d4)',
                color: 'white', fontWeight: 700, fontSize: '16px',
                cursor: 'pointer', fontFamily: 'Inter',
                boxShadow: '0 8px 32px rgba(97,56,246,0.4)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Create Free Account
              </button>
            </SignInButton>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px',
        textAlign: 'center', color: '#334155', fontSize: '13px',
      }}>
        <span style={{ color: '#6138f6', fontWeight: 700 }}>GoTravel</span> © {new Date().getFullYear()} · Built for Kolkata
      </footer>

      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
