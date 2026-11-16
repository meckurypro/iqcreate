import { useMemo, useState } from 'react'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const rates: Record<string, number> = {
  'Podcast / audio-led': 1.35,
  'Talking-head / visual podcast': 1.75,
  'Animation / illustrated stories': 2.4,
  'Drama / series / film': 3.5,
  'Advertising / branded content': 3.0,
  'Music video': 3.8,
  'Not sure yet': 2.5,
}

export default function Estimator() {
  const [type, setType] = useState('Drama / series / film')
  const [episodes, setEpisodes] = useState(1)
  const [duration, setDuration] = useState(10)
  const [weeks, setWeeks] = useState(4)
  const navigate = useNavigate()
  const minutes = episodes * duration * weeks
  const estimate = useMemo(() => Math.max(100, Math.round(minutes * (rates[type] || 2.5))), [minutes, type])
  const params = new URLSearchParams({ type, episodes: String(episodes), duration: String(duration), weeks: String(weeks), minutes: String(minutes), estimate: String(estimate) })
  const update = (setter: (v: number) => void, value: number, min: number, max: number) => setter(Math.max(min, Math.min(max, value)))

  return <section className="estimator-section" id="estimator">
    <div className="container estimator-grid">
      <div className="estimator-copy">
        <span className="eyebrow">PLAN YOUR PRODUCTION</span>
        <h2>What are you<br/><em>imagining?</em></h2>
        <p>Play with the numbers. See what a regular production schedule could look like, then send us your brief for a proper quotation.</p>
        <div className="estimate-note"><span className="note-dot"/> Estimates are indicative, not a final quote. Complexity, style and production requirements affect the final price.</div>
      </div>
      <div className="estimator-card">
        <div className="estimator-card-head"><span>YOUR PRODUCTION PLAN</span><span className="live-indicator">LIVE ESTIMATE</span></div>
        <label className="field-label" htmlFor="content-type">What are we creating?</label>
        <select id="content-type" className="select-control" value={type} onChange={e => setType(e.target.value)}>
          {Object.keys(rates).map(item => <option key={item}>{item}</option>)}
        </select>
        <div className="range-block">
          <div className="range-heading"><label>Episodes / releases per week</label><strong>{episodes}</strong></div>
          <input aria-label="Episodes / releases per week" type="range" min="1" max="7" value={episodes} onChange={e => setEpisodes(Number(e.target.value))}/>
          <div className="range-ends"><span>1 episode</span><span>7 episodes</span></div>
        </div>
        <div className="range-block">
          <div className="range-heading"><label>Duration per episode</label><strong>{duration} <small>min</small></strong></div>
          <input aria-label="Minutes per episode" type="range" min="1" max="60" step="1" value={duration} onChange={e => setDuration(Number(e.target.value))}/>
          <div className="range-ends"><span>1 minute</span><span>60 minutes</span></div>
        </div>
        <div className="range-block">
          <div className="range-heading"><label>Production weeks per month</label><strong>{weeks}</strong></div>
          <div className="stepper"><button aria-label="Reduce production weeks" onClick={() => update(setWeeks, weeks - 1, 1, 5)}><Minus size={15}/></button><div className="stepper-track">{[1,2,3,4,5].map(n => <button key={n} aria-label={`${n} weeks`} className={n <= weeks ? 'step-active' : ''} onClick={() => setWeeks(n)}/>)}</div><button aria-label="Increase production weeks" onClick={() => update(setWeeks, weeks + 1, 1, 5)}><Plus size={15}/></button></div>
          <div className="range-ends"><span>1 week</span><span>5 weeks</span></div>
        </div>
        <div className="estimate-result">
          <div><span>ESTIMATED MONTHLY OUTPUT</span><strong>{minutes.toLocaleString()} <small>finished minutes</small></strong></div>
          <div className="estimate-price"><span>INDICATIVE MONTHLY PRICE</span><strong>${estimate.toLocaleString()}<small> USD</small></strong></div>
        </div>
        <button className="button button-primary button-full" onClick={() => navigate(`/contact?${params.toString()}`)}>Request a tailored quote <ArrowRight size={17}/></button>
        <p className="estimator-footnote">No payment required to enquire. We'll review your brief before confirming a price.</p>
      </div>
    </div>
  </section>
}
