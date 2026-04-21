import { useData } from '../DataContext';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

function PersonCard({ person, gradient, delay = 0, tag }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="glass-card rounded-2xl p-5 text-center relative group"
    >
      {tag && <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-indigo-600 rounded-full text-xs font-bold z-10">{tag}</div>}
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow-lg`}>
        {person.name[0]}
      </div>
      <div className="font-bold text-lg">{person.name}</div>
      <div className="text-slate-400 text-sm">{person.role}</div>
      {person.allocation > 0 && (
        <div className="mt-2 inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold">
          {person.allocation}% inheritance
        </div>
      )}
      {person.allocation === 0 && (
        <div className="mt-2 inline-block px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 text-sm">
          No allocation
        </div>
      )}
      {person.email && <div className="text-xs text-slate-500 mt-1">{person.email}</div>}
      {person.letterReady && <div className="text-xs text-green-400 mt-1">✉️ Letter ready</div>}
    </motion.div>
  );
}

function ConnectorLine() {
  return (
    <div className="flex justify-center py-2">
      <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-500/50 to-transparent" />
    </div>
  );
}

const GRADIENTS = [
  'from-indigo-500 to-purple-500', 'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500', 'from-amber-500 to-orange-500',
  'from-green-500 to-emerald-500', 'from-violet-500 to-purple-500',
];

export default function FamilyTree() {
  const { beneficiaries, profile, totalWorth } = useData();
  const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;

  // Build family tree from actual beneficiary data
  const spouse = beneficiaries.filter(b => b.relationship === 'Spouse');
  const children = beneficiaries.filter(b => ['Son', 'Daughter'].includes(b.relationship));
  const parents = beneficiaries.filter(b => ['Father', 'Mother'].includes(b.relationship));
  const others = beneficiaries.filter(b => !['Spouse', 'Son', 'Daughter', 'Father', 'Mother'].includes(b.relationship));

  const mapPerson = (b, i) => ({
    name: b.name,
    role: b.relationship,
    allocation: b.allocationPercent,
    email: b.email,
    letterReady: !!b.aiLetter,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Family Tree</h1>
      <p className="text-slate-400 mb-8">Your family structure and inheritance flow built from your actual beneficiary data</p>

      <div className="relative">
        {/* Parents Generation */}
        {parents.length > 0 && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-800" />
                <span>Parents</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <div className={`grid grid-cols-${Math.min(parents.length, 3)} gap-4 max-w-lg mx-auto`}>
                {parents.map((p, i) => (
                  <PersonCard key={p._id} person={mapPerson(p)} gradient={GRADIENTS[(i + 4) % GRADIENTS.length]} delay={0.1 + i * 0.1} />
                ))}
              </div>
            </motion.div>
            <ConnectorLine />
          </>
        )}

        {/* Self + Spouse */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-800" />
            <span>You {spouse.length > 0 ? '& Spouse' : ''}</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>
          <div className={`grid ${spouse.length > 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-6 max-w-xl mx-auto`}>
            <div className="relative">
              <PersonCard
                person={{ name: profile.name, role: 'Account Holder', allocation: 0, email: profile.email }}
                gradient="from-indigo-500 to-purple-500"
                delay={0.3}
                tag="YOU"
              />
            </div>
            {spouse.map((s, i) => (
              <div key={s._id} className="relative">
                <PersonCard person={mapPerson(s)} gradient="from-pink-500 to-rose-500" delay={0.4} />
                <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
                  <Heart size={16} className="text-pink-400 animate-pulse" fill="currentColor" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Children */}
        {children.length > 0 && (
          <>
            <ConnectorLine />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-800" />
                <span>Children</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <div className={`grid grid-cols-${Math.min(children.length, 3)} gap-6 max-w-xl mx-auto`}>
                {children.map((c, i) => (
                  <PersonCard key={c._id} person={mapPerson(c)} gradient={GRADIENTS[(i + 2) % GRADIENTS.length]} delay={0.5 + i * 0.15} />
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Others */}
        {others.length > 0 && (
          <>
            <ConnectorLine />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-800" />
                <span>Other Beneficiaries</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <div className={`grid grid-cols-${Math.min(others.length, 3)} gap-4 max-w-xl mx-auto`}>
                {others.map((o, i) => (
                  <PersonCard key={o._id} person={mapPerson(o)} gradient={GRADIENTS[(i + 3) % GRADIENTS.length]} delay={0.7 + i * 0.1} />
                ))}
              </div>
            </motion.div>
          </>
        )}

        {beneficiaries.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-400 mt-4">
            <p className="text-lg">Add beneficiaries to see your family tree</p>
          </div>
        )}
      </div>

      {/* Inheritance Flow Summary */}
      {beneficiaries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="glass-card rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-bold mb-3">Inheritance Flow Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            {beneficiaries.map((b, i) => (
              <div key={b._id} className="flex items-center gap-3 p-3 bg-[#0b1120] rounded-xl">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center font-bold text-sm shrink-0`}>
                  {b.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{b.name}</div>
                  <div className="text-xs text-slate-400">{b.relationship}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <ArrowRight size={14} className="text-indigo-400" />
                  <div className="text-right">
                    <div className="text-lg font-bold text-indigo-400">{b.allocationPercent}%</div>
                    <div className="text-xs text-slate-500">{fmt(totalWorth * b.allocationPercent / 100)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
