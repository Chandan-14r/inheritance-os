import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Wallet, Users, Mail, TrendingUp, Clock, GitBranch, LogOut, Bell, Settings, ChevronRight } from 'lucide-react';
import { useData } from '../DataContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', icon: Home, label: 'Overview', end: true },
  { to: '/dashboard/assets', icon: Wallet, label: 'Asset Vault' },
  { to: '/dashboard/beneficiaries', icon: Users, label: 'Beneficiaries' },
  { to: '/dashboard/family-tree', icon: GitBranch, label: 'Family Tree' },
  { to: '/dashboard/letters', icon: Mail, label: 'AI Letters' },
  { to: '/dashboard/simulator', icon: TrendingUp, label: 'Simulator' },
  { to: '/dashboard/dead-man-switch', icon: Clock, label: "Dead Man's Switch" },
];

export default function Layout() {
  const { profile, logout, totalWorth, assets } = useData();
  const nav = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out securely');
    nav('/login');
  };

  const initials = profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="w-60 fixed h-full z-20 flex flex-col border-r" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #4B6EF5, #7C3AED)' }}>
              ↑
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>Inheritance OS</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Estate Platform</div>
            </div>
          </div>
        </div>

        {/* Net worth summary pill */}
        <div className="mx-3 mt-3 p-3 rounded-xl" style={{ background: 'rgba(75,110,245,0.07)', border: '1px solid rgba(75,110,245,0.12)' }}>
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Portfolio Value</div>
          <div className="font-bold font-mono-num mt-0.5" style={{ color: 'var(--accent-green)', fontSize: '18px' }}>
            {fmt(totalWorth)}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{assets.length} assets tracked</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="section-label px-3 mb-2">Navigation</div>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Profile section */}
        <div className="px-3 py-4 border-t relative" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setShowProfileMenu(v => !v)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4B6EF5, #7C3AED)' }}>
              {initials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{profile.name}</div>
              <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{profile.email || 'Account'}</div>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute bottom-full left-3 right-3 mb-1 card p-2 space-y-0.5"
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-red-500/10 text-red-400"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 px-8 py-3 flex items-center justify-between border-b" style={{ background: 'rgba(7,11,20,0.85)', backdropFilter: 'blur(16px)', borderColor: 'var(--border)' }}>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,196,140,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(0,196,140,0.2)' }}>
              <span className="status-dot status-dot-green" />
              Markets Live
            </div>
            <div className="font-mono-num text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 bg-grid">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
