import { ArrowUpRight, Clapperboard, Headphones, Megaphone, Music2, PenTool, Radio, Sparkles, Tv, Video } from 'lucide-react'
import { Link } from 'react-router-dom'

const services = [
  { icon: Clapperboard, no: '01', title: 'Films & feature stories', desc: 'From short films to full-length features, we turn scripts and concepts into cinematic productions.', tags: ['Feature films', 'Short films', 'Drama'] },
  { icon: Tv, no: '02', title: 'Series & soap operas', desc: 'Build a world audiences can return to. We produce episodic content for ongoing channels and streaming platforms.', tags: ['Web series', 'Soap operas', 'Mini-series'] },
  { icon: Headphones, no: '03', title: 'Podcasts & audio shows', desc: 'Create a consistent show without building a studio or managing a production team yourself.', tags: ['Video podcasts', 'Audio dramas', 'Narration'] },
  { icon: Megaphone, no: '04', title: 'Advertising & branded content', desc: 'Help agencies and brands turn campaign concepts into polished visual content and product stories.', tags: ['Campaign films', 'Product ads', 'Explainers'] },
  { icon: Music2, no: '05', title: 'Music videos', desc: 'Give artists a visual identity. Bring us the music, artist and creative direction; we will shape the video.', tags: ['Music videos', 'Lyric videos', 'Visualisers'] },
  { icon: PenTool, no: '06', title: 'Animation & illustration', desc: 'Create visual stories, explain complex ideas or bring imaginative worlds and characters to life.', tags: ['Animated stories', 'Educational', 'Illustration'] },
  { icon: Radio, no: '07', title: 'Documentaries & factual', desc: 'Present real stories, people, history and ideas through compelling documentary-style productions.', tags: ['Documentaries', 'History', 'Culture'] },
  { icon: Video, no: '08', title: 'Social & digital content', desc: 'A steady stream of content for channels, communities, launches and digital-first brands.', tags: ['YouTube', 'Social series', 'Promos'] },
]

export default function Services() {
  return <>
    <section className="page-hero"><div className="container"><span className="eyebrow">WHAT WE CREATE</span><h1>One studio.<br/><em>Infinite formats.</em></h1><p>We are a production house, not a one-format tool. Bring us a story, a brief, a track or an idea. Let's work out how to make it.</p></div></section>
    <section className="services-list-section section-pad"><div className="container services-grid">{services.map(({icon: Icon, no, title, desc, tags}) => <article className="service-detail" key={no}><div className="service-detail-head"><span>{no}</span><Icon size={24}/></div><h2>{title}</h2><p>{desc}</p><div className="tag-list">{tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div></section>
    <section className="agency-section section-pad"><div className="container agency-grid"><div><span className="eyebrow">FOR AGENCIES & PRODUCERS</span><h2>Your client has the brief.<br/><em>We have the studio.</em></h2></div><div><p>You don't have to build an AI production department to offer AI-powered content to your clients. Advertising agencies, music video producers, creative directors and consultants can work with IQ Create as their production partner.</p><p>You own the client relationship. We execute the agreed production scope behind the scenes or as a named production partner.</p><Link to="/contact" className="text-link">Discuss a production partnership <ArrowUpRight size={16}/></Link></div></div></section>
    <section className="simple-cta"><div className="container simple-cta-inner"><Sparkles size={24}/><div><h2>Have something different in mind?</h2><p>Tell us about it. We like figuring out how to make new things.</p></div><Link to="/contact" className="button button-primary">Talk to the studio <ArrowUpRight size={16}/></Link></div></section>
  </>
}
