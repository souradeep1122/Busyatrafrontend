import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { routeAPI } from '../services/api'
import RouteModal from '../components/RouteModal'
import { Bus, LayoutDashboard, List, PlusCircle, Trash2, Edit2, Database, RefreshCw, X, Menu, TrendingUp, Map } from 'lucide-react'

const S = {
  layout: { display:'flex', minHeight:'100vh', background:'#0a0a0f', fontFamily:'Inter,sans-serif' },
  sidebar: { width:240, background:'rgba(255,255,255,0.03)', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', padding:'24px 16px', gap:8, position:'fixed', top:0, bottom:0, left:0, zIndex:30 },
  sidebarMobile: { position:'fixed', top:0, bottom:0, left:0, zIndex:50, width:240, background:'#13131a', borderRight:'1px solid rgba(255,255,255,0.1)', display:'flex', flexDirection:'column', padding:'24px 16px', gap:8 },
  main: { flex:1, marginLeft:240, padding:'32px 28px', overflowY:'auto' },
  mainMobile: { flex:1, padding:'20px 16px', overflowY:'auto' },
  logo: { fontWeight:800, fontSize:20, color:'#a78bfa', marginBottom:16, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.07)' },
  navItem: (active) => ({ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, cursor:'pointer', color: active?'#a78bfa':'#94a3b8', background: active?'rgba(97,56,246,0.15)':'transparent', border: active?'1px solid rgba(97,56,246,0.2)':'1px solid transparent', fontWeight: active?600:400, fontSize:14, transition:'all 0.2s' }),
  card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'22px' },
  statCard: (color) => ({ background:`linear-gradient(135deg, ${color}18, ${color}08)`, border:`1px solid ${color}25`, borderRadius:16, padding:'22px', display:'flex', flexDirection:'column', gap:8 }),
  btn: (variant) => ({ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'Inter', fontWeight:600, fontSize:13, transition:'all 0.2s', ...(variant==='primary'?{background:'#6138f6',color:'white'}:variant==='danger'?{background:'rgba(239,68,68,0.15)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.2)'}:{background:'rgba(255,255,255,0.06)',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.1)'}) }),
  input: { width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'white', fontFamily:'Inter', fontSize:14, outline:'none' },
  label: { fontSize:12, fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6, display:'block' },
  th: { padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:'1px solid rgba(255,255,255,0.07)' },
  td: { padding:'14px 16px', fontSize:13, color:'#d1d5db', borderBottom:'1px solid rgba(255,255,255,0.04)', verticalAlign:'middle' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [routes, setRoutes] = useState([])
  const [stats, setStats] = useState({ totalRoutes:0, totalBuses:0, totalSources:0 })
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editRoute, setEditRoute] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [visits] = useState(() => {
    const v = parseInt(localStorage.getItem('by_visits') || '0') + 1
    localStorage.setItem('by_visits', v)
    return v
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [r, s] = await Promise.all([routeAPI.getAll(), routeAPI.getStats()])
      setRoutes(r.data || [])
      setStats(s.data || {})
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleSeed = async () => {
    setSeeding(true); setSeedMsg('')
    try {
      const r = await routeAPI.seed()
      setSeedMsg(r.message || 'Seeded!')
      await loadData()
    } catch (e) { setSeedMsg('Seed failed: ' + e.message) }
    setSeeding(false)
  }

  const handleDelete = async (id) => {
    try { await routeAPI.delete(id); setDeleteConfirm(null); loadData() } catch (e) { alert(e.message) }
  }

  const handleModalSave = async (data) => {
    try {
      if (editRoute) { await routeAPI.update(editRoute._id, data) }
      else { await routeAPI.create(data) }
      setModalOpen(false); setEditRoute(null); loadData()
    } catch (e) { alert(e.message) }
  }

  const filtered = routes.filter(r =>
    r.busNumber?.toLowerCase().includes(search.toLowerCase()) ||
    r.routeName?.toLowerCase().includes(search.toLowerCase()) ||
    r.source?.toLowerCase().includes(search.toLowerCase()) ||
    r.destination?.toLowerCase().includes(search.toLowerCase())
  )

  const SidebarContent = () => (
    <>
      <div style={S.logo}>🚌 BusYatra Admin</div>
      {[
        { id:'dashboard', label:'Dashboard', icon:<LayoutDashboard size={16}/> },
        { id:'routes', label:'Manage Routes', icon:<List size={16}/> },
      ].map(item => (
        <div key={item.id} style={S.navItem(tab===item.id)} onClick={() => { setTab(item.id); setMobileMenu(false) }}>
          {item.icon}{item.label}
        </div>
      ))}
      <div style={{ flex:1 }}/>
      <div style={S.navItem(false)} onClick={() => navigate('/')}>
        <Bus size={16}/> Back to App
      </div>
      <div style={{ paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:4 }}>
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  )

  const isMobile = window.innerWidth < 768

  return (
    <div style={S.layout}>
      {/* Sidebar desktop */}
      {!isMobile && <div style={S.sidebar}><SidebarContent/></div>}

      {/* Mobile sidebar overlay */}
      {isMobile && mobileMenu && (
        <div style={{ position:'fixed', inset:0, zIndex:40 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} onClick={() => setMobileMenu(false)}/>
          <div style={S.sidebarMobile}><SidebarContent/></div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex:1, marginLeft: isMobile?0:240, padding: isMobile?'16px':'32px 28px', overflowY:'auto' }}>
        {/* Mobile topbar */}
        {isMobile && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <button onClick={() => setMobileMenu(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'white' }}>
              <Menu size={22}/>
            </button>
            <span style={{ fontWeight:700, color:'white' }}>BusYatra Admin</span>
            <UserButton afterSignOutUrl="/"/>
          </div>
        )}

        {/* ── DASHBOARD TAB ── */}
        {tab === 'dashboard' && (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            <div>
              <h1 style={{ fontSize:24, fontWeight:800, color:'white' }}>Dashboard</h1>
              <p style={{ color:'#64748b', fontSize:13, marginTop:4 }}>BusYatra system overview</p>
            </div>

            {/* Stats grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16 }}>
              {[
                { label:'Total Routes', value: loading?'…':stats.totalRoutes, icon:<Map size={20}/>, color:'#6138f6' },
                { label:'Unique Buses', value: loading?'…':stats.totalBuses, icon:<Bus size={20}/>, color:'#a78bfa' },
                { label:'Coverage Areas', value: loading?'…':stats.totalSources, icon:<TrendingUp size={20}/>, color:'#22c55e' },
                { label:'Site Visits', value: visits, icon:<TrendingUp size={20}/>, color:'#f59e0b' },
              ].map(s => (
                <div key={s.label} style={S.statCard(s.color)}>
                  <div style={{ color:s.color }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:800, color:'white' }}>{s.value}</div>
                  <div style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Seed section */}
            <div style={S.card}>
              <div style={{ fontWeight:700, color:'white', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
                <Database size={16} color="#a78bfa"/> Database Management
              </div>
              <p style={{ color:'#64748b', fontSize:13, marginBottom:16 }}>
                Seed the database with all Kolkata bus routes from Busdata.json.
                This will replace existing data.
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                <button style={S.btn('primary')} onClick={handleSeed} disabled={seeding}>
                  {seeding ? <RefreshCw size={14} style={{ animation:'spin 1s linear infinite' }}/> : <Database size={14}/>}
                  {seeding ? 'Seeding…' : 'Seed All Routes'}
                </button>
                {seedMsg && (
                  <span style={{ fontSize:13, color: seedMsg.includes('failed')?'#ef4444':'#22c55e' }}>{seedMsg}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ROUTES TAB ── */}
        {tab === 'routes' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div>
                <h1 style={{ fontSize:24, fontWeight:800, color:'white' }}>Manage Routes</h1>
                <p style={{ color:'#64748b', fontSize:13 }}>{routes.length} routes total</p>
              </div>
              <button style={S.btn('primary')} onClick={() => { setEditRoute(null); setModalOpen(true) }}>
                <PlusCircle size={14}/> Add Route
              </button>
            </div>

            {/* Search */}
            <input
              placeholder="Search by bus number, route, source or destination…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...S.input, marginBottom:4 }}
            />

            {/* Table */}
            <div style={{ ...S.card, padding:0, overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Bus No.','Route Name','Source','Destination','Stops','Actions'].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ ...S.td, textAlign:'center', color:'#64748b', padding:'32px' }}>Loading…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} style={{ ...S.td, textAlign:'center', color:'#64748b', padding:'32px' }}>No routes found</td></tr>
                  ) : filtered.map(r => (
                    <tr key={r._id} style={{ transition:'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <td style={S.td}>
                        <span style={{ background:'linear-gradient(135deg,#6138f6,#4a27d4)', color:'white', padding:'3px 10px', borderRadius:8, fontWeight:700, fontSize:12 }}>
                          {r.busNumber}
                        </span>
                      </td>
                      <td style={{ ...S.td, maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.routeName}</td>
                      <td style={{ ...S.td, color:'#a78bfa' }}>{r.source}</td>
                      <td style={{ ...S.td, color:'#f87171' }}>{r.destination}</td>
                      <td style={{ ...S.td, color:'#94a3b8' }}>{r.stops?.length}</td>
                      <td style={S.td}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button style={S.btn('secondary')} onClick={() => { setEditRoute(r); setModalOpen(true) }}><Edit2 size={13}/></button>
                          <button style={S.btn('danger')} onClick={() => setDeleteConfirm(r._id)}><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Route Modal ── */}
      {modalOpen && (
        <RouteModal
          route={editRoute}
          onSave={handleModalSave}
          onClose={() => { setModalOpen(false); setEditRoute(null) }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#13131a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:28, maxWidth:360, width:'100%' }}>
            <h3 style={{ color:'white', fontWeight:700, marginBottom:10 }}>Delete Route?</h3>
            <p style={{ color:'#94a3b8', fontSize:14, marginBottom:20 }}>This action cannot be undone.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button style={{ ...S.btn('danger'), flex:1, justifyContent:'center' }} onClick={() => handleDelete(deleteConfirm)}>
                <Trash2 size={14}/> Delete
              </button>
              <button style={{ ...S.btn('secondary'), flex:1, justifyContent:'center' }} onClick={() => setDeleteConfirm(null)}>
                <X size={14}/> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
