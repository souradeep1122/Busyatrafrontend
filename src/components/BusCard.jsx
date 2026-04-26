import { useState } from 'react'
import { Bus, ChevronDown, ChevronUp, MapPin, Lock } from 'lucide-react'
import { useUser, SignInButton } from '@clerk/clerk-react'

export default function BusCard({ bus, from, to }) {
  const [expanded, setExpanded] = useState(false)
  const { isSignedIn } = useUser()

  const fromLower = from?.toLowerCase() || ''
  const toLower = to?.toLowerCase() || ''

  const fromIdx = bus.stops.findIndex((s) => s.toLowerCase().includes(fromLower) || fromLower.includes(s.toLowerCase()))
  const toIdx = bus.stops.findIndex((s) => s.toLowerCase().includes(toLower) || toLower.includes(s.toLowerCase()))
  const stopsBetween = Math.abs(toIdx - fromIdx)

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '18px',
        transition: 'all 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(97,56,246,0.4)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(97,56,246,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* ── Card Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Bus number badge */}
          <div
            style={{
              minWidth: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6138f6, #4a27d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              boxShadow: '0 4px 12px rgba(97,56,246,0.4)',
            }}
          >
            <span style={{ color: 'white', fontWeight: 800, fontSize: bus.busNumber.length > 3 ? '11px' : '16px', fontFamily: 'Inter' }}>
              {bus.busNumber}
            </span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'white', fontFamily: 'Inter' }}>
              {bus.routeName}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', fontFamily: 'Inter' }}>
              {isSignedIn ? `${bus.stops.length} stops total` : `${stopsBetween} stops between`}
            </div>
          </div>
        </div>

        {/* Direct badge */}
        <div
          style={{
            fontSize: '11px', fontWeight: 600,
            padding: '4px 10px', borderRadius: '20px',
            background: 'rgba(34,197,94,0.1)', color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.2)',
            flexShrink: 0,
          }}
        >
          Direct
        </div>
      </div>

      {/* ── Route summary ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
          padding: '10px 14px', marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={12} color="#6138f6" />
            <span style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 500, fontFamily: 'Inter' }}>
              {bus.stops[fromIdx] || from}
            </span>
          </div>
          <div
            style={{
              marginLeft: '6px',
              height: '14px',
              borderLeft: '2px dashed rgba(255,255,255,0.15)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={12} color="#ef4444" />
            <span style={{ fontSize: '13px', color: '#f87171', fontWeight: 500, fontFamily: 'Inter' }}>
              {bus.stops[toIdx] || to}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Inter' }}>Stops</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', fontFamily: 'Inter' }}>
            {stopsBetween}
          </div>
        </div>
      </div>

      {/* ── Stops list (logged-in only) ── */}
      {isSignedIn ? (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(expanded ? bus.stops : bus.stops.slice(Math.max(0, fromIdx), toIdx + 1)).map((stop, i) => {
              const absIdx = expanded ? i : fromIdx + i
              const isFrom = absIdx === fromIdx
              const isTo = absIdx === toIdx
              const isHighlighted = absIdx >= fromIdx && absIdx <= toIdx

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '5px 8px', borderRadius: '8px',
                    background: isFrom || isTo ? 'rgba(97,56,246,0.1)' : isHighlighted ? 'rgba(255,255,255,0.02)' : 'transparent',
                    border: isFrom || isTo ? '1px solid rgba(97,56,246,0.2)' : '1px solid transparent',
                  }}
                >
                  <div
                    style={{
                      width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                      background: isFrom ? '#6138f6' : isTo ? '#ef4444' : isHighlighted ? '#a78bfa' : 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '13px', fontFamily: 'Inter',
                      color: isFrom ? '#a78bfa' : isTo ? '#f87171' : isHighlighted ? '#d1d5db' : '#64748b',
                      fontWeight: isFrom || isTo ? 600 : 400,
                    }}
                  >
                    {stop}
                  </span>
                  {isFrom && (
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#6138f6', fontWeight: 600 }}>BOARD</span>
                  )}
                  {isTo && (
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#ef4444', fontWeight: 600 }}>ALIGHT</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Toggle expand */}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: '100%', marginTop: '10px', padding: '8px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Inter',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(97,56,246,0.1)'; e.currentTarget.style.color = '#a78bfa' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#94a3b8' }}
          >
            {expanded ? <><ChevronUp size={14} /> Show Route Only</> : <><ChevronDown size={14} /> Show All {bus.stops.length} Stops</>}
          </button>
        </div>
      ) : (
        /* ── Locked state for guests ── */
        <SignInButton mode="modal">
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', borderRadius: '12px',
              background: 'rgba(97,56,246,0.07)',
              border: '1px dashed rgba(97,56,246,0.3)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(97,56,246,0.13)'; e.currentTarget.style.borderColor = 'rgba(97,56,246,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(97,56,246,0.07)'; e.currentTarget.style.borderColor = 'rgba(97,56,246,0.3)' }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: 'rgba(97,56,246,0.2)', border: '1px solid rgba(97,56,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={16} color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa', fontFamily: 'Inter' }}>
                Sign in to see full route
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontFamily: 'Inter' }}>
                View all stops, board &amp; alight points — free
              </div>
            </div>
          </div>
        </SignInButton>
      )}
    </div>
  )
}
