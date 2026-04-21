import { useData } from '../DataContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { Wallet, AlertTriangle, Users, Shield, TrendingUp, ArrowUpRight, CheckCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const GROWTH_DATA = [
  { month: 'Jan', value: 19500000 }, { month: 'Feb', value: 19800000 },
  { month: 'Mar', value: 20200000 }, { month: 'Apr', value: 20000000 },
  { month: 'May', value: 20800000 }, { month: 'Jun', value: 21200000 },
  { month: 'Jul', value: 21000000 }, { month: 'Aug', value: 21500000 },
  { month: 'Sep', value: 21800000 }, { month: 'Oct', value: 22000000 },
  { month: 'Nov', value: 22200000 }, { month: 'Dec', value: 22500000 },
];

export default function Dashboard() {
  const { assets, beneficiaries, totalWorth, byType, estimatedTax, totalAllocation, profile } = useData();
  const nav = useNavigate();

  const pieData = Object.entries(byType).map(([k, v]) => ({ name: k.replace('_', ' '), value: v }));
  const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;

  const daysSinceCheckIn = Math.floor((Date.now() - new Date(profile.lastCheckIn).getTime()) / (1000 * 60 * 60 * 24));
  const lettersGenerated = beneficiaries.filter(b => b.aiLetter).length;

  const CHECKLIST = [
    { label: 'Assets documented', done: assets.length > 0, link: '/dashboard/assets' },
    { label: 'Beneficiaries assigned', done: beneficiaries.length > 0, link: '/dashboard/beneficiaries' },
    { label: 'Allocation equals 100%', done: totalAllocation === 100, link: '/dashboard/beneficiaries' },
    { label: 'AI letters generated', done: lettersGenerated === beneficiaries.length && beneficiaries.length > 0, link: '/dashboard/letters' },
    { label: 'Dead man\'s switch enabled', done: profile.switchEnabled, link: '/dashboard/dead-man-switch' },
    { label: 'Executor assigned', done: !!profile.executorEmail, link: '/dashboard/dead-man-switch' },
  ];
  const completedTasks = CHECKLIST.filter(c => c.done).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">{greeting}, {profile.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-400">Here's an overview of your financial legacy</p>
        </div>
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
          <div className={`w-2 h-2 rounded-full ${daysSinceCheckIn < 30 ? 'bg-green-400' : daysSinceCheckIn < 60 ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`} />
          <span className="text-sm text-slate-300">Last check-in: {daysSinceCheckIn} day{daysSinceCheckIn !== 1 ? 's' : ''} ago</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: Wallet, label: 'Net Worth', value: fmt(totalWorth), sub: `${assets.length} assets total`, subColor: 'text-green-400', gradient: 'from-indigo-500 to-purple-500', link: '/dashboard/assets' },
          { icon: AlertTriangle, label: 'Est. Estate Tax', value: fmt(estimatedTax), sub: totalWorth > 10000000 ? 'Above ₹1Cr threshold' : 'Below threshold', subColor: estimatedTax > 0 ? 'text-amber-400' : 'text-green-400', gradient: 'from-orange-500 to-red-500' },
          { icon: Users, label: 'Beneficiaries', value: beneficiaries.length, sub: `${totalAllocation}% allocated`, subColor: totalAllocation === 100 ? 'text-green-400' : 'text-amber-400', gradient: 'from-pink-500 to-rose-500', link: '/dashboard/beneficiaries' },
          { icon: Shield, label: 'Letters Ready', value: `${lettersGenerated}/${beneficiaries.length}`, sub: lettersGenerated === beneficiaries.length ? 'All generated ✓' : 'Needs attention', subColor: lettersGenerated === beneficiaries.length ? 'text-green-400' : 'text-amber-400', gradient: 'from-emerald-500 to-green-500', link: '/dashboard/letters' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card p-5 rounded-2xl cursor-pointer" onClick={() => c.link && nav(c.link)}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg`}>
                <c.icon size={18} />
              </div>
              <ArrowUpRight size={16} className="text-slate-500" />
            </div>
            <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{c.label}</div>
            <div className="text-2xl font-bold mt-1">{c.value}</div>
            <div className={`text-xs mt-1 ${c.subColor}`}>{c.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Portfolio Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Portfolio Growth (12 months)</h3>
            <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <TrendingUp size={14} /> +15.4%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={GROWTH_DATA}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#475569" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#475569" tickLine={false} axisLine={false} tickFormatter={fmt} fontSize={11} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', color: 'white' }} formatter={fmt} />
              <Bar dataKey="value" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Estate Readiness */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-1">Estate Readiness</h3>
          <p className="text-sm text-slate-400 mb-4">{completedTasks}/{CHECKLIST.length} completed</p>
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="6" fill="none" />
                <circle cx="48" cy="48" r="40" stroke="url(#progressGrad)" strokeWidth="6" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(completedTasks / CHECKLIST.length) * 251.2} 251.2`} />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                {Math.round((completedTasks / CHECKLIST.length) * 100)}%
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            {CHECKLIST.map((item, i) => (
              <div key={i} onClick={() => !item.done && nav(item.link)}
                className={`flex items-center gap-2 text-sm p-1.5 rounded cursor-pointer hover:bg-white/5 transition-colors ${item.done ? 'text-slate-300' : 'text-slate-500'}`}>
                {item.done
                  ? <CheckCircle size={14} className="text-green-400 shrink-0" />
                  : <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />}
                <span className={item.done ? '' : 'opacity-60'}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Asset Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">Asset Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={fmt} contentStyle={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', color: 'white' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-400 cursor-pointer" onClick={() => nav('/dashboard/assets')}>
              <p>Click here to add your first asset →</p>
            </div>
          )}
        </motion.div>

        {/* Inheritance Allocation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">Inheritance Allocation</h3>
          {beneficiaries.length > 0 ? beneficiaries.map((b, i) => {
            const colors = ['from-indigo-500 to-purple-500', 'from-pink-500 to-rose-500', 'from-cyan-500 to-blue-500', 'from-amber-500 to-orange-500'];
            return (
              <div key={b._id} className="mb-5">
                <div className="flex justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-xs font-bold`}>{b.name[0]}</div>
                    <span className="font-medium">{b.name} <span className="text-slate-500 text-sm">({b.relationship})</span></span>
                  </div>
                  <span className="font-bold text-indigo-400">{b.allocationPercent}%</span>
                </div>
                <div className="h-2.5 bg-[#151a2e] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${b.allocationPercent}%` }}
                    transition={{ duration: 1.2, delay: 0.6 + i * 0.15 }}
                    className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full`}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ≈ {fmt(totalWorth * b.allocationPercent / 100)} • {b.aiLetter ? '✉️ Letter ready' : '📝 Letter needed'}
                </div>
              </div>
            );
          }) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 cursor-pointer" onClick={() => nav('/dashboard/beneficiaries')}>
              <p>Click here to add beneficiaries →</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
