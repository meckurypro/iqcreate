import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '2348162465247'
export const whatsappLink = (message = 'Hello IQ Create. I would like to discuss a production project.') =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

export type InquiryPayload = {
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
}

export async function submitInquiry(payload: InquiryPayload) {
  if (!supabase) throw new Error('The inquiry form is not connected yet. Please contact us on WhatsApp.')
  const { error } = await supabase.from('iq_create_inquiries').insert(payload)
  if (error) throw error
}
