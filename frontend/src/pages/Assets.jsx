import { useState, useMemo } from 'react';
import { useData } from '../DataContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, Search, Edit3, X, Check, Activity, ScanLine, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPES = ['bank', 'stocks', 'mutual_fund', 'crypto', 'real_estate', 'insurance', 'ppf', 'nps', 'gold', 'fd', 'other'];
const TYPE_ICONS = {
  bank: '🏦', stocks: '📈', mutual_fund: '📊', crypto: '₿', real_estate: '🏠',
  insurance: '🛡️', ppf: '🏛️', nps: '📋', gold: '🥇', fd: '🏧', other: '📦'
};
const TYPE_COLORS = {
  bank: '#4B6EF5', stocks: '#00C48C', mutual_fund: '#8B5CF6', crypto: '#F59E0B',
  real_estate: '#F6465D', insurance: '#06B6D4', ppf: '#818CF8', nps: '#10B981',
  gold: '#FBBF24', fd: '#94A3B8', other: '#64748B',
};

function AddAssetDrawer({ onClose, onAdd }) {
  const [form, setForm] = useState({ type: 'bank', name: '', institution: '', value: '', ticker: '', quantity: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const isLive = ['stocks', 'crypto', 'mutual_fund'].includes(form.type);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.value) { toast.error('Name and value are required'); return; }
    setLoading(true);
    const payload = { ...form, value: Number(form.value), quantity: form.quantity ? Number(form.quantity) : null, ticker: form.ticker || undefined };
    await onAdd(payload);
    setLoading(false);
    onClose();
  };

  return (
    <>
      <motion.div className="drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 280 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Add Asset</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Add a new asset to your vault</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost p-2"><X size={16} /></button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Type selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Asset Type</label>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.slice(0, 9).map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                  className="py-2 px-2 rounded-xl text-xs font-medium transition-all text-center"
                  style={form.type === t
                    ? { background: `${TYPE_COLORS[t]}20`, color: TYPE_COLORS[t], border: `1px solid ${TYPE_COLORS[t]}40` }
                    : { background: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                  }>
                  <div className="text-base mb-0.5">{TYPE_ICONS[t]}</div>
                  <div className="capitalize">{t.replace('_', ' ')}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Asset Name</label>
            <input required className="input-field" placeholder="e.g. HDFC Savings Account" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Institution / Platform</label>
            <input className="input-field" placeholder="e.g. HDFC Bank, Zerodha" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Current Value (₹)</label>
            <input required type="number" className="input-field font-mono-num" placeholder="0.00" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
          </div>

          {/* Live Market Section */}
          <AnimatePresence>
            {isLive && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="rounded-xl p-4" style={{ background: 'rgba(0,196,140,0.06)', border: '1px solid rgba(0,196,140,0.2)' }}>
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold" style={{ color: 'var(--accent-green)' }}>
                  <ScanLine size={13} />
                  LIVE MARKET TRACKING
                  <span className="badge badge-live">LIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Ticker / Symbol</label>
                    <input type="text" className="input-field font-mono-num text-sm" placeholder="AAPL / BTC-USD" value={form.ticker}
                      onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Quantity</label>
                    <input type="number" step="0.0001" className="input-field font-mono-num text-sm" placeholder="e.g. 10" value={form.quantity}
                      onChange={e => setForm({ ...form, quantity: e.target.value })} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Notes</label>
            <textarea className="input-field resize-none" rows={2} placeholder="Account numbers, asset story..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
            {loading ? 'Adding...' : 'Add Asset to Vault'}
          </button>
        </form>
      </motion.div>
    </>
  );
}

export default function Assets() {
  const { assets, addAsset, deleteAsset, updateAsset, totalWorth, syncMarketData } = useData();
  const [showDrawer, setShowDrawer] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [sortBy, setSortBy] = useState('value');
  const [sortDir, setSortDir] = useState('desc');

  const handleAdd = async (payload) => {
    const ok = await addAsset(payload);
    if (ok) toast.success(`${payload.name} added to vault ✓`);
    return ok;
  };

  const handleSync = async () => {
    setSyncing(true);
    await syncMarketData();
    setSyncing(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove "${name}" from vault?`)) {
      deleteAsset(id);
      toast.success('Asset removed');
    }
  };

  const saveEdit = (id) => {
    updateAsset(id, { value: Number(editValue) });
    setEditingId(null);
    toast.success('Value updated');
  };

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let list = assets.filter(a => {
      const q = search.toLowerCase();
      return (a.name.toLowerCase().includes(q) || a.institution?.toLowerCase().includes(q) || a.ticker?.toLowerCase().includes(q))
        && (filterType === 'all' || a.type === filterType);
    });
    list.sort((a, b) => {
      let va = a[sortBy] ?? 0, vb = b[sortBy] ?? 0;
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [assets, search, filterType, sortBy, sortDir]);

  // Portfolio type breakdown bar
  const byType = {};
  assets.forEach(a => { byType[a.type] = (byType[a.type] || 0) + a.value; });
  const typeBreakdown = Object.entries(byType).sort((a, b) => b[1] - a[1]);

  const SortIcon = ({ col }) => sortBy === col
    ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
    : <ArrowUpDown size={10} className="opacity-40" />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Asset Vault</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Total portfolio:{' '}
            <span className="font-mono-num font-bold" style={{ color: 'var(--accent-green)' }}>
              ₹{totalWorth.toLocaleString('en-IN')}
            </span>
            {' '}· {assets.length} assets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSync} disabled={syncing} className="btn btn-ghost">
            <Activity size={14} className={syncing ? 'animate-pulse' : ''} style={{ color: syncing ? 'var(--accent-green)' : undefined }} />
            {syncing ? 'Syncing...' : 'Sync Market'}
          </button>
          <button onClick={() => setShowDrawer(true)} className="btn btn-primary">
            <Plus size={16} />
            Add Asset
          </button>
        </div>
      </div>

      {/* Portfolio breakdown bar */}
      {typeBreakdown.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Portfolio Breakdown</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden flex gap-px">
            {typeBreakdown.map(([type, val]) => (
              <div key={type}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                style={{ width: `${(val / totalWorth * 100).toFixed(1)}%`, background: TYPE_COLORS[type] || '#64748B', minWidth: 4 }}
                title={`${type}: ₹${(val / 100000).toFixed(1)}L`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
            {typeBreakdown.map(([type, val]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[type] }} />
                <span className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
                  {type.replace('_', ' ')} <span className="font-mono-num" style={{ color: 'var(--text-secondary)' }}>{(val / totalWorth * 100).toFixed(0)}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input-field pl-9" placeholder="Search by name, institution, ticker..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-field" style={{ width: 'auto', minWidth: 150 }}>
          <option value="all">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {t.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Institution</th>
              <th className="cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('type')}>
                <span className="flex items-center gap-1">Type <SortIcon col="type" /></span>
              </th>
              <th>Ticker</th>
              <th className="cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('value')}>
                <span className="flex items-center gap-1">Value <SortIcon col="value" /></span>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((a, i) => (
                <motion.tr key={a._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0" style={{ background: `${TYPE_COLORS[a.type]}18`, fontSize: '16px' }}>
                        {TYPE_ICONS[a.type]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{a.name}</div>
                        {a.notes && <div className="text-xs truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>{a.notes}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a.institution || '—'}</td>
                  <td>
                    <span className="text-xs px-2 py-1 rounded-lg capitalize font-medium" style={{ background: `${TYPE_COLORS[a.type]}18`, color: TYPE_COLORS[a.type] }}>
                      {a.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {a.ticker
                      ? <span className="badge badge-live font-mono-num">{a.ticker} · {a.quantity}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>
                    }
                  </td>
                  <td>
                    {editingId === a._id && !a.ticker ? (
                      <div className="flex items-center gap-2">
                        <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus
                          className="input-field font-mono-num text-sm w-32 py-1" style={{ color: 'var(--accent-green)' }} />
                        <button onClick={() => saveEdit(a._id)} className="btn btn-success p-1.5"><Check size={12} /></button>
                        <button onClick={() => setEditingId(null)} className="btn btn-ghost p-1.5"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group/val"
                        onClick={() => !a.ticker && (setEditingId(a._id), setEditValue(a.value.toString()))}
                        style={{ cursor: a.ticker ? 'default' : 'pointer' }}>
                        <span className="font-mono-num font-bold text-sm" style={{ color: 'var(--accent-green)' }}>
                          ₹{a.value.toLocaleString('en-IN')}
                        </span>
                        {!a.ticker && <Edit3 size={12} className="opacity-0 group-hover/val:opacity-50 transition-opacity" style={{ color: 'var(--text-muted)' }} />}
                      </div>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(a._id, a.name)} className="btn btn-ghost p-1.5 group/del">
                      <Trash2 size={14} className="transition-colors" style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3" style={{ color: 'var(--text-muted)' }}>
            <Search size={28} className="opacity-30" />
            <p className="text-sm">{search || filterType !== 'all' ? 'No assets match your filters' : 'Your vault is empty'}</p>
            {!search && <button onClick={() => setShowDrawer(true)} className="btn btn-primary mt-1"><Plus size={14} /> Add First Asset</button>}
          </div>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {showDrawer && <AddAssetDrawer onClose={() => setShowDrawer(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </div>
  );
}
