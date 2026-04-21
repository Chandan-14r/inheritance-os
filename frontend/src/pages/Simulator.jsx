import { useState } from 'react';
import { useData } from '../DataContext';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from 'recharts';
import { Play, TrendingUp, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

function runSimulation(initial, years, expectedReturn, volatility, simulations = 1000) {
  const results = [];
  for (let i = 0; i < simulations; i++) {
    let value = initial;
    const path = [value];
    for (let y = 0; y < years; y++) {
      const r = expectedReturn + volatility * (Math.random() * 2 - 1);
      value = value * (1 + r);
      path.push(value);
    }
    results.push(path);
  }
  const percentiles = [];
  for (let y = 0; y <= years; y++) {
    const vals = results.map(r => r[y]).sort((a, b) => a - b);
    percentiles.push({
      year: y,
      p10: vals[Math.floor(simulations * 0.1)],
      p50: vals[Math.floor(simulations * 0.5)],
      p90: vals[Math.floor(simulations * 0.9)],
    });
  }
  return { initial, percentiles, finalMedian: percentiles[years].p50, finalP90: percentiles[years].p90, finalP10: percentiles[years].p10 };
}

const PRESETS = [
  { label: 'Conservative', return: 6, volatility: 8, years: 20, color: '#00C48C', desc: 'FD + Bonds heavy, low risk' },
  { label: 'Balanced', return: 10, volatility: 15, years: 25, color: '#4B6EF5', desc: 'Mixed equity + debt portfolio' },
  { label: 'Aggressive', return: 15, volatility: 25, years: 30, color: '#F59E0B', desc: 'Equity & crypto heavy, high risk' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card p-3 text-sm">
        <div className="mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>Year {label}</div>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{p.name}:</span>
            <span className="font-mono-num font-bold" style={{ color: p.color, fontSize: 11 }}>
              ₹{(p.value / 10000000).toFixed(2)}Cr
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Simulator() {
  const { totalWorth, beneficiaries } = useData();
  const [result, setResult] = useState(null);
  const [params, setParams] = useState({ years: 25, expectedReturn: 10, volatility: 15 });
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState(1);

  const run = () => {
    if (totalWorth <= 0) { toast?.error('Add assets first'); return; }
    setLoading(true);
    setTimeout(() => {
      const r = runSimulation(totalWorth, params.years, params.expectedReturn / 100, params.volatility / 100);
      setResult(r);
      setLoading(false);
    }, 500);
  };

  const applyPreset = (i) => {
    setActivePreset(i);
    setParams({ years: PRESETS[i].years, expectedReturn: PRESETS[i].return, volatility: PRESETS[i].volatility });
  };

  const fmtCr = (n) => `₹${(n / 10000000).toFixed(2)}Cr`;
  const fmtL = (n) => `₹${(n / 100000).toFixed(0)}L`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Wealth Simulator</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Monte Carlo simulation on your{' '}
          <span className="font-mono-num font-bold" style={{ color: 'var(--accent-green)' }}>{fmtL(totalWorth)}</span>{' '}
          portfolio across generations
        </p>
      </div>

      {/* Config card */}
      <div className="card p-6">
        {/* Presets */}
        <div className="section-label mb-3">Strategy Preset</div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => applyPreset(i)}
              className="p-4 rounded-xl text-left transition-all"
              style={activePreset === i
                ? { background: `${p.color}15`, border: `1px solid ${p.color}40` }
                : { background: 'var(--bg-primary)', border: '1px solid var(--border)' }
              }
            >
              <div className="font-semibold text-sm mb-0.5" style={{ color: activePreset === i ? p.color : 'var(--text-primary)' }}>
                {p.label}
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{p.desc}</div>
              <div className="flex gap-3 text-xs font-mono-num">
                <span style={{ color: 'var(--accent-green)' }}>{p.return}%/yr</span>
                <span style={{ color: 'var(--text-muted)' }}>±{p.volatility}%</span>
                <span style={{ color: 'var(--text-muted)' }}>{p.years}yr</span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom params */}
        <div className="section-label mb-3">Custom Parameters</div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Years</label>
            <input type="number" className="input-field font-mono-num" value={params.years}
              onChange={e => setParams({ ...params, years: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Expected Return (%)</label>
            <input type="number" step="0.5" className="input-field font-mono-num" value={params.expectedReturn}
              onChange={e => setParams({ ...params, expectedReturn: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Volatility (%)</label>
            <input type="number" step="0.5" className="input-field font-mono-num" value={params.volatility}
              onChange={e => setParams({ ...params, volatility: Number(e.target.value) })} />
          </div>
          <div className="flex items-end">
            <button onClick={run} disabled={loading || totalWorth <= 0} className="btn btn-primary w-full py-3">
              <Play size={14} fill="white" />
              {loading ? 'Running...' : 'Run 1,000 Paths'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Starting Wealth', value: fmtCr(result.initial), color: 'var(--text-primary)', accent: 'var(--text-muted)' },
              { label: `Worst Case (${params.years}yr)`, value: fmtCr(result.finalP10), color: 'var(--accent-red)', accent: 'rgba(246,70,93,0.1)' },
              { label: `Median (${params.years}yr)`, value: fmtCr(result.finalMedian), color: 'var(--accent-green)', accent: 'rgba(0,196,140,0.1)' },
              { label: `Best Case (${params.years}yr)`, value: fmtCr(result.finalP90), color: '#FBBF24', accent: 'rgba(245,158,11,0.1)' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="card p-5" style={{ borderColor: s.accent === 'var(--text-muted)' ? undefined : s.accent }}>
                <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                <div className="text-2xl font-bold font-mono-num" style={{ color: s.color }}>{s.value}</div>
                {i > 0 && <div className="text-xs mt-1 flex items-center gap-1" style={{ color: s.color }}>
                  <ArrowUp size={10} /> {(result[['finalP10','finalP10','finalMedian','finalP90'][i]] / result.initial).toFixed(1)}x return
                </div>}
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Wealth Projection Cone</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>1,000 Monte Carlo simulations · 10th / 50th / 90th percentile</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {[['#FBBF24', 'Best Case (P90)'], ['#4B6EF5', 'Median (P50)'], ['#F6465D', 'Worst Case (P10)']].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded" style={{ background: c }} />
                    <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={result.percentiles} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FBBF24" stopOpacity={0.2} /><stop offset="95%" stopColor="#FBBF24" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4B6EF5" stopOpacity={0.25} /><stop offset="95%" stopColor="#4B6EF5" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F6465D" stopOpacity={0.15} /><stop offset="95%" stopColor="#F6465D" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="year" stroke="#2A3F60" tickLine={false} axisLine={false} fontSize={11} tick={{ fill: '#4E607D' }} />
                <YAxis stroke="#2A3F60" tickLine={false} axisLine={false} tickFormatter={fmtCr} fontSize={10} width={75} tick={{ fill: '#4E607D' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="p90" stroke="#FBBF24" fill="url(#gG)" strokeWidth={2} name="Best Case" dot={false} />
                <Area type="monotone" dataKey="p50" stroke="#4B6EF5" fill="url(#gI)" strokeWidth={2.5} name="Median" dot={false} />
                <Area type="monotone" dataKey="p10" stroke="#F6465D" fill="url(#gR)" strokeWidth={2} name="Worst Case" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Per-beneficiary projections */}
          {beneficiaries.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Projected Inheritance per Beneficiary</h3>
              <div className="grid grid-cols-3 gap-3">
                {beneficiaries.map((b, i) => {
                  const median = result.finalMedian * b.allocationPercent / 100;
                  return (
                    <div key={b._id} className="card-elevated p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#4B6EF5' }}>{b.name[0]}</div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{b.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{b.relationship} · {b.allocationPercent}%</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold font-mono-num" style={{ color: 'var(--accent-green)' }}>{fmtCr(median)}</div>
                      <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        Today: {fmtL(totalWorth * b.allocationPercent / 100)} → {params.years}yr median
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {!result && !loading && (
        <div className="card p-16 text-center">
          <TrendingUp size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Run your first simulation</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Choose a preset and click "Run 1,000 Paths" to see wealth projections</p>
          <button onClick={run} disabled={totalWorth <= 0} className="btn btn-primary">
            <Play size={14} fill="white" /> Run Simulation
          </button>
        </div>
      )}
    </div>
  );
}
