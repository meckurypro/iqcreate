// src/pricing.ts
import { useEffect, useState } from 'react'
import { supabase } from './lib'

export type PricingRate = {
  id?: string
  content_type: string
  rate_usd_per_minute: number
  is_active: boolean
  sort_order: number
}

export type PricingSettings = {
  minimum_monthly_usd: number
  fallback_rate_usd_per_minute: number
  max_episodes_per_week: number
  max_minutes_per_episode: number
  max_weeks_per_month: number
  default_content_type: string | null
}

export type Pricing = { settings: PricingSettings; rates: PricingRate[] }

// Offline fallback only. The live values come from Supabase and are edited in /admin.
export const defaultPricing: Pricing = {
  settings: {
    minimum_monthly_usd: 100,
    fallback_rate_usd_per_minute: 2.5,
    max_episodes_per_week: 7,
    max_minutes_per_episode: 60,
    max_weeks_per_month: 5,
    default_content_type: 'Drama / series / film',
  },
  rates: [
    { content_type: 'Podcast / audio-led', rate_usd_per_minute: 1.35 },
    { content_type: 'Talking-head / visual podcast', rate_usd_per_minute: 1.75 },
    { content_type: 'Animation / illustrated stories', rate_usd_per_minute: 2.4 },
    { content_type: 'Drama / series / film', rate_usd_per_minute: 3.5 },
    { content_type: 'Advertising / branded content', rate_usd_per_minute: 3.0 },
    { content_type: 'Music video', rate_usd_per_minute: 3.8 },
    { content_type: 'Not sure yet', rate_usd_per_minute: 2.5 },
  ].map((r, i) => ({ ...r, is_active: true, sort_order: (i + 1) * 10 })),
}

type Row = Record<string, unknown>

export const toSettings = (row: Row): PricingSettings => ({
  minimum_monthly_usd: Number(row.minimum_monthly_usd),
  fallback_rate_usd_per_minute: Number(row.fallback_rate_usd_per_minute),
  max_episodes_per_week: Number(row.max_episodes_per_week),
  max_minutes_per_episode: Number(row.max_minutes_per_episode),
  max_weeks_per_month: Number(row.max_weeks_per_month),
  default_content_type: (row.default_content_type as string | null) ?? null,
})

export const toRate = (row: Row): PricingRate => ({
  id: String(row.id),
  content_type: String(row.content_type),
  rate_usd_per_minute: Number(row.rate_usd_per_minute),
  is_active: Boolean(row.is_active),
  sort_order: Number(row.sort_order),
})

/** The one pricing formula, used by the website estimator and the admin preview. */
export function calculateEstimate(minutes: number, contentType: string, pricing: Pricing): number {
  const rate = pricing.rates.find(r => r.content_type === contentType)?.rate_usd_per_minute
    ?? pricing.settings.fallback_rate_usd_per_minute
  return Math.max(pricing.settings.minimum_monthly_usd, Math.round(minutes * rate))
}

/** Loads every rate the current user can see (admins also see inactive ones). */
export async function fetchPricing(): Promise<Pricing> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const [settings, rates] = await Promise.all([
    supabase.from('iq_create_pricing_settings').select('*').eq('id', true).single(),
    supabase.from('iq_create_pricing_rates').select('*').order('sort_order').order('content_type'),
  ])
  if (settings.error) throw settings.error
  if (rates.error) throw rates.error
  return { settings: toSettings(settings.data), rates: rates.data.map(toRate) }
}

/** Public pricing for the website. Falls back to defaults so the estimator never breaks. */
export function usePricing() {
  const [state, setState] = useState<{ pricing: Pricing; ready: boolean }>({ pricing: defaultPricing, ready: false })
  useEffect(() => {
    let alive = true
    fetchPricing()
      .then(p => {
        const rates = p.rates.filter(r => r.is_active)
        return { settings: p.settings, rates: rates.length ? rates : defaultPricing.rates }
      })
      .catch(() => defaultPricing)
      .then(pricing => { if (alive) setState({ pricing, ready: true }) })
    return () => { alive = false }
  }, [])
  return state
}
