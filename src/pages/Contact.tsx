import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, LoaderCircle, MessageCircle, PhoneCall } from 'lucide-react'
import { submitInquiry, whatsappLink, type InquiryPayload } from '../lib'

const contentTypes = ['Drama / series / film', 'Podcast / audio-led', 'Talking-head / visual podcast', 'Animation / illustrated stories', 'Advertising / branded content', 'Music video', 'Not sure yet', 'Film / feature movie', 'Series / soap opera', 'Podcast / audio show', 'Documentary', 'Social / digital content', 'Something else']

export default function Contact() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', company: '', content_type: params.get('type') || '', project_summary: '', preferred_contact: 'WhatsApp', inquiry_type: 'Production inquiry' })
  const [honeypot, setHoneypot] = useState('')
  const episodes = Number(params.get('episodes') || 0)
  const duration = Number(params.get('duration') || 0)
  const weeks = Number(params.get('weeks') || 0)
  const minutes = Number(params.get('minutes') || 0)
  const estimate = Number(params.get('estimate') || 0)
  const hasEstimate = Boolean(params.get('minutes'))

  useEffect(() => {
    if (params.get('type')) setForm(prev => ({ ...prev, content_type: params.get('type') || '' }))
  }, [params])

  const set = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (honeypot) return
    setStatus('sending'); setError('')
    const payload: InquiryPayload = {
      ...form,
      episodes_per_week: episodes,
      minutes_per_episode: duration,
      weeks_per_month: weeks,
      monthly_minutes: minutes,
      estimated_monthly_usd: estimate,
    }
    try {
      await submitInquiry(payload)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please contact us on WhatsApp.')
    }
  }

  return <>
    <section className="page-hero contact-hero"><div className="container"><span className="eyebrow">LET'S TALK ABOUT YOUR PROJECT</span><h1>Let's make<br/><em>something real.</em></h1><p>Tell us what you have in mind. A rough idea is enough to start a conversation.</p></div></section>
    <section className="contact-section section-pad"><div className="container contact-layout">
      <aside className="contact-aside"><span className="eyebrow">GET IN TOUCH</span><h2>Start with<br/><em>the idea.</em></h2><p>Whether you have a complete script or just a spark of an idea, we'd like to hear about it.</p>
        <a className="contact-method" href={whatsappLink()} target="_blank" rel="noreferrer"><span className="contact-method-icon"><MessageCircle size={20}/></span><span><small>WHATSAPP US</small><strong>+234 816 246 5247</strong></span><ArrowUpRight size={17}/></a>
        <a className="contact-method" href="#inquiry-form" onClick={() => set('preferred_contact', 'Phone call')}><span className="contact-method-icon"><PhoneCall size={20}/></span><span><small>REQUEST A CALL</small><strong>Ask us to call you back</strong></span><ArrowUpRight size={17}/></a>
        <div className="contact-aside-note"><span className="note-dot"/> We review every inquiry and respond with the next steps.</div>
      </aside>
      <div className="contact-form-wrap">
        {hasEstimate && <div className="quote-summary"><div><span className="eyebrow">YOUR ESTIMATED PLAN</span><strong>{minutes.toLocaleString()} finished minutes / month</strong><p>{episodes} episode(s) weekly · {duration} minutes each · {weeks} production weeks</p></div><div className="quote-summary-price"><small>INDICATIVE PRICE</small><strong>${estimate.toLocaleString()}<small> / month</small></strong></div></div>}
        {status === 'success' ? <div className="form-success"><CheckCircle2 size={34}/><h2>Your inquiry is in.</h2><p>Thank you for considering IQ Create. Our team will review your brief and get back to you.</p><a href={whatsappLink('Hello IQ Create. I just submitted a project inquiry and would like to follow up.')} target="_blank" rel="noreferrer" className="text-link">Continue on WhatsApp <ArrowUpRight size={16}/></a></div> : <form id="inquiry-form" className="inquiry-form" onSubmit={handleSubmit}>
          <div className="form-heading"><span className="eyebrow">PROJECT INQUIRY</span><h2>Tell us a little more.</h2><p>Fields marked with * are required.</p></div>
          <div className="form-grid"><div className="form-field"><label htmlFor="name">Your name *</label><input id="name" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name"/></div><div className="form-field"><label htmlFor="email">Email address *</label><input id="email" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com"/></div><div className="form-field"><label htmlFor="phone">WhatsApp / phone</label><input id="phone" required={form.preferred_contact === 'Phone call'} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Include country code"/></div><div className="form-field"><label htmlFor="country">Country</label><input id="country" value={form.country} onChange={e => set('country', e.target.value)} placeholder="Where are you based?"/></div><div className="form-field"><label htmlFor="company">Brand / company (optional)</label><input id="company" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Your brand or agency"/></div><div className="form-field"><label htmlFor="content_type">What would you like us to create? *</label><select id="content_type" required value={form.content_type} onChange={e => set('content_type', e.target.value)}><option value="">Choose a content type</option>{contentTypes.map(t => <option key={t}>{t}</option>)}</select></div></div>
          <div className="form-field"><label htmlFor="project_summary">Tell us about your idea *</label><textarea id="project_summary" required rows={5} value={form.project_summary} onChange={e => set('project_summary', e.target.value)} placeholder="What's the story, format or brief? What would you like us to produce?"/></div>
          <div className="form-field"><label>How should we contact you?</label><div className="contact-choice"><label><input type="radio" name="preferred_contact" checked={form.preferred_contact === 'WhatsApp'} onChange={() => set('preferred_contact', 'WhatsApp')}/> WhatsApp</label><label><input type="radio" name="preferred_contact" checked={form.preferred_contact === 'Phone call'} onChange={() => set('preferred_contact', 'Phone call')}/> Phone call</label><label><input type="radio" name="preferred_contact" checked={form.preferred_contact === 'Email'} onChange={() => set('preferred_contact', 'Email')}/> Email</label></div></div>
          <div className="visually-hidden" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)}/></div>
          {status === 'error' && <div className="form-error">{error}</div>}
          <button className="button button-primary button-full" type="submit" disabled={status === 'sending'}>{status === 'sending' ? <><LoaderCircle className="spin" size={17}/> Sending inquiry…</> : <>Send project inquiry <ArrowUpRight size={17}/></>}</button>
          <p className="form-privacy">By submitting, you agree that IQ Create may contact you about this inquiry.</p>
        </form>}
      </div>
    </div></section>
  </>
}
