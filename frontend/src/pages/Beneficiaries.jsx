import { useState } from 'react';
import { useData } from '../DataContext';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const GRADIENT_COLORS = [
  'from-indigo-500 to-purple-500', 'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500', 'from-amber-500 to-orange-500', 'from-green-500 to-emerald-500',
];

export default function Beneficiaries() {
  const { beneficiaries, addBeneficiary, deleteBeneficiary, totalWorth, totalAllocation } = useData();
  const [form, setForm] = useState({ name: '', relationship: '', email: '', phone: '', allocationPercent: '' });
  const [show, setShow] = useState(false);

  const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;

  const submit = (e) => {
    e.preventDefault();
    const pct = Number(form.allocationPercent);
    if (totalAllocation + pct > 100) {
      toast.error(`Only ${100 - totalAllocation}% remaining to allocate`);
      return;
    }
    if (pct <= 0) { toast.error('Allocation must be > 0%'); return; }
    if (!form.name) { toast.error('Name is required'); return; }
    addBeneficiary({ ...form, allocationPercent: pct });
    toast.success(`${form.name} added as beneficiary`);
    setForm({ name: '', relationship: '', email: '', phone: '', allocationPercent: '' });
    setShow(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove ${name} as a beneficiary?`)) {
      deleteBeneficiary(id);
      toast.success('Beneficiary removed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-bold">Beneficiaries</h1>
          <p className="text-slate-400 mt-1">Manage who inherits your ₹{totalWorth.toLocaleString('en-IN')} legacy</p>
        </div>
        <button onClick={() => setShow(!show)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25">
          <Plus size={18} />{show ? 'Cancel' : 'Add'}
        </button>
      </div>

      {/* Allocation bar */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-semibold ${totalAllocation === 100 ? 'text-green-400' : 'text-amber-400'}`}>
            {totalAllocation === 100 ? '✅ Fully allocated' : `⚠ ${totalAllocation}% allocated — ${100 - totalAllocation}% remaining`}
          </span>
          <span className="text-sm text-slate-400">{totalAllocation}/100%</span>
        </div>
        <div className="h-3 bg-[#151a2e] rounded-full overflow-hidden flex">
          {beneficiaries.map((b, i) => (
            <motion.div key={b._id}
              initial={{ width: 0 }} animate={{ width: `${b.allocationPercent}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`h-full bg-gradient-to-r ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]}`}
              title={`${b.name}: ${b.allocationPercent}%`}
            />
          ))}
          {totalAllocation < 100 && (
            <div className="h-full flex-1 bg-[#1a1f35]" title={`${100 - totalAllocation}% unallocated`} />
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {beneficiaries.map((b, i) => (
            <span key={b._id} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]}`} />
              {b.name} ({b.allocationPercent}% = {fmt(totalWorth * b.allocationPercent / 100)})
            </span>
          ))}
        </div>
      </div>

      {show && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={submit} className="glass-card p-6 rounded-2xl mb-6 grid grid-cols-2 gap-4">
          <input required placeholder="Full Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white placeholder-slate-500 text-sm focus:border-indigo-500/50 focus:outline-none transition-colors" />
          <select value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })}
            className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white text-sm" required>
            <option value="">Select relationship</option>
            <option value="Spouse">Spouse</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Other">Other</option>
          </select>
          <input type="email" placeholder="Email address" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white placeholder-slate-500 text-sm focus:border-indigo-500/50 focus:outline-none transition-colors" />
          <input required type="number" min="1" max={100 - totalAllocation}
            placeholder={`Allocation % (max ${100 - totalAllocation}%)`} value={form.allocationPercent}
            onChange={e => setForm({ ...form, allocationPercent: e.target.value })}
            className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white placeholder-slate-500 text-sm focus:border-indigo-500/50 focus:outline-none transition-colors" />
          <button className="col-span-2 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold transition-all text-sm">
            Add Beneficiary
          </button>
        </motion.form>
      )}

      <div className="grid grid-cols-3 gap-4">
        {beneficiaries.map((b, i) => (
          <motion.div key={b._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl group">
            <div className="flex justify-between">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} flex items-center justify-center text-2xl font-bold shadow-lg`}>
                {b.name[0]}
              </div>
              <button onClick={() => handleDelete(b._id, b.name)}
                className="text-red-400/50 hover:text-red-400 transition-colors h-fit opacity-0 group-hover:opacity-100">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="mt-4 text-xl font-bold">{b.name}</div>
            <div className="text-slate-400 text-sm">{b.relationship}</div>
            <div className="text-xs text-slate-500 mt-0.5">{b.email}</div>
            <div className="mt-4">
              <div className="text-3xl font-bold gradient-text">{b.allocationPercent}%</div>
              <div className="text-xs text-slate-500">≈ {fmt(totalWorth * b.allocationPercent / 100)}</div>
            </div>
            <div className="mt-2 text-xs">
              {b.aiLetter ? <span className="text-green-400">✉️ Letter generated</span> : <span className="text-slate-500">📝 No letter yet</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {beneficiaries.length === 0 && !show && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-lg text-slate-400 mb-2">No beneficiaries yet</p>
          <button onClick={() => setShow(true)} className="text-indigo-400 hover:text-indigo-300 transition-colors">+ Add your first beneficiary</button>
        </div>
      )}
    </div>
  );
}
