// src/admin/Inquiries.tsx
import { useCallback, useEffect, useState } from 'react'
import { LoaderCircle, Mail, MessageCircle, RefreshCw } from 'lucide-react'
import { supabase } from '../lib'

const statuses = ['new', 'contacted', 'quoted', 'in_progress', 'closed', 'spam'] as const
type Status = typeof statuses[number]

type Inquiry = {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  country: string
  company: string
  content_type: string
  project_summary: string
  episodes_per_week: number
  minutes_per_episode: number
  weeks_per_month: number
  monthly_minutes: number
  estimated_monthly_usd: number
  preferred_contact: string
  inquiry_type: string
  status: Status
}

const label = (s: string) => s.replace('_', ' ')

export default function Inquiries() {
  const [items, setItems] = useState<Inquiry[]>([])
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true); setError('')
    const { data, error: err } = await supabase.from('iq_create_inquiries').select('*').order('created_at', { ascending: false }).limit(300)
    if (err) setError(err.message)
    else setItems(data as Inquiry[])
    setLoading(false)
  }, [])

  useEffect(() => { void load() }, [load])

  async function setStatus(id: string, status: Status) {
    if (!supabase) return
    const previous = items
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    const { error: err } = await supabase.from('iq_create_inquiries').update({ status }).eq('id', id)
    if (err) { setItems(previous); setError(err.message) } else setError('')
  }

  const counts = (s: Status) => items.filter(i => i.status === s).length
  const shown = filter === 'all' ? items : items.filter(i => i.status === filter)

  return <div className="adm-stack">
    <div className="adm-toolbar">
      <div className="adm-chips">
        <button type="button" className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>All ({items.length})</button>
        {statuses.map(s => <button type="button" key={s} className={filter === s ? 'on' : ''} onClick={() => setFilter(s)}>{label(s)} ({counts(s)})</button>)}
      </div>
      <button type="button" className="adm-btn adm-btn-ghost" onClick={() => void load()}><RefreshCw size={14}/> Refresh</button>
    </div>
    {error && <div className="adm-msg-error">{error}</div>}
    {loading ? <div className="adm-empty"><LoaderCircle className="spin" size={18}/> Loading inquiries…</div>
      : !shown.length ? <div className="adm-empty">No inquiries here yet.</div>
      : shown.map(i => {
        const digits = i.phone.replace(/\D/g, '')
        return <article className="adm-card adm-inquiry" key={i.id}>
          <header>
            <div><strong>{i.name}</strong>{i.company && <span className="adm-muted"> · {i.company}</span>}<div className="adm-muted">{new Date(i.created_at).toLocaleString()}{i.country && ` · ${i.country}`}</div></div>
            <select aria-label="Status" className={`adm-status adm-status-${i.status}`} value={i.status} onChange={e => void setStatus(i.id, e.target.value as Status)}>{statuses.map(s => <option key={s} value={s}>{label(s)}</option>)}</select>
          </header>
          <div className="adm-meta"><span>{i.content_type}</span>{i.monthly_minutes > 0 && <span>{i.episodes_per_week} ep/wk · {i.minutes_per_episode} min · {i.weeks_per_month} wks = {i.monthly_minutes} min</span>}{i.estimated_monthly_usd > 0 && <span>Estimate ${i.estimated_monthly_usd.toLocaleString()}/mo</span>}<span>Prefers {i.preferred_contact}</span></div>
          <p className="adm-summary">{i.project_summary}</p>
          <div className="adm-contact">
            <a href={`mailto:${i.email}`}><Mail size={14}/> {i.email}</a>
            {digits.length >= 7 && <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer"><MessageCircle size={14}/> {i.phone}</a>}
            {i.phone && digits.length < 7 && <span>{i.phone}</span>}
          </div>
        </article>
      })}
  </div>
}
