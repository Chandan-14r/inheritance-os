import { useState } from 'react';
import { useData } from '../DataContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RELATIONSHIPS = ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 'Other'];
const BCOLORS = ['#4B6EF5', '#00C48C', '#F59E0B', '#F6465D', '#8B5CF6', '#06B6D4'];

export default function Beneficiaries() {
  const { beneficiaries, addBeneficiary, deleteBeneficiary, totalWorth, totalAllocation } = useData();
  const [form, setForm] = useState({ name: '', relationship: '', email: '', phone: '', allocationPercent: '' });
  const [show, setShow] = useState(false);

  const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;

  const submit = (e) => {
    e.preventDefault();
    const pct = Number(form.allocationPercent);
    if (totalAllocation + pct > 100) { toast.error(`Only ${100 - totalAllocation}% remaining`); return; }
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

  const remaining = 100 - totalAllocation;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Beneficiaries</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage inheritance of your{' '}
            <span className="font-mono-num font-bold" style={{ color: 'var(--accent-green)' }}>
              ₹{totalWorth.toLocaleString('en-IN')}
            </span>{' '}
            estate
          </p>
        </div>
        <button onClick={() => setShow(v => !v)} className={`btn ${show ? 'btn-ghost' : 'btn-primary'}`}>
          <Plus size={16} className={show ? 'rotate-45 transition-transform' : ''} />
          {show ? 'Cancel' : 'Add Beneficiary'}
        </button>
      </div>

      {/* Allocation overview card */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Estate Allocation</span>
          <span className="font-mono-num text-sm font-bold" style={{ color: totalAllocation === 100 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
            {totalAllocation}/100%
          </span>
        </div>

        {/* Stacked bar */}
        <div className="h-3 rounded-full overflow-hidden flex gap-px mb-3"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          {beneficiaries.map((b, i) => (
            <motion.div key={b._id}
              initial={{ width: 0 }} animate={{ width: `${b.allocationPercent}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="h-full"
              style={{ background: BCOLORS[i % BCOLORS.length], minWidth: 4 }}
              title={`${b.name}: ${b.allocationPercent}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {beneficiaries.map((b, i) => (
            <div key={b._id} className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ background: BCOLORS[i % BCOLORS.length] }} />
              <span style={{ color: 'var(--text-secondary)' }}>{b.name}</span>
              <span className="font-mono-num" style={{ color: BCOLORS[i % BCOLORS.length] }}>{b.allocationPercent}%</span>
              <span style={{ color: 'var(--text-muted)' }}>= {fmt(totalWorth * b.allocationPercent / 100)}</span>
            </div>
          ))}
          {remaining > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-muted)' }}>Unallocated: {remaining}%</span>
            </div>
          )}
        </div>

        {totalAllocation === 100 && (
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--accent-green)' }}>
            ✓ Fully allocated — great!
          </div>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {show && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={submit} className="card p-6"
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>New Beneficiary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
                <input required className="input-field" placeholder="Priya Sharma" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Relationship *</label>
                <select required className="input-field" value={form.relationship}
                  onChange={e => setForm({ ...form, relationship: e.target.value })}>
                  <option value="">Select...</option>
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address</label>
                <input type="email" className="input-field" placeholder="priya@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Allocation % (max {remaining}%) *</label>
                <input required type="number" min="1" max={remaining} className="input-field font-mono-num"
                  placeholder={`e.g. ${remaining}`} value={form.allocationPercent}
                  onChange={e => setForm({ ...form, allocationPercent: e.target.value })} />
              </div>
              <button type="submit" className="col-span-2 btn btn-primary py-3">
                Add Beneficiary
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Beneficiary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {beneficiaries.map((b, i) => {
            const color = BCOLORS[i % BCOLORS.length];
            const inheritance = totalWorth * b.allocationPercent / 100;
            return (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06 }}
                className="card card-hover p-6 group relative"
              >
                <button
                  onClick={() => handleDelete(b._id, b.name)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity btn btn-ghost p-1.5"
                  style={{ color: 'var(--accent-red)' }}
                >
                  <Trash2 size={14} />
                </button>

                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-4" style={{ background: color }}>
                  {b.name[0]}
                </div>

                <div className="font-bold text-lg mb-0.5" style={{ color: 'var(--text-primary)' }}>{b.name}</div>
                <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{b.relationship}</div>
                <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{b.email || '—'}</div>

                {/* Allocation */}
                <div className="p-3 rounded-xl" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                  <div className="text-3xl font-bold font-mono-num mb-0.5" style={{ color }}>
                    {b.allocationPercent}%
                  </div>
                  <div className="text-xs font-mono-num" style={{ color: 'var(--text-muted)' }}>
                    ≈ {fmt(inheritance)} · {(inheritance / 10000000).toFixed(2)}Cr
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: b.aiLetter ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                  {b.aiLetter ? '✉ AI Letter Ready' : '○ No letter yet'}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {beneficiaries.length === 0 && !show && (
        <div className="card p-16 text-center">
          <UserCircle size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
          <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No beneficiaries yet</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Add family members who will inherit your estate</p>
          <button onClick={() => setShow(true)} className="btn btn-primary">
            <Plus size={16} /> Add First Beneficiary
          </button>
        </div>
      )}
    </div>
  );
}
