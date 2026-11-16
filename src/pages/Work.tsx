import { ArrowUpRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

const concepts = [
  { title: 'The world of the story', type: 'CINEMATIC STORYTELLING', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=85', size: 'large' },
  { title: 'A show worth returning to', type: 'SERIES & EPISODIC', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85', size: 'small' },
  { title: 'Sound becomes a story', type: 'PODCAST & AUDIO', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=85', size: 'small' },
  { title: 'Make the message move', type: 'BRANDED CONTENT', image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=85', size: 'large' },
]

export default function Work() {
  return <>
    <section className="page-hero"><div className="container"><span className="eyebrow">OUR WORK & CREATIVE RANGE</span><h1>Ideas are better<br/><em>when you can see them.</em></h1><p>A growing lookbook of the formats, moods and visual worlds we can help create. Production samples and commissioned work will be added here as projects are approved for display.</p></div></section>
    <section className="work-section section-pad"><div className="container"><div className="work-notice"><span className="notice-dot"/> VISUAL DIRECTION / CONCEPT MOODBOARD <span>These images are illustrative references, not claimed IQ Create client projects.</span></div><div className="work-grid">{concepts.map((item) => <article className={`work-card ${item.size}`} key={item.title}><img src={item.image} alt="Visual reference for creative production"/><div className="work-shade"/><div className="work-card-content"><span>{item.type}</span><h2>{item.title}</h2><div className="work-play"><Play size={15} fill="currentColor"/></div></div></article>)}</div><div className="work-bottom"><p>Have a reference, moodboard or sample in mind? Share it with us. It helps us understand the world you want to create.</p><Link to="/contact" className="button button-outline">Start your project <ArrowUpRight size={16}/></Link></div></div></section>
  </>
}
