import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

const S = {
  input: { width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'white', fontFamily:'Inter', fontSize:14, outline:'none', marginBottom:14 },
  label: { fontSize:12, fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6, display:'block' },
}

export default function RouteModal({ route, onSave, onClose }) {
  const [busNumber, setBusNumber] = useState(route?.busNumber || '')
  const [routeName, setRouteName] = useState(route?.routeName || '')
  const [source, setSource] = useState(route?.source || '')
  const [destination, setDestination] = useState(route?.destination || '')
  const [stops, setStops] = useState(route?.stops?.join('\n') || '')
  const [saving, setSaving] = useState(false)

  // Auto-fill source/destination from routeName
  useEffect(() => {
    const parts = routeName.split(/ to /i)
    if (parts.length === 2) {
      setSource(parts[0].trim())
      setDestination(parts[1].trim())
    }
  }, [routeName])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const stopsArr = stops.split('\n').map(s => s.trim()).filter(Boolean)
    await onSave({ busNumber: busNumber.trim(), routeName: routeName.trim(), source: source.trim(), destination: destination.trim(), stops: stopsArr })
    setSaving(false)
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#13131a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:28, maxWidth:480, width:'100%', maxHeight:'90vh', overflowY:'auto', fontFamily:'Inter' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h2 style={{ color:'white', fontWeight:700, fontSize:18 }}>{route ? 'Edit Route' : 'Add New Route'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b' }}><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={S.label}>Bus Number</label>
          <input style={S.input} value={busNumber} onChange={e => setBusNumber(e.target.value)} placeholder="e.g. 1A" required />

          <label style={S.label}>Route Name</label>
          <input style={S.input} value={routeName} onChange={e => setRouteName(e.target.value)} placeholder="e.g. Ramnagar to Mukundapur" required />

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={S.label}>Source</label>
              <input style={S.input} value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Ramnagar" required />
            </div>
            <div>
              <label style={S.label}>Destination</label>
              <input style={S.input} value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Mukundapur" required />
            </div>
          </div>

          <label style={S.label}>Stops (one per line)</label>
          <textarea
            style={{ ...S.input, height:160, resize:'vertical', lineHeight:1.6 }}
            value={stops}
            onChange={e => setStops(e.target.value)}
            placeholder={"Stop 1\nStop 2\nStop 3"}
            required
          />

          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button
              type="submit"
              disabled={saving}
              style={{ flex:1, padding:'11px', background:'linear-gradient(135deg,#6138f6,#4a27d4)', border:'none', borderRadius:12, color:'white', fontFamily:'Inter', fontWeight:700, fontSize:14, cursor:'pointer' }}
            >
              {saving ? 'Saving…' : route ? 'Update Route' : 'Create Route'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ padding:'11px 20px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#94a3b8', fontFamily:'Inter', fontWeight:600, fontSize:14, cursor:'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
