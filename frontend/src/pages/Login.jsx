import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { useData } from '../DataContext';

const BENEFITS = [
  'Live market synced asset tracking',
  'Gemini AI-generated farewell letters',
  'Monte Carlo wealth simulations',
  "Dead man's switch protection",
];

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { fetchAllData } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);
      localStorage.setItem('ios_token', data.token);
      toast.success(isLogin ? `Welcome back, ${data.user.name}!` : 'Account created successfully!');
      await fetchAllData();
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left panel — product pitch */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r relative overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        {/* BG glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(75,110,245,0.08)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)' }}>↑</div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Inheritance OS</span>
          </div>

          <h2 className="text-4xl font-black leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Secure Your Family's
            <br />
            <span className="gradient-text">Financial Legacy</span>
          </h2>
          <p className="text-base mb-10" style={{ color: 'var(--text-secondary)' }}>
            India's most advanced estate planning platform. Backed by live market data and Gemini AI.
          </p>

          <div className="space-y-3">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,196,140,0.15)' }}>
                  <Check size={11} style={{ color: 'var(--accent-green)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{b}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'rgba(75,110,245,0.06)', border: '1px solid rgba(75,110,245,0.12)' }}>
            <div className="flex -space-x-2">
              {['R', 'P', 'A', 'V'].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2" style={{ background: ['#4B6EF5','#00C48C','#F59E0B','#8B5CF6'][i], borderColor: 'var(--bg-card)' }}>{l}</div>
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Join 1,200+ families</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>protecting their legacy today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — auth */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)' }}>↑</div>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Inheritance OS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {isLogin ? 'Sign in to access your estate dashboard' : 'Start protecting your family\'s legacy today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                  <input required type="text" className="input-field" placeholder="Raj Kumar" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <input required type="email" className="input-field" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input required type={showPass ? 'text' : 'password'} className="input-field pr-12" placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 mt-2 text-base group">
              {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setForm({ name: '', email: '', password: '' }); }}
              className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="font-semibold" style={{ color: '#818CF8' }}>
                {isLogin ? 'Create one' : 'Sign in'}
              </span>
            </button>
          </div>

          {/* Security note */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Shield size={13} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>256-bit AES encryption · SSL secured · Your data never sold</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
