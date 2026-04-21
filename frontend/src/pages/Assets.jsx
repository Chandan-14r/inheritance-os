import { useState } from 'react';
import { useData } from '../DataContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, Search, Edit3, X, Check, Activity, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPES = ['bank', 'stocks', 'mutual_fund', 'crypto', 'real_estate', 'insurance', 'ppf', 'nps', 'gold', 'fd', 'other'];
const TYPE_ICONS = {
  bank: '🏦', stocks: '📈', mutual_fund: '📊', crypto: '₿', real_estate: '🏠',
  insurance: '🛡️', ppf: '🏛️', nps: '📋', gold: '🥇', fd: '🏧', other: '📦'
};
const TYPE_COLORS = {
  bank: 'from-blue-500/20 to-blue-600/10', stocks: 'from-green-500/20 to-green-600/10',
  mutual_fund: 'from-purple-500/20 to-purple-600/10', crypto: 'from-amber-500/20 to-amber-600/10',
  real_estate: 'from-rose-500/20 to-rose-600/10', insurance: 'from-cyan-500/20 to-cyan-600/10',
  ppf: 'from-indigo-500/20 to-indigo-600/10', nps: 'from-teal-500/20 to-teal-600/10',
  gold: 'from-yellow-500/20 to-yellow-600/10', fd: 'from-slate-500/20 to-slate-600/10',
  other: 'from-gray-500/20 to-gray-600/10',
};

