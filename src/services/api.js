import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use((config) => {
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error'
    return Promise.reject(new Error(message))
  }
)

// ── Route APIs ────────────────────────────────

export const routeAPI = {
  getAll: () => api.get('/routes'),
  search: (from, to) => api.get(`/routes/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
  getStats: () => api.get('/routes/stats'),
  getSuggestions: (q) => api.get(`/routes/stops?q=${encodeURIComponent(q)}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`),
  seed: () => api.post('/routes/seed'),
}

export default api
