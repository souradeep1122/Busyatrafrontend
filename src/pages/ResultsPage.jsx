import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react'
import { routeAPI } from '../services/api'
import BusCard from '../components/BusCard'
import StopAutocomplete from '../components/StopAutocomplete'
import { ArrowLeft, Search, Bus, AlertCircle, Lock } from 'lucide-react'

export default function ResultsPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const from = params.get('from') || ''
  const to = params.get('to') || ''

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fromInput, setFromInput] = useState(from)
  const [toInput, setToInput] = useState(to)

  useEffect(() => {
    if (from && to) fetchResults(from, to)
  }, [from, to])

  // Keep inputs in sync when URL params change
  useEffect(() => { setFromInput(from) }, [from])
  useEffect(() => { setToInput(to) }, [to])

  const fetchResults = async (f, t) => {
    setLoading(true)
    setError(null)
    try {
      const res = await routeAPI.search(f, t)
      setResults(res.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!fromInput.trim() || !toInput.trim()) return
    navigate(`/results?from=${encodeURIComponent(fromInput.trim())}&to=${encodeURIComponent(toInput.trim())}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Sticky Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #000000, #13131a)',
        padding: '14px 16px 0',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => navigate('/search')}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <ArrowLeft size={17} color="white" />
            </button>
            <div>
              <div style={{ fontWeight: 700, fontSize: '17px', color: 'white' }}>Bus Results</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{from} → {to}</div>
            </div>
          </div>

          {/* Auth area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button style={{
                  fontSize: '12px', padding: '6px 14px', borderRadius: '20px',
                  background: '#6138f6', color: 'white', border: 'none',
                  cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <Lock size={11} /> Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Search bar with autocomplete — dark theme variant */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', paddingBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <DarkStopAutocomplete
              value={fromInput}
              onChange={setFromInput}
              placeholder="From"
              pinColor="#6138f6"
              id="results-from"
            />
          </div>
          <div style={{ flex: 1 }}>
            <DarkStopAutocomplete
              value={toInput}
              onChange={setToInput}
              placeholder="To"
              pinColor="#ef4444"
              id="results-to"
            />
          </div>
          <button
            type="submit"
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#6138f6', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Search size={16} color="white" />
          </button>
        </form>
      </div>

      {/* ── Auth nudge banner (non-signed-in users) ── */}
      {!isSignedIn && !loading && results.length > 0 && (
        <div style={{
          margin: '12px 16px 0',
          padding: '10px 14px',
          borderRadius: '12px',
          background: 'rgba(97,56,246,0.08)',
          border: '1px solid rgba(97,56,246,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={14} color="#a78bfa" />
            <span style={{ fontSize: '13px', color: '#a78bfa', fontFamily: 'Inter' }}>
              Sign in to unlock full stop-by-stop routes
            </span>
          </div>
          <SignInButton mode="modal">
            <button style={{
              fontSize: '12px', padding: '5px 14px', borderRadius: '8px',
              background: '#6138f6', color: 'white', border: 'none',
              cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600,
            }}>Sign In Free</button>
          </SignInButton>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ padding: '16px 16px 32px', maxWidth: '640px', margin: '0 auto' }}>

        {/* Loading Skeletons */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            padding: '48px 24px', textAlign: 'center',
          }}>
            <AlertCircle size={48} color="#ef4444" />
            <div style={{ color: '#ef4444', fontWeight: 600 }}>Something went wrong</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>{error}</div>
            <button
              onClick={() => fetchResults(from, to)}
              style={{
                padding: '10px 24px', borderRadius: '10px',
                background: '#6138f6', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'Inter',
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && results.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            padding: '48px 24px', textAlign: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(97,56,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bus size={36} color="#6138f6" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '18px', color: 'white' }}>No buses found</div>
            <div style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
              No direct bus connects <span style={{ color: '#a78bfa' }}>{from}</span> to{' '}
              <span style={{ color: '#a78bfa' }}>{to}</span>.<br />
              Try searching with nearby stops.
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <>
            <div style={{ margin: '8px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                <span style={{ color: 'white', fontWeight: 600 }}>{results.length}</span> bus{results.length !== 1 ? 'es' : ''} found
              </div>
              <div style={{
                fontSize: '11px', padding: '4px 12px', borderRadius: '20px',
                background: 'rgba(97,56,246,0.15)', color: '#a78bfa', border: '1px solid rgba(97,56,246,0.3)',
              }}>
                Direct Routes
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {results.map((bus, idx) => (
                <div
                  key={bus._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <BusCard bus={bus} from={from} to={to} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Dark-themed StopAutocomplete for the results header ── */
import { useState as useS, useEffect as useE, useRef, useCallback } from 'react'
import { MapPin } from 'lucide-react'

function DarkStopAutocomplete({ value, onChange, placeholder, pinColor, id }) {
  const [suggestions, setSuggestions] = useS([])
  const [open, setOpen] = useS(false)
  const [activeIdx, setActiveIdx] = useS(-1)
  const timerRef = useRef(null)
  const containerRef = useRef(null)

  const fetchSugg = useCallback((q) => {
    clearTimeout(timerRef.current)
    if (!q || q.length < 2) { setSuggestions([]); setOpen(false); return }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await routeAPI.getSuggestions(q)
        setSuggestions(res.data || [])
        setOpen(true)
        setActiveIdx(-1)
      } catch { setSuggestions([]); setOpen(false) }
    }, 220)
  }, [])

  useE(() => {
    const h = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); onChange(suggestions[activeIdx]); setSuggestions([]); setOpen(false) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <MapPin size={13} color={pinColor} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, pointerEvents: 'none' }} />
      <input
        id={id}
        type="text"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={e => { onChange(e.target.value); fetchSugg(e.target.value) }}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%', height: '40px', paddingLeft: '28px', paddingRight: '8px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: open && suggestions.length > 0 ? '10px 10px 0 0' : '10px',
          color: 'white', fontSize: '13px', outline: 'none', fontFamily: 'Inter',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = '#6138f6'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
      />
      {open && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#13131a', border: '1px solid #6138f6', borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          listStyle: 'none', margin: 0, padding: '4px 0', zIndex: 999,
          maxHeight: '180px', overflowY: 'auto',
        }}>
          {suggestions.map((s, i) => (
            <li
              key={s}
              onMouseDown={() => { onChange(s); setSuggestions([]); setOpen(false) }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                padding: '9px 12px 9px 28px', fontSize: '13px', fontFamily: 'Inter',
                color: activeIdx === i ? '#ffffff' : '#d1d5db',
                background: activeIdx === i ? 'rgba(97,56,246,0.35)' : 'transparent',
                cursor: 'pointer', transition: 'background 0.1s',
              }}
            >
              <DarkHighlight text={s} query={value} active={activeIdx === i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DarkHighlight({ text, query, active }) {
  if (!query) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <strong style={{ color: active ? '#fff' : '#a78bfa', fontWeight: 700 }}>
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </span>
  )
}
