// src/admin/PricingEditor.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, LoaderCircle, Plus, Save, Trash2 } from 'lucide-react'
import { supabase } from '../lib'
import { calculateEstimate, fetchPricing, type Pricing } from '../pricing'

type RateRow = { key: string; id?: string; content_type: string; rate: string; is_active: boolean }
type SettingsForm = {
  minimum_monthly_usd: string
  fallback_rate_usd_per_minute: string
  max_episodes_per_week: string
  max_minutes_per_episode: string
  max_weeks_per_month: string
  default_content_type: string
}

const settingFields: { key: Exclude<keyof SettingsForm, 'default_content_type'>; label: string; hint: string; min: number; max: number; step: string }[] = [
  { key: 'minimum_monthly_usd', label: 'Minimum monthly price (USD)', hint: 'No estimate is shown below this.', min: 0, max: 100000, step: '1' },
  { key: 'fallback_rate_usd_per_minute', label: 'Fallback rate (USD / minute)', hint: 'Used if a content type has no rate.', min: 0, max: 100, step: '0.01' },
  { key: 'max_episodes_per_week', label: 'Max episodes per week', hint: 'Right end of the episodes slider (1–20).', min: 1, max: 20, step: '1' },
  { key: 'max_minutes_per_episode', label: 'Max minutes per episode', hint: 'Right end of the duration slider (1–240).', min: 1, max: 240, step: '1' },
  { key: 'max_weeks_per_month', label: 'Max production weeks', hint: 'Right end of the weeks stepper (1–5).', min: 1, max: 5, step: '1' },
]

let rowCounter = 0
const newKey = () => `new-${++rowCounter}`