export default function Assets() {
  const { assets, addAsset, deleteAsset, updateAsset, totalWorth, syncMarketData } = useData();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [form, setForm] = useState({ type: 'bank', name: '', institution: '', value: '', ticker: '', quantity: '', notes: '' });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.value) { toast.error('Name and value are required'); return; }
    
    // Add logic to save quantity/ticker
    const assetPayload = { 
        ...form, 
        value: Number(form.value),
        quantity: form.quantity ? Number(form.quantity) : null,
        ticker: form.ticker || undefined,
    };

    const success = await addAsset(assetPayload);
    if (success) {
      toast.success(`${form.name} added to your vault`);
      setForm({ type: 'bank', name: '', institution: '', value: '', ticker: '', quantity: '', notes: '' });
      setShowForm(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    await syncMarketData();
    setSyncing(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}" from your vault?`)) {
      deleteAsset(id);
      toast.success('Asset removed');
    }
  };

  const startEditValue = (id, currentValue) => {
    setEditingId(id);
    setEditValue(currentValue.toString());
  };

  const saveEditValue = (id) => {
    updateAsset(id, { value: Number(editValue) });
    setEditingId(null);
    toast.success('Value updated');
  };

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.institution?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || a.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Digital Asset Vault</h1>
          <p className="text-slate-400 mt-1">Total portfolio: <span className="text-green-400 font-bold">₹{totalWorth.toLocaleString('en-IN')}</span> across {assets.length} assets</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
            <button onClick={handleSync} disabled={syncing}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0b1120] border border-indigo-500/30 rounded-xl text-sm text-indigo-400 hover:bg-indigo-500/10 transition-colors disabled:opacity-50">
                <Activity size={16} className={syncing ? 'animate-pulse text-green-400' : ''} /> 
                {syncing ? 'Syncing...' : 'Sync Live Market API'}
            </button>
            <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25">
            <Plus size={18} />{showForm ? 'Cancel' : 'Add Asset'}
            </button>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white placeholder-slate-500 text-sm focus:border-indigo-500/50 focus:outline-none transition-colors" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="px-4 py-2.5 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white text-sm">
          <option value="all">All types</option>
          {TYPES.map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {t.replace('_', ' ')}</option>)}
        </select>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={submit} className="glass-card p-6 rounded-2xl mb-6 flex flex-col gap-4">
            
            <div className="grid grid-cols-2 gap-4">
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white text-sm">
                {TYPES.map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {t.replace('_', ' ')}</option>)}
                </select>
                <input required placeholder="Asset name (e.g. HDFC Savings, Apple Shares)" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white placeholder-slate-500 text-sm focus:border-indigo-500/50 focus:outline-none transition-colors" />
                
                <input placeholder="Institution / Platform" value={form.institution}
                onChange={e => setForm({ ...form, institution: e.target.value })}
                className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white placeholder-slate-500 text-sm focus:border-indigo-500/50 focus:outline-none transition-colors" />
                
                <input required type="number" placeholder="Total Value (₹ in INR)" value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
                className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white placeholder-slate-500 text-sm focus:border-indigo-500/50 focus:outline-none transition-colors" />
            </div>

            {['stocks', 'crypto', 'mutual_fund'].includes(form.type) && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-4 p-4 border border-indigo-500/30 rounded-xl bg-indigo-500/10">
                    <div className="col-span-2 text-xs text-indigo-400 font-semibold mb-1 flex items-center gap-1"><ScanLine size={14} /> LIVE MARKET TRACKING</div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Ticker / Symbol</label>
                      <input type="text" placeholder="e.g. AAPL, BTC-USD, RELIANCE.NS" value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white text-sm focus:border-indigo-500 font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Quantity Built To Derive Value automatically</label>
                      <input type="number" step="0.0001" placeholder="e.g. 5.5 shares" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                        className="w-full p-2.5 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white text-sm focus:border-indigo-500" />
                    </div>
                  </motion.div>
            )}

            <textarea placeholder="Notes — story behind this asset, account numbers, etc." value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white placeholder-slate-500 text-sm focus:border-indigo-500/50 focus:outline-none transition-colors" rows={2} />
            <button className="w-full p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg font-semibold transition-all text-sm">
              Save Asset to Vault
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((a, i) => (
          <motion.div key={a._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className={`glass-card p-5 rounded-2xl bg-gradient-to-br ${TYPE_COLORS[a.type] || ''} group`}>
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{TYPE_ICONS[a.type]}</span>
                  <span className="text-xs text-indigo-400 uppercase font-semibold tracking-wider">{a.type.replace('_', ' ')}</span>
                  {a.ticker && <span className="ml-2 px-2 border border-green-500/30 bg-green-500/10 text-green-400 text-[10px] rounded flex items-center font-mono">LIVE API</span>}
                </div>
                <div className="text-lg font-bold">{a.name}</div>
                <div className="text-slate-400 text-sm">{a.institution} {a.ticker && <span className='font-mono'>({a.ticker} • {a.quantity} QTY)</span>}</div>
              </div>
              <button onClick={() => handleDelete(a._id, a.name)}
                className="text-red-400/40 hover:text-red-400 transition-colors h-fit p-1 opacity-0 group-hover:opacity-100">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              {editingId === a._id && !a.ticker ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold">₹</span>
                  <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)}
                    className="bg-[#0b1120] border border-indigo-500 rounded px-2 py-1 text-lg font-bold text-green-400 w-40 focus:outline-none" autoFocus />
                  <button onClick={() => saveEditValue(a._id)} className="text-green-400 hover:text-green-300"><Check size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-300"><X size={16} /></button>
                </div>
              ) : (
                <div className="text-2xl font-bold text-green-400 cursor-pointer hover:text-green-300 transition-colors flex items-center gap-2"
                  onClick={() => !a.ticker && startEditValue(a._id, a.value)}>
                  ₹{a.value.toLocaleString('en-IN')}
                  {!a.ticker && <Edit3 size={14} className="opacity-0 group-hover:opacity-50" />}
                </div>
              )}
            </div>
            {a.notes && <p className="text-sm text-slate-400 mt-2 italic opacity-75">"{a.notes}"</p>}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && !showForm && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-lg text-slate-400 mb-2">{search || filterType !== 'all' ? 'No assets match your filters' : 'Your vault is empty'}</p>
          <button onClick={() => setShowForm(true)} className="text-indigo-400 hover:text-indigo-300 transition-colors">+ Add your first asset</button>
        </div>
      )}
    </div>
  );
}
