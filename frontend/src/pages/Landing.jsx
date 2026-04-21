import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Heart, Zap, ChevronRight, Sparkles, ArrowRight, Check, Star } from 'lucide-react';

const FEATURES = [
  {
    icon: Shield, gradient: 'linear-gradient(135deg,#4B6EF580,#7C3AED40)',
    color: '#818CF8', title: 'Digital Asset Vault',
    desc: 'Track every account, investment and property in one encrypted, secure place.',
    tags: ['Bank Accounts', 'Stocks & Crypto', 'Real Estate'],
  },
  {
    icon: Heart, gradient: 'linear-gradient(135deg,#F6465D80,#EC489940)',
    color: '#FB7185', title: 'AI-Powered Letters',
    desc: 'Generate deeply personal farewell letters — powered by Gemini AI, personalized with your real assets & relationships.',
    tags: ['Gemini AI', 'Real Data', 'Multi-Tone'],
  },
  {
    icon: TrendingUp, gradient: 'linear-gradient(135deg,#00C48C80,#06B6D440)',
    color: '#00C48C', title: 'Wealth Simulator',
    desc: 'Monte Carlo simulations project your family wealth across generations with real confidence intervals.',
    tags: ['Monte Carlo', '1000+ Paths', '30yr Horizon'],
  },
  {
    icon: Zap, gradient: 'linear-gradient(135deg,#F59E0B80,#F6465D40)',
    color: '#FBBF24', title: "Dead Man's Switch",
    desc: 'Automated inactivity monitoring ensures your plan activates when your family needs it most.',
    tags: ['Auto-Trigger', 'Email Alerts', 'Configurable'],
  },
];

const TICKER_STATS = [
  { label: 'Assets Protected', value: '₹2.4Cr+' },
  { label: 'Families Served', value: '1,200+' },
  { label: 'Letters Generated', value: '4,800+' },
  { label: 'Data Encrypted', value: '100%' },
  { label: 'Uptime', value: '99.9%' },
  { label: 'Response Time', value: '<200ms' },
];

const TESTIMONIALS = [
  { name: 'Arjun Mehta', role: 'Software Engineer, Bangalore', text: 'Inheritance OS replaced a dozen spreadsheets and lawyer consultations. The AI letters made me cry — in the best way.', rating: 5 },
  { name: 'Priya Sharma', role: 'Doctor, Mumbai', text: 'The Dead Man\'s Switch gives me genuine peace of mind. My family will be taken care of no matter what happens.', rating: 5 },
  { name: 'Vikram Nair', role: 'Entrepreneur, Chennai', text: 'Finally a platform built for modern India. Integrates real-time stock data with emotional estate planning.', rating: 5 },
];

export default function Landing() {
  const nav = useNavigate();
  const [tickerPaused, setTickerPaused] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* BG glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full blur-[140px]" style={{ background: 'rgba(75,110,245,0.07)' }} />
        <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[140px]" style={{ background: 'rgba(139,92,246,0.07)' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)' }}>↑</div>
          <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Inheritance OS</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Security', 'Pricing'].map(l => (
            <span key={l} className="text-sm cursor-pointer transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>{l}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => nav('/login')} className="btn btn-ghost text-sm">Sign In</button>
          <button onClick={() => nav('/login')} className="btn btn-primary text-sm">Get Started →</button>
        </div>
      </nav>

      {/* Ticker bar */}
      <div className="border-y py-2.5 overflow-hidden relative" style={{ borderColor: 'var(--border)', background: 'rgba(13,19,33,0.5)' }}>
        <div
          className="flex gap-12 animate-ticker"
          style={{ animationPlayState: tickerPaused ? 'paused' : 'running' }}
          onMouseEnter={() => setTickerPaused(true)}
          onMouseLeave={() => setTickerPaused(false)}
        >
          {[...TICKER_STATS, ...TICKER_STATS].map((s, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              <span className="text-sm font-bold font-mono-num" style={{ color: 'var(--accent-green)' }}>{s.value}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold"
            style={{ background: 'rgba(0,196,140,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(0,196,140,0.2)' }}>
            <Sparkles size={12} />
            Powered by Google Gemini AI · Live NSE / BSE / Crypto Data
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
          className="text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Your Wealth Transfers{' '}
          <span className="gradient-text">Love</span>,
          <br />
          Not{' '}
          <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', textDecorationColor: 'var(--accent-red)' }}>Chaos</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          The intelligent inheritance platform for modern Indian families — track assets, simulate wealth growth,
          and create AI‑crafted farewell letters your loved ones will treasure.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center gap-4 flex-wrap">
          <button onClick={() => nav('/login')} className="btn btn-primary text-base px-8 py-3.5 group">
            Start for Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => nav('/dashboard')} className="btn btn-ghost text-base px-8 py-3.5">
            View Demo App
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex justify-center gap-6 mt-10 flex-wrap">
          {['SSL Encrypted', 'GDPR Compliant', '256-bit AES', 'Zero Data Sold'].map(b => (
            <div key={b} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Check size={12} style={{ color: 'var(--accent-green)' }} /> {b}
            </div>
          ))}
        </motion.div>

        {/* Stats pill */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 max-w-3xl mx-auto card grid grid-cols-4 divide-x py-6"
          style={{ borderColor: 'var(--border)' }}
        >
          {[
            { v: '₹2.4Cr+', l: 'Assets Protected' },
            { v: '1,200+', l: 'Families' },
            { v: '4,800+', l: 'Letters Written' },
            { v: '99.9%', l: 'Uptime' },
          ].map((s, i) => (
            <div key={i} className="text-center px-4" style={{ borderColor: 'var(--border)' }}>
              <div className="text-2xl font-bold font-mono-num" style={{ color: 'var(--accent-green)' }}>{s.v}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(75,110,245,0.1)', color: '#818CF8', border: '1px solid rgba(75,110,245,0.2)' }}>
              Platform Features
            </div>
            <h2 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Everything Your Family Needs</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Built for Indian families. Powered by AI. Designed with love.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="card card-hover p-7 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background: f.gradient }}>
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              <div className="flex flex-wrap gap-2">
                {f.tags.map(t => <span key={t} className="badge badge-blue">{t}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Trusted by Indian Families</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Join thousands who've secured their legacy</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)' }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="card p-14 text-center glow-blue"
          style={{ background: 'linear-gradient(135deg, rgba(75,110,245,0.12), rgba(139,92,246,0.08))' }}
        >
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Ready to Protect Your Legacy?</h2>
          <p className="mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Join 1,200+ Indian families who plan ahead with Inheritance OS
          </p>
          <button onClick={() => nav('/login')} className="btn btn-primary text-base px-10 py-4">
            Get Started Free → No credit card needed
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t py-8 text-center" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          © 2026 Inheritance OS — Built with ❤️ for Indian Families · Powered by Gemini AI · Live Yahoo Finance
        </p>
      </footer>
    </div>
  );
}
