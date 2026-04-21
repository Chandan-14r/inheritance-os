import { useState } from 'react';
import { useData } from '../DataContext';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

function runSimulation(initial, years, expectedReturn, volatility, simulations = 1000) {
  const results = [];
  for (let i = 0; i < simulations; i++) {
    let value = initial;
    const path = [value];
    for (let y = 0; y < years; y++) {
      const randomReturn = expectedReturn + volatility * (Math.random() * 2 - 1);
      value = value * (1 + randomReturn);
      path.push(value);
    }
    results.push(path);
  }
  const percentiles = [];
  for (let y = 0; y <= years; y++) {
    const valuesAtYear = results.map(r => r[y]).sort((a, b) => a - b);
    percentiles.push({
      year: y,
      p10: valuesAtYear[Math.floor(simulations * 0.1)],
      p50: valuesAtYear[Math.floor(simulations * 0.5)],
      p90: valuesAtYear[Math.floor(simulations * 0.9)],
    });
  }
  return { initial, percentiles, finalMedian: percentiles[years].p50 };
}

const PRESETS = [
  { label: 'Conservative', expectedReturn: 0.06, volatility: 0.08, years: 20 },
  { label: 'Balanced', expectedReturn: 0.08, volatility: 0.15, years: 30 },
  { label: 'Aggressive', expectedReturn: 0.12, volatility: 0.22, years: 30 },
];

export default function Simulator() {
  const { totalWorth, beneficiaries } = useData();
  const [data, setData] = useState(null);
  const [params, setParams] = useState({ years: 30, expectedReturn: 0.08, volatility: 0.15 });
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState(1);

  const run = () => {
    if (totalWorth <= 0) return;
    setLoading(true);
    setTimeout(() => {
      const result = runSimulation(totalWorth, params.years, params.expectedReturn, params.volatility);
      setData(result);
      setLoading(false);
    }, 400);
  };

  const applyPreset = (idx) => {
    setActivePreset(idx);
    setParams(PRESETS[idx]);
  };

  const fmt = (n) => `₹${(n / 10000000).toFixed(2)}Cr`;
  const fmtL = (n) => `₹${(n / 100000).toFixed(0)}L`;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Multi-Generational Wealth Simulator</h1>
      <p className="text-slate-400 mb-8">Projecting your actual portfolio of <span className="text-green-400 font-semibold">{fmtL(totalWorth)}</span> across generations</p>

      <div className="flex gap-3 mb-6">
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => applyPreset(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activePreset === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'glass text-slate-400 hover:text-white'
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-6 rounded-2xl mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Projection Years</label>
            <input type="number" value={params.years}
              onChange={e => setParams({ ...params, years: Number(e.target.value) })}
              className="w-full p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white focus:border-indigo-500/50 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Expected Return (%)</label>
            <input type="number" step="0.5" value={(params.expectedReturn * 100).toFixed(1)}
              onChange={e => setParams({ ...params, expectedReturn: Number(e.target.value) / 100 })}
              className="w-full p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white focus:border-indigo-500/50 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Volatility (%)</label>
            <input type="number" step="0.5" value={(params.volatility * 100).toFixed(1)}
              onChange={e => setParams({ ...params, volatility: Number(e.target.value) / 100 })}
              className="w-full p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white focus:border-indigo-500/50 focus:outline-none transition-colors" />
          </div>
          <div className="flex items-end">
            <button onClick={run} disabled={loading || totalWorth <= 0}
              className="w-full p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-500/25">
              <Play size={16} fill="white" />
              {loading ? 'Running...' : 'Run 1,000 Simulations'}
            </button>
          </div>
        </div>
      </div>

      {data && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Starting Wealth', value: fmt(data.initial), color: 'text-white' },
              { label: `Median in ${params.years} years`, value: fmt(data.finalMedian), color: 'text-green-400' },
              { label: 'Growth Multiple', value: `${(data.finalMedian / data.initial).toFixed(1)}x`, color: 'gradient-text' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-5 rounded-2xl">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{s.label}</div>
                <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="glass-card p-6 rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Wealth Projection Cone</h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-green-500 rounded" /> Best 90th</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-indigo-500 rounded" /> Median</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-red-500 rounded" /> Worst 10th</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data.percentiles}>
                <defs>
                  <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.25} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#334155" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#334155" tickLine={false} axisLine={false} tickFormatter={fmt} fontSize={11} width={80} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: 'white', fontSize: '13px' }} formatter={fmt} labelFormatter={l => `Year ${l}`} />
                <Area type="monotone" dataKey="p90" stroke="#10b981" fill="url(#gG)" strokeWidth={2} name="Best Case" dot={false} />
                <Area type="monotone" dataKey="p50" stroke="#6366f1" fill="url(#gI)" strokeWidth={2.5} name="Median" dot={false} />
                <Area type="monotone" dataKey="p10" stroke="#ef4444" fill="url(#gR)" strokeWidth={2} name="Worst Case" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Beneficiary projections */}
          {beneficiaries.length > 0 && (
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-lg font-bold mb-3">Projected Inheritance per Beneficiary</h3>
              <div className="grid grid-cols-3 gap-4">
                {beneficiaries.map((b, i) => {
                  const medianFinal = data.finalMedian * b.allocationPercent / 100;
                  return (
                    <div key={b._id} className="p-4 bg-[#0b1120] rounded-xl">
                      <div className="text-sm font-semibold">{b.name}</div>
                      <div className="text-xs text-slate-400">{b.relationship} • {b.allocationPercent}%</div>
                      <div className="text-xl font-bold text-indigo-400 mt-2">{fmt(medianFinal)}</div>
                      <div className="text-xs text-green-400">Today: {fmtL(totalWorth * b.allocationPercent / 100)} → {params.years}yr: {fmt(medianFinal)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
