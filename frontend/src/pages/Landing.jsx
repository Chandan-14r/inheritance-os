import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Heart, Zap, ChevronRight, Sparkles } from 'lucide-react';

const FEATURES = [
  { icon: Shield, title: 'Digital Asset Vault', desc: 'Track every account, investment, and property in one secure place' },
  { icon: Heart, title: 'AI-Powered Letters', desc: 'Generate heartfelt farewell letters personalized for each loved one' },
  { icon: TrendingUp, title: 'Wealth Simulator', desc: 'Monte Carlo simulations project your family\'s wealth across generations' },
  { icon: Zap, title: 'Dead Man\'s Switch', desc: 'Automated alerts ensure your plan activates when it matters most' },
];

const STATS = [
  { value: '₹2.25Cr', label: 'Assets Protected' },
  { value: '3', label: 'Beneficiaries' },
  { value: '100%', label: 'Allocated' },
  { value: '30yr', label: 'Projection' },
];

export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-[#060918] bg-grid overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-pink-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold gradient-text">Inheritance OS</div>
        <div className="flex items-center gap-6">
          <span className="text-slate-400 text-sm cursor-pointer hover:text-white transition-colors">Features</span>
          <span className="text-slate-400 text-sm cursor-pointer hover:text-white transition-colors">How it Works</span>
          <span className="text-slate-400 text-sm cursor-pointer hover:text-white transition-colors">Security</span>
          <button onClick={() => nav('/dashboard')}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25">
            Launch App →
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-indigo-300 mb-8">
              <Sparkles size={14} /> AI-Powered Estate Planning for Modern India
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            Your Wealth Transfers{' '}
            <span className="gradient-text">Love</span>,<br />
            Not <span className="text-slate-500 line-through decoration-red-500/50">Chaos</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The intelligent inheritance platform that helps Indian families protect, plan, and pass down
            wealth across generations — with AI-generated farewell letters that turn numbers into stories.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center gap-4">
            <button onClick={() => nav('/dashboard')}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/25 flex items-center gap-2">
              Start Planning <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => nav('/dashboard')}
              className="px-8 py-4 glass rounded-xl text-lg font-semibold hover:bg-white/5 transition-all">
              View Demo
            </button>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 glass rounded-2xl p-8 grid grid-cols-4 gap-8 max-w-3xl mx-auto">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything Your Family Needs</h2>
          <p className="text-slate-400 text-lg">Built for Indian families, powered by AI, designed with love</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl cursor-pointer group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <f.icon size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pb-20">
        <div className="glass rounded-3xl p-12 text-center animate-pulse-glow">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Legacy?</h2>
          <p className="text-slate-400 mb-8 text-lg">Join thousands of Indian families who plan ahead with Inheritance OS</p>
          <button onClick={() => nav('/dashboard')}
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-lg font-semibold hover:shadow-xl hover:shadow-indigo-500/25 transition-all">
            Launch Inheritance OS →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Inheritance OS — Built with ❤️ for Indian Families</p>
      </footer>
    </div>
  );
}
