import { useData } from '../DataContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Wallet, AlertTriangle, Users, Shield, TrendingUp, ArrowUpRight, CheckCircle, ArrowUp, Sparkles, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const COLORS = ['#4B6EF5', '#00C48C', '#F59E0B', '#F6465D', '#8B5CF6', '#06B6D4', '#EC4899'];

const GROWTH_DATA = [
  { month: 'Nov', value: 19000000 }, { month: 'Dec', value: 19500000 },
  { month: 'Jan', value: 19200000 }, { month: 'Feb', value: 19800000 },
  { month: 'Mar', value: 20200000 }, { month: 'Apr', value: 20000000 },
  { month: 'May', value: 20800000 }, { month: 'Jun', value: 21200000 },
  { month: 'Jul', value: 21000000 }, { month: 'Aug', value: 21500000 },
  { month: 'Sep', value: 21800000 }, { month: 'Oct', value: 22500000 },
];

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const v = payload[0].value;
    return (
      <div className="card p-3">
        <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
        <div className="font-mono-num font-bold" style={{ color: 'var(--accent-green)' }}>
          ₹{(v / 100000).toFixed(1)}L
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { assets, beneficiaries, totalWorth, byType, estimatedTax, totalAllocation, profile } = useData();
  const nav = useNavigate();

  const pieData = Object.entries(byType).map(([k, v]) => ({ name: k.replace('_', ' '), value: v }));
  const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;
  const fmtCr = (n) => n > 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` : fmt(n);

  const daysSinceCheckIn = Math.floor((Date.now() - new Date(profile.lastCheckIn).getTime()) / (1000 * 60 * 60 * 24));
  const lettersGenerated = beneficiaries.filter(b => b.aiLetter).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const exportEstatePlan = () => {
    let csv = '--- INHERITANCE OS ESTATE REPORT ---\n\nASSETS\nType,Name,Institution,Ticker/Qty,Value (INR)\n';
    assets.forEach(a => {
      csv += `${a.type},"${a.name}","${a.institution||''}","${a.ticker?`${a.ticker} (${a.quantity})`:''}",${a.value}\n`;
    });
    
    csv += '\nBENEFICIARIES\nName,Relationship,Allocation,Letters Ready\n';
    beneficiaries.forEach(b => {
      csv += `"${b.name}","${b.relationship}",${b.allocationPercent}%,${b.aiLetter?'Yes':'No'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Inheritance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Estate Report exported as CSV ✓');
  };

  const CHECKLIST = [
    { label: 'Assets documented', done: assets.length > 0, link: '/dashboard/assets' },
    { label: 'Beneficiaries assigned', done: beneficiaries.length > 0, link: '/dashboard/beneficiaries' },
    { label: 'Allocation at 100%', done: totalAllocation === 100, link: '/dashboard/beneficiaries' },
    { label: 'AI letters generated', done: lettersGenerated === beneficiaries.length && beneficiaries.length > 0, link: '/dashboard/letters' },
    { label: "Dead man's switch on", done: profile.switchEnabled, link: '/dashboard/dead-man-switch' },
    { label: 'Executor assigned', done: !!profile.executorEmail, link: '/dashboard/dead-man-switch' },
  ];
  const completedTasks = CHECKLIST.filter(c => c.done).length;
  const readinessPercent = Math.round((completedTasks / CHECKLIST.length) * 100);

  const KPI_CARDS = [
    {
      icon: Wallet, label: 'Net Worth', accent: 'kpi-card-green',
      value: <span className="font-mono-num"><AnimatedNumber value={Math.round(totalWorth / 100000)} prefix="₹" suffix="L" /></span>,
      sub: `${assets.length} assets · live tracked`,
      subColor: 'var(--accent-green)',
      bg: 'rgba(0,196,140,0.08)', border: 'rgba(0,196,140,0.15)',
      link: '/dashboard/assets',
    },
    {
      icon: AlertTriangle, label: 'Estate Tax Est.',
      accent: estimatedTax > 0 ? 'kpi-card-red' : 'kpi-card-green',
      value: <span className="font-mono-num">{fmtCr(estimatedTax)}</span>,
      sub: estimatedTax > 0 ? 'Above ₹1Cr threshold' : 'No tax liability',
      subColor: estimatedTax > 0 ? 'var(--accent-red)' : 'var(--accent-green)',
      bg: estimatedTax > 0 ? 'rgba(246,70,93,0.07)' : 'rgba(0,196,140,0.05)',
      border: estimatedTax > 0 ? 'rgba(246,70,93,0.15)' : 'rgba(0,196,140,0.12)',
    },
    {
      icon: Users, label: 'Beneficiaries',
      accent: totalAllocation === 100 ? 'kpi-card-blue' : 'kpi-card-amber',
      value: <span className="font-mono-num">{beneficiaries.length}</span>,
      sub: `${totalAllocation}% of estate allocated`,
      subColor: totalAllocation === 100 ? '#818CF8' : 'var(--accent-amber)',
      bg: 'rgba(75,110,245,0.06)', border: 'rgba(75,110,245,0.12)',
      link: '/dashboard/beneficiaries',
    },
    {
      icon: Shield, label: 'Letters Ready',
      accent: lettersGenerated === beneficiaries.length && beneficiaries.length > 0 ? 'kpi-card-green' : 'kpi-card-amber',
      value: <span className="font-mono-num">{lettersGenerated}<span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>/{beneficiaries.length}</span></span>,
      sub: lettersGenerated === beneficiaries.length && beneficiaries.length > 0 ? 'All generated ✓' : 'Needs attention',
      subColor: lettersGenerated === beneficiaries.length && beneficiaries.length > 0 ? 'var(--accent-green)' : 'var(--accent-amber)',
      bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.12)',
      link: '/dashboard/letters',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {greeting}, {profile.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            Here's an overview of your financial legacy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: daysSinceCheckIn < 30 ? 'rgba(0,196,140,0.1)' : 'rgba(245,158,11,0.1)', color: daysSinceCheckIn < 30 ? 'var(--accent-green)' : 'var(--accent-amber)', border: `1px solid ${daysSinceCheckIn < 30 ? 'rgba(0,196,140,0.2)' : 'rgba(245,158,11,0.2)'}` }}
          >
            <span className={`status-dot ${daysSinceCheckIn < 30 ? 'status-dot-green' : 'status-dot-amber'}`} />
            Check-in: {daysSinceCheckIn}d ago
          </span>
          <button onClick={exportEstatePlan} className="btn btn-ghost gap-2">
            <Download size={14} />
            Export Plan
          </button>
          <button onClick={() => nav('/dashboard/letters')} className="btn btn-primary gap-2">
            <Sparkles size={14} />
            Generate Letters
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-4 gap-4">
        {KPI_CARDS.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`kpi-card ${c.accent}`}
            style={{ background: c.bg, borderColor: c.border }}
            onClick={() => c.link && nav(c.link)}
          >
            <div className="flex items-center justify-between mb-4">
              <c.icon size={16} style={{ color: 'var(--text-muted)' }} />
              <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>{c.label}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{c.value}</div>
            <div className="text-xs font-medium" style={{ color: c.subColor }}>{c.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Portfolio Growth</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>12-month overview</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,196,140,0.1)', color: 'var(--accent-green)' }}>
              <ArrowUp size={12} />
              +15.4% YTD
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={GROWTH_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C48C" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#00C48C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" stroke="#2A3F60" tickLine={false} axisLine={false} fontSize={11} tick={{ fill: '#4E607D' }} />
              <YAxis stroke="#2A3F60" tickLine={false} axisLine={false} tickFormatter={fmt} fontSize={10} width={55} tick={{ fill: '#4E607D' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#00C48C" strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, fill: '#00C48C', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Estate Readiness */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Estate Readiness</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>{completedTasks} of {CHECKLIST.length} steps complete</p>

          {/* Circular progress */}
          <div className="flex justify-center mb-5">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="#161E30" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42"
                  stroke="url(#ringGrad)" strokeWidth="8" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(completedTasks / CHECKLIST.length) * 263.9} 263.9`}
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00C48C" />
                    <stop offset="100%" stopColor="#06EAAA" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono-num" style={{ color: 'var(--accent-green)' }}>{readinessPercent}%</span>
                <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>READY</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {CHECKLIST.map((item, i) => (
              <div
                key={i}
                onClick={() => !item.done && nav(item.link)}
                className="flex items-center gap-2.5 py-1 px-2 rounded-lg transition-colors cursor-pointer hover:bg-[var(--bg-hover)]"
              >
                {item.done
                  ? <CheckCircle size={13} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                  : <div className="w-3 h-3 rounded-full border flex-shrink-0" style={{ borderColor: 'var(--text-muted)' }} />
                }
                <span className="text-xs" style={{ color: item.done ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Asset Distribution</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={4}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                    </div>
                    <span className="text-xs font-mono-num font-semibold" style={{ color: 'var(--text-primary)' }}>{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              <Wallet size={32} className="mb-2 opacity-30" />
              <p className="text-sm cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => nav('/dashboard/assets')}>Add assets to see distribution →</p>
            </div>
          )}
        </motion.div>

        {/* Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Inheritance Allocation</h3>
            <span className="badge" style={{ background: totalAllocation === 100 ? 'rgba(0,196,140,0.1)' : 'rgba(245,158,11,0.1)', color: totalAllocation === 100 ? 'var(--accent-green)' : 'var(--accent-amber)', border: `1px solid ${totalAllocation === 100 ? 'rgba(0,196,140,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
              {totalAllocation}% Allocated
            </span>
          </div>
          {beneficiaries.length > 0 ? (
            <div className="space-y-4">
              {beneficiaries.map((b, i) => {
                const bcolor = COLORS[i % COLORS.length];
                return (
                  <div key={b._id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: bcolor }}>
                          {b.name[0]}
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.name}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({b.relationship})</span>
                      </div>
                      <span className="text-sm font-mono-num font-bold" style={{ color: bcolor }}>{b.allocationPercent}%</span>
                    </div>
                    <div className="progress-track">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${b.allocationPercent}%` }}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.15, ease: 'easeOut' }}
                        style={{ background: bcolor }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>≈ {fmt(totalWorth * b.allocationPercent / 100)}</span>
                      <span className="text-[11px]" style={{ color: b.aiLetter ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                        {b.aiLetter ? '✉ Letter ready' : '○ Letter needed'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              <Users size={32} className="mb-2 opacity-30" />
              <p className="text-sm cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => nav('/dashboard/beneficiaries')}>Add beneficiaries →</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
