import { ArrowDown, ArrowRight, ArrowUpRight, Clapperboard, Headphones, Megaphone, Music2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Estimator from '../components/Estimator'
import { whatsappLink } from '../lib'

const capabilities = [
  { icon: Clapperboard, title: 'Films & series', text: 'Feature films, episodic dramas, soap operas, short films and cinematic stories.' },
  { icon: Headphones, title: 'Podcasts & audio', text: 'Video podcasts, audio-led shows, interviews, audio dramas and narrated stories.' },
  { icon: Megaphone, title: 'Advertising', text: 'Campaign films, product stories, explainers and branded content for agencies and businesses.' },
  { icon: Music2, title: 'Music videos', text: 'Visual worlds, performance videos, lyric videos and creative treatments for artists.' },
]

export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-kicker"><span className="kicker-line"/> AI-POWERED CREATIVE PRODUCTION</div>
        <h1>Your imagination.<br/><em>Our execution.</em></h1>
        <p className="hero-lead">Bring your story. We shoot it. Films, series, podcasts, music videos and campaigns — made with the power of AI and the craft of a production team.</p>
        <div className="hero-actions"><Link to="/contact" className="button button-primary">Start a project <ArrowUpRight size={17}/></Link><a href="#what-we-create" className="button button-ghost">Explore what we create <ArrowDown size={16}/></a></div>
        <div className="hero-proof"><span><Sparkles size={15}/> Your idea, brought to life</span><span className="proof-separator"/><span>From first brief to final cut</span></div>
      </div>
      <div className="hero-side-label">A PROMPTIQ COMPANY · EST. FOR WHAT'S NEXT</div>
      <div className="hero-bottom container"><span>01 / THE CREATIVE PRODUCTION STUDIO</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="intro-section section-pad">
      <div className="container intro-grid">
        <div><span className="eyebrow">THE IDEA IS YOURS</span><h2>You bring the story.<br/><em>We bring it to screen.</em></h2></div>
        <div className="intro-text"><p>Not every storyteller wants to become a filmmaker. Not every brand has an in-house production team. And not every creative idea should stop at the idea stage.</p><p>IQ Create is a creative production house built to turn concepts, scripts and briefs into finished content. You focus on what you want to say. We handle the making.</p><Link to="/process" className="text-link">See how we work <ArrowUpRight size={16}/></Link></div>
      </div>
    </section>

    <section className="capabilities-section section-pad" id="what-we-create">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow">ONE STUDIO. MANY FORMATS.</span><h2>What can we <em>create?</em></h2></div><p>We are not tied to one genre, format or industry. If you can imagine it, let's discuss how to produce it.</p></div>
        <div className="capability-grid">{capabilities.map(({icon: Icon, title, text}, i) => <article className="capability-card" key={title}><div className="capability-top"><span>0{i+1}</span><Icon size={22}/></div><h3>{title}</h3><p>{text}</p><Link to="/services" aria-label={`Explore ${title}`}><ArrowUpRight size={18}/></Link></article>)}</div>
        <div className="capability-bottom"><span>AND MORE: ANIMATION · DOCUMENTARIES · EXPLAINERS · SOCIAL CONTENT</span><Link to="/services" className="text-link">Explore all services <ArrowRight size={16}/></Link></div>
      </div>
    </section>

    <section className="audience-section section-pad">
      <div className="container audience-grid">
        <div className="audience-image"><img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85" alt="Cinema screen in a dark theatre"/><div className="image-caption">CREATIVE IDEAS. PRODUCTION-READY.</div></div>
        <div className="audience-copy"><span className="eyebrow">BUILT FOR CREATIVE PEOPLE</span><h2>Whatever your role,<br/><em>we can make it.</em></h2><div className="audience-list"><div><span>01</span><p><strong>Creators & storytellers</strong>Bring your script, series idea or story universe. We'll help turn it into a production.</p></div><div><span>02</span><p><strong>Advertising agencies</strong>Bring your client's brief. We'll produce the campaign content your team has sold.</p></div><div><span>03</span><p><strong>Music video producers</strong>Bring the artist, track and creative direction. We'll build the visual experience.</p></div><div><span>04</span><p><strong>Businesses & organisations</strong>Bring your message. We'll make films, explainers and branded content that communicate it.</p></div></div><Link to="/contact" className="button button-outline">Tell us what you have in mind <ArrowUpRight size={16}/></Link></div>
      </div>
    </section>

    <Estimator />

    <section className="closing-cta section-pad"><div className="container closing-inner"><span className="eyebrow">THE NEXT STEP IS YOURS</span><h2>Have a story worth<br/><em>bringing to life?</em></h2><p>Tell us what you're imagining. We'll help you figure out what it takes to make it real.</p><div className="closing-actions"><Link to="/contact" className="button button-primary">Start an inquiry <ArrowUpRight size={17}/></Link><a href={whatsappLink()} target="_blank" rel="noreferrer" className="button button-ghost">Chat with us on WhatsApp</a></div></div><div className="closing-decoration">IQ CREATE</div></section>
  </>
}