export default function PricingEditor() {
  const [rows, setRows] = useState<RateRow[]>([])
  const [deleted, setDeleted] = useState<string[]>([])
  const [settings, setSettings] = useState<SettingsForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [calc, setCalc] = useState({ type: '', episodes: 1, minutes: 10, weeks: 4 })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const p = await fetchPricing()
      setRows(p.rates.map(r => ({ key: r.id as string, id: r.id, content_type: r.content_type, rate: String(r.rate_usd_per_minute), is_active: r.is_active })))
      setSettings({
        minimum_monthly_usd: String(p.settings.minimum_monthly_usd),
        fallback_rate_usd_per_minute: String(p.settings.fallback_rate_usd_per_minute),
        max_episodes_per_week: String(p.settings.max_episodes_per_week),
        max_minutes_per_episode: String(p.settings.max_minutes_per_episode),
        max_weeks_per_month: String(p.settings.max_weeks_per_month),
        default_content_type: p.settings.default_content_type ?? '',
      })
      setDeleted([])
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof Error ? err.message : 'Could not load pricing.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const preview = useMemo<Pricing | null>(() => settings && ({
    settings: {
      minimum_monthly_usd: Number(settings.minimum_monthly_usd) || 0,
      fallback_rate_usd_per_minute: Number(settings.fallback_rate_usd_per_minute) || 0,
      max_episodes_per_week: Number(settings.max_episodes_per_week) || 1,
      max_minutes_per_episode: Number(settings.max_minutes_per_episode) || 1,
      max_weeks_per_month: Number(settings.max_weeks_per_month) || 1,
      default_content_type: settings.default_content_type || null,
    },
    rates: rows.map(r => ({ content_type: r.content_type.trim(), rate_usd_per_minute: Number(r.rate) || 0, is_active: r.is_active, sort_order: 0 })),
  }), [rows, settings])

  const patchRow = (key: string, patch: Partial<RateRow>) => setRows(prev => prev.map(r => r.key === key ? { ...r, ...patch } : r))
  const move = (index: number, dir: -1 | 1) => setRows(prev => {
    const next = [...prev]
    const target = index + dir
    if (target < 0 || target >= next.length) return prev
    ;[next[index], next[target]] = [next[target], next[index]]
    return next
  })
  const remove = (row: RateRow) => {
    if (row.id) setDeleted(prev => [...prev, row.id as string])
    setRows(prev => prev.filter(r => r.key !== row.key))
  }

  async function save() {
    if (!supabase || !settings) return
    setMsg(null)
    const names = rows.map(r => r.content_type.trim())
    if (!rows.length) return setMsg({ kind: 'error', text: 'Keep at least one content type.' })
    if (names.some(n => n.length < 2 || n.length > 120)) return setMsg({ kind: 'error', text: 'Every content type needs a name of 2–120 characters.' })
    if (new Set(names.map(n => n.toLowerCase())).size !== names.length) return setMsg({ kind: 'error', text: 'Content type names must be unique.' })
    if (rows.some(r => !Number.isFinite(Number(r.rate)) || r.rate.trim() === '' || Number(r.rate) < 0 || Number(r.rate) > 100)) return setMsg({ kind: 'error', text: 'Rates must be numbers between 0 and 100 USD per minute.' })
    if (!rows.some(r => r.is_active)) return setMsg({ kind: 'error', text: 'At least one content type must be active.' })
    for (const f of settingFields) {
      const v = Number(settings[f.key])
      if (!Number.isFinite(v) || settings[f.key].trim() === '' || v < f.min || v > f.max) return setMsg({ kind: 'error', text: `${f.label} must be between ${f.min} and ${f.max}.` })
    }

    setSaving(true)
    try {
      if (deleted.length) {
        const { error } = await supabase.from('iq_create_pricing_rates').delete().in('id', deleted)
        if (error) throw error
      }
      for (const [i, r] of rows.entries()) {
        const values = { content_type: r.content_type.trim(), rate_usd_per_minute: Number(r.rate), is_active: r.is_active, sort_order: (i + 1) * 10 }
        if (r.id) {
          const { error } = await supabase.from('iq_create_pricing_rates').update(values).eq('id', r.id)
          if (error) throw error
        } else {
          const { error } = await supabase.from('iq_create_pricing_rates').insert(values)
          if (error) throw error
        }
      }
      const { error } = await supabase.from('iq_create_pricing_settings').update({
        minimum_monthly_usd: Number(settings.minimum_monthly_usd),
        fallback_rate_usd_per_minute: Number(settings.fallback_rate_usd_per_minute),
        max_episodes_per_week: Number(settings.max_episodes_per_week),
        max_minutes_per_episode: Number(settings.max_minutes_per_episode),
        max_weeks_per_month: Number(settings.max_weeks_per_month),
        default_content_type: settings.default_content_type || null,
      }).eq('id', true)
      if (error) throw error
      await load()
      setMsg({ kind: 'ok', text: 'Saved. The website estimator now uses these prices.' })
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof Error ? err.message : 'Could not save pricing.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings || !preview) return <div className="adm-empty"><LoaderCircle className="spin" size={18}/> Loading pricing…</div>

  const calcType = rows.some(r => r.content_type.trim() === calc.type) ? calc.type : (rows.find(r => r.is_active)?.content_type.trim() ?? '')
  const calcMinutes = calc.episodes * calc.minutes * calc.weeks
  const calcRate = preview.rates.find(r => r.content_type === calcType)?.rate_usd_per_minute ?? preview.settings.fallback_rate_usd_per_minute
  const calcPrice = calculateEstimate(calcMinutes, calcType, preview)

  return <div className="adm-stack">
    <section className="adm-card">
      <h2>How the price is calculated</h2>
      <p className="adm-formula"><code>price = max( minimum, round( episodes/week × minutes/episode × weeks/month × rate for the content type ) )</code></p>
      <p className="adm-muted">Edit the rates and limits below, then press <strong>Save changes</strong>. The website picks them up on the next page load.</p>
    </section>

    <section className="adm-card">
      <h2>Rates by content type</h2>
      <div className="adm-rates">
        <div className="adm-rate-head"><span>Content type</span><span>USD / min</span><span>Active</span><span/></div>
        {rows.map((r, i) => <div className="adm-rate-row" key={r.key}>
          <input aria-label="Content type name" value={r.content_type} onChange={e => patchRow(r.key, { content_type: e.target.value })}/>
          <input aria-label={`Rate for ${r.content_type}`} inputMode="decimal" value={r.rate} onChange={e => patchRow(r.key, { rate: e.target.value })}/>
          <label className="adm-toggle"><input type="checkbox" checked={r.is_active} onChange={e => patchRow(r.key, { is_active: e.target.checked })}/><span>{r.is_active ? 'Shown' : 'Hidden'}</span></label>
          <div className="adm-row-actions">
            <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ChevronUp size={15}/></button>
            <button type="button" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)}><ChevronDown size={15}/></button>
            <button type="button" aria-label={`Remove ${r.content_type}`} onClick={() => remove(r)}><Trash2 size={15}/></button>
          </div>
        </div>)}
      </div>
      <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setRows(prev => [...prev, { key: newKey(), content_type: '', rate: '2.50', is_active: true }])}><Plus size={15}/> Add content type</button>
    </section>

    <section className="adm-card">
      <h2>Limits and defaults</h2>
      <div className="adm-grid">
        {settingFields.map(f => <label className="adm-field" key={f.key}>
          <span>{f.label}</span>
          <input type="number" min={f.min} max={f.max} step={f.step} value={settings[f.key]} onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}/>
          <small>{f.hint}</small>
        </label>)}
        <label className="adm-field">
          <span>Preselected content type</span>
          <select value={settings.default_content_type} onChange={e => setSettings({ ...settings, default_content_type: e.target.value })}>
            <option value="">First in the list</option>
            {rows.filter(r => r.content_type.trim()).map(r => <option key={r.key}>{r.content_type.trim()}</option>)}
          </select>
          <small>What visitors see selected first.</small>
        </label>
      </div>
    </section>

    <section className="adm-card">
      <h2>Try it</h2>
      <p className="adm-muted">Uses your unsaved edits, so you can check a price before saving.</p>
      <div className="adm-grid">
        <label className="adm-field"><span>Content type</span><select value={calcType} onChange={e => setCalc({ ...calc, type: e.target.value })}>{rows.filter(r => r.content_type.trim()).map(r => <option key={r.key}>{r.content_type.trim()}</option>)}</select></label>
        <label className="adm-field"><span>Episodes / week</span><input type="number" min="1" value={calc.episodes} onChange={e => setCalc({ ...calc, episodes: Math.max(1, Number(e.target.value) || 1) })}/></label>
        <label className="adm-field"><span>Minutes / episode</span><input type="number" min="1" value={calc.minutes} onChange={e => setCalc({ ...calc, minutes: Math.max(1, Number(e.target.value) || 1) })}/></label>
        <label className="adm-field"><span>Weeks / month</span><input type="number" min="1" value={calc.weeks} onChange={e => setCalc({ ...calc, weeks: Math.max(1, Number(e.target.value) || 1) })}/></label>
      </div>
      <p className="adm-result">{calcMinutes.toLocaleString()} min × ${calcRate} = ${Math.round(calcMinutes * calcRate).toLocaleString()} → shown as <strong>${calcPrice.toLocaleString()} USD</strong>{calcPrice !== Math.round(calcMinutes * calcRate) && ' (minimum applied)'}</p>
    </section>

    <div className="adm-savebar">
      {msg && <span className={msg.kind === 'ok' ? 'adm-msg-ok' : 'adm-msg-error'}>{msg.text}</span>}
      <button type="button" className="adm-btn" disabled={saving} onClick={() => void save()}>{saving ? <><LoaderCircle className="spin" size={15}/> Saving…</> : <><Save size={15}/> Save changes</>}</button>
    </div>
  </div>
}
