import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Abhinav Shrestha, home">
          <span className="brand-mark">AS</span><span>Abhinav Shrestha</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/about">About</Link><Link href="/services">Services</Link>
          <Link href="/blog">Insights</Link><Link href="/contact">Contact</Link>
        </nav>
        <Link href="/contact" className="button button-small">Book a Free Call</Link>
      </header>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> AI marketing expertise for growing businesses</p>
          <h1>Turn smarter marketing into your next <em>growth opportunity.</em></h1>
          <p className="lede">I help small and medium-sized businesses attract better leads, win more customers, and build practical growth systems with AI and proven digital marketing.</p>
          <div className="hero-actions">
            <Link href="/contact" className="button">Book a Free Consultation Call <ArrowUpRight size={17} /></Link>
            <Link href="/services" className="text-link">Explore my services</Link>
          </div>
          <p className="microcopy"><CheckCircle2 size={15} /> Personalized strategy · Practical next steps · No pressure</p>
        </div>
        <div className="strategy-panel" aria-label="Marketing strategy overview illustration">
          <div className="panel-top"><span>GROWTH BRIEF</span><span className="status">Strategy in focus</span></div>
          <div className="panel-copy"><small>THE GOAL</small><strong>Build a clearer path from attention to customer.</strong></div>
          <div className="signal-grid">
            <div><span>01</span><b>Attract</b><small>Reach the right audience</small></div>
            <div><span>02</span><b>Convert</b><small>Turn interest into action</small></div>
            <div><span>03</span><b>Retain</b><small>Create lasting value</small></div>
          </div>
          <div className="panel-note"><span>AI</span><p><b>Efficiency meets judgment.</b><br />Use AI to move faster—without losing the strategy.</p></div>
        </div>
      </section>
    </main>
  );
}
