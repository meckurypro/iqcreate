import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { whatsappLink } from '../lib'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'What we create' },
  { to: '/work', label: 'Our work' },
  { to: '/process', label: 'How it works' },
  { to: '/contact', label: 'Contact' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  return <>
    <header className="site-header">
      <div className="nav-wrap container">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="IQ Create home">
          <span className="brand-mark">IQ<span>.</span></span><span className="brand-name">CREATE</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(link => <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{link.label}</NavLink>)}
        </nav>
        <a className="nav-cta" href={whatsappLink('Hello IQ Create. I would like to discuss a project.')} target="_blank" rel="noreferrer">Start a project <ArrowUpRight size={16} /></a>
        <button className="mobile-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="mobile-nav">{links.map(link => <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)}>{link.label}</NavLink>)}<a href={whatsappLink()} target="_blank" rel="noreferrer">Start a project <ArrowUpRight size={16}/></a></nav>}
    </header>
    <main><Outlet /></main>
    <footer className="footer">
      <div className="container footer-top">
        <div><Link to="/" className="brand footer-brand"><span className="brand-mark">IQ<span>.</span></span><span className="brand-name">CREATE</span></Link><p className="footer-line">Your imagination. Our execution.</p></div>
        <div className="footer-links"><Link to="/services">What we create</Link><Link to="/work">Our work</Link><Link to="/process">How it works</Link><Link to="/contact">Contact</Link></div>
        <div className="footer-contact"><span className="eyebrow">HAVE A STORY?</span><a href={whatsappLink()} target="_blank" rel="noreferrer">Let's make it real <ArrowUpRight size={15}/></a><span>WhatsApp · +234 816 246 5247</span></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} IQ Create. A PromptIQ company.</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div>
    </footer>
  </>
}
