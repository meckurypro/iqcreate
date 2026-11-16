// src/pages/Admin.tsx
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, LoaderCircle, LogOut } from 'lucide-react'
import '../admin/admin.css'
import { useAdmin } from '../admin/useAdmin'
import PricingEditor from '../admin/PricingEditor'
import Inquiries from '../admin/Inquiries'

export default function Admin() {
  const admin = useAdmin()
  const [tab, setTab] = useState<'pricing' | 'inquiries'>('pricing')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'IQ Create Admin'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex,nofollow'
    document.head.appendChild(meta)
    return () => { document.title = previousTitle; meta.remove() }
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true); setError('')
    setError(await admin.signIn(email, password))
    setBusy(false)
  }

  const header = <header className="adm-header">
    <Link to="/" className="brand" aria-label="IQ Create home"><span className="brand-mark">IQ<span>.</span></span><span className="brand-name">ADMIN</span></Link>
    <div className="adm-header-right">
      <Link to="/" className="adm-link">View site <ArrowUpRight size={13}/></Link>
      {(admin.status === 'admin' || admin.status === 'denied') && <button type="button" className="adm-link" onClick={() => void admin.signOut()}><LogOut size={13}/> Sign out</button>}
    </div>
  </header>

  if (admin.status === 'loading') return <div className="adm-page">{header}<div className="adm-empty"><LoaderCircle className="spin" size={18}/> Checking access…</div></div>

  if (admin.status === 'unconfigured') return <div className="adm-page">{header}<div className="adm-narrow adm-card"><h1>Admin unavailable</h1><p className="adm-muted">Supabase is not configured for this deployment (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).</p></div></div>

  if (admin.status === 'signed_out') return <div className="adm-page">{header}
    <form className="adm-narrow adm-card" onSubmit={submit}>
      <h1>Admin sign in</h1>
      <p className="adm-muted">Use your Meckury AI admin account.</p>
      <label className="adm-field"><span>Email</span><input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)}/></label>
      <label className="adm-field"><span>Password</span><input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}/></label>
      {error && <div className="adm-msg-error">{error}</div>}
      <button className="adm-btn" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={15}/> Signing in…</> : 'Sign in'}</button>
      <button className="adm-btn adm-btn-ghost" type="button" onClick={async () => setError(await admin.signInWithGoogle())}>Continue with Google</button>
    </form></div>

  if (admin.status === 'denied') return <div className="adm-page">{header}<div className="adm-narrow adm-card"><h1>No admin access</h1><p className="adm-muted">{admin.email} is signed in, but it is not a Meckury AI admin account.</p></div></div>

  return <div className="adm-page">{header}
    <main className="adm-main">
      <h1>IQ Create admin</h1>
      <nav className="adm-tabs" aria-label="Admin sections">
        <button type="button" className={tab === 'pricing' ? 'on' : ''} onClick={() => setTab('pricing')}>Pricing</button>
        <button type="button" className={tab === 'inquiries' ? 'on' : ''} onClick={() => setTab('inquiries')}>Inquiries</button>
      </nav>
      {tab === 'pricing' ? <PricingEditor/> : <Inquiries/>}
    </main>
  </div>
}
