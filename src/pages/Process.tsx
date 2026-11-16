import { ArrowUpRight, CheckCircle2, Clapperboard, FileText, MessageCircle, PackageCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  { n: '01', icon: MessageCircle, title: 'Tell us what you imagine', text: 'Share your story, script, reference links, creative direction or campaign brief. You do not need a production-ready document to start a conversation.' },
  { n: '02', icon: FileText, title: 'We scope and quote', text: 'We review the format, runtime, complexity, delivery schedule and any assets you provide. You receive a clear scope, price and timeline.' },
  { n: '03', icon: Clapperboard, title: 'Production begins', text: 'Once the scope is approved and payment is received, our team develops and produces the content using our creative workflows and production technology.' },
  { n: '04', icon: PackageCheck, title: 'Review and delivery', text: 'We share the agreed output for review, complete the included revisions and deliver the final files in the agreed format, ready for you to publish.' },
]

export default function Process() {
  return <>
    <section className="page-hero"><div className="container"><span className="eyebrow">HOW IT WORKS</span><h1>From your head<br/><em>to the screen.</em></h1><p>You bring the imagination. We bring the production process. No need to learn AI tools, assemble a crew or manage the technical details.</p></div></section>
    <section className="process-section section-pad"><div className="container process-layout"><div className="process-intro"><span className="eyebrow">A SIMPLE PROCESS</span><h2>Four steps.<br/><em>One finished idea.</em></h2><p>Every project starts with a conversation. We agree on what will be made, what it will cost and when it will be delivered before production begins.</p><div className="process-assurance"><CheckCircle2 size={18}/><span>Work begins after the scope and payment are confirmed.</span></div></div><div className="process-steps">{steps.map(({n, icon: Icon, title, text}) => <article className="process-step" key={n}><div className="process-number">{n}</div><div className="process-icon"><Icon size={20}/></div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>
    <section className="expect-section section-pad"><div className="container expect-grid"><div><span className="eyebrow">GOOD TO KNOW</span><h2>Clear expectations.<br/><em>Better productions.</em></h2></div><div className="expect-list"><div><strong>You own the story.</strong><p>You provide the underlying story, script, brief or concept and confirm that you have the rights to materials you supply.</p></div><div><strong>Scope comes first.</strong><p>Runtime, aspect ratio, delivery format, revision rounds and deadlines are agreed in writing before work starts.</p></div><div><strong>Recurring production is available.</strong><p>For channels and series, we can agree a monthly production schedule and recurring delivery plan.</p></div><div><strong>Some projects need custom pricing.</strong><p>Feature films, complex visual effects, music videos and unusual requirements are quoted individually.</p></div></div></div></section>
    <section className="simple-cta"><div className="container simple-cta-inner"><div><h2>Ready to make something?</h2><p>Send us the idea. We'll take it from there.</p></div><Link to="/contact" className="button button-primary">Request a quote <ArrowUpRight size={16}/></Link></div></section>
  </>
}
