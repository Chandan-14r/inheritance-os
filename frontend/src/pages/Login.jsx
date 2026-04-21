import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { useData } from '../DataContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { fetchAllData } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);
      localStorage.setItem('ios_token', data.token);
      toast.success(isLogin ? `Welcome back, ${data.user.name}` : 'Account secured!');
      await fetchAllData();
      // App.jsx will automatically re-render based on auth token existing implicitly.
      window.location.reload(); 
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060918] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#060918] to-[#060918] p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-indigo-500 blur-[8px]" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 rotate-3 hover:rotate-6 transition-transform">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            {isLogin ? 'Welcome Back' : 'Create Your Legacy'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Securely access your Inheritance OS digital vault
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase font-semibold tracking-wider">Full Name</label>
                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3.5 bg-[#0b1120] rounded-xl border border-[#1e293b] text-white placeholder-slate-600 focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Raj Kumar" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase font-semibold tracking-wider">Email Address</label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-3.5 bg-[#0b1120] rounded-xl border border-[#1e293b] text-white placeholder-slate-600 focus:border-indigo-500 transition-colors"
              placeholder="you@example.com" />
          </div>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase font-semibold tracking-wider">Password</label>
            <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full p-3.5 bg-[#0b1120] rounded-xl border border-[#1e293b] text-white placeholder-slate-600 focus:border-indigo-500 transition-colors"
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50">
            {loading ? (isLogin ? 'Authenticating...' : 'Securing Account...') : (isLogin ? 'Enter Vault' : 'Initialize Vault')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setForm({ name: '', email: '', password: '' }); }} type="button"
            className="text-sm text-slate-400 hover:text-white transition-colors">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
