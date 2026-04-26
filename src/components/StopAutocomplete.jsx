import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin } from 'lucide-react'
import { routeAPI } from '../services/api'

/**
 * StopAutocomplete — an input with live route-stop suggestions fetched from the backend.
 *
 * Props:
 *  value        string      – controlled value
 *  onChange     fn(str)     – called whenever value changes
 *  placeholder  string
 *  pinColor     string      – colour for the MapPin icon
 *  id           string      – input id (for a11y)
 */
export default function StopAutocomplete({ value, onChange, placeholder, pinColor = '#6138f6', id }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const timerRef = useRef(null)
  const containerRef = useRef(null)

  // Debounced fetch
  const fetchSuggestions = useCallback((q) => {
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

  const handleChange = (e) => {
    onChange(e.target.value)
    fetchSuggestions(e.target.value)
  }

  const handleSelect = (stop) => {
    onChange(stop)
    setSuggestions([])
    setOpen(false)
  }

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      handleSelect(suggestions[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Pin icon */}
      <MapPin
        size={16}
        color={pinColor}
        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, pointerEvents: 'none' }}
      />

      {/* Input */}
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value.length >= 2 && suggestions.length > 0 && setOpen(true)}
        style={{
          width: '100%',
          height: 'clamp(44px, 14vw, 52px)',
          paddingLeft: '40px',
          paddingRight: '12px',
          background: '#f8f9fa',
          border: '1px solid #d5cfcf',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.08)',
          borderRadius: open && suggestions.length > 0 ? '10px 10px 0 0' : '10px',
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          color: '#1a1a2e',
          outline: 'none',
          fontFamily: 'Inter',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocusCapture={(e) => {
          e.target.style.borderColor = '#6138f6'
          e.target.style.boxShadow = '0 0 0 3px rgba(97,56,246,0.1)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d5cfcf'
          e.target.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.08)'
        }}
      />

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #6138f6',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            boxShadow: '0 8px 24px rgba(97,56,246,0.15)',
            listStyle: 'none',
            margin: 0,
            padding: '4px 0',
            zIndex: 999,
            maxHeight: '220px',
            overflowY: 'auto',
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={s}
              onMouseDown={() => handleSelect(s)}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                padding: '10px 14px 10px 38px',
                fontSize: '14px',
                fontFamily: 'Inter',
                color: activeIdx === i ? '#ffffff' : '#1a1a2e',
                background: activeIdx === i ? 'linear-gradient(90deg,#6138f6,#4a27d4)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.12s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
              }}
            >
              {/* Highlight matched portion */}
              <HighlightMatch text={s} query={value} active={activeIdx === i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Highlights the matching substring inside a suggestion */
function HighlightMatch({ text, query, active }) {
  if (!query) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <strong style={{ color: active ? '#ffffffcc' : '#6138f6', fontWeight: 700 }}>
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </span>
  )
}
