import { useState, useEffect, useRef } from 'react';
import { useData } from '../DataContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Download, Copy, Check } from 'lucide-react';

function TypewriterText({ text, speed = 12 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div ref={ref} className="max-h-[500px] overflow-y-auto">
      <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
        {displayed}
        {!done && <span className="animate-pulse text-indigo-600">|</span>}
      </div>
    </div>
  );
}

export default function Letters() {
  const { beneficiaries, generateLetter, totalWorth } = useData();
  const [selectedId, setSelectedId] = useState(null);
  const [personalMsg, setPersonalMsg] = useState('');
  const [tone, setTone] = useState('heartfelt');
  const [loading, setLoading] = useState(false);
  const [letterKey, setLetterKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const selected = beneficiaries.find(b => b._id === selectedId);
  const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;

  const generate = async () => {
    if (!selected) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    generateLetter(selected._id, tone, personalMsg);
    setLetterKey(prev => prev + 1);
    toast.success('Letter crafted with your real data ✨');
    setLoading(false);
  };

  const copyLetter = () => {
    if (!selected?.aiLetter) return;
    navigator.clipboard.writeText(selected.aiLetter);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    if (!selected?.aiLetter) return;
    const blob = new Blob([selected.aiLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `letter-to-${selected.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Letter downloaded');
  };

  const allGenerated = beneficiaries.length > 0 && beneficiaries.every(b => b.aiLetter);

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI-Generated Last Letters</h1>
          <p className="text-slate-400 mt-1">Each letter uses your real assets (₹{(totalWorth / 100000).toFixed(0)}L), beneficiaries, and personal data</p>
        </div>
        {allGenerated && (
          <div className="glass px-4 py-2 rounded-xl text-green-400 text-sm font-semibold">
            ✅ All {beneficiaries.length} letters generated
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="font-semibold mb-3 text-slate-300">Select Recipient</h3>
          {beneficiaries.map(b => (
            <button key={b._id} onClick={() => { setSelectedId(b._id); setLetterKey(prev => prev + 1); }}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                selectedId === b._id
                  ? 'bg-indigo-600 shadow-lg shadow-indigo-500/25'
                  : 'glass-card'
              }`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-sm opacity-75">{b.relationship} • {b.allocationPercent}% • {fmt(totalWorth * b.allocationPercent / 100)}</div>
                </div>
                {b.aiLetter && <Check size={14} className="text-green-400 mt-1" />}
              </div>
            </button>
          ))}

          {beneficiaries.length === 0 && (
            <div className="glass-card p-6 rounded-xl text-center text-slate-400 text-sm">
              Add beneficiaries first to generate letters
            </div>
          )}
        </div>

        <div className="col-span-2">
          {selected ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-indigo-400" />
                <h2 className="text-xl font-bold">Letter to {selected.name}</h2>
                <span className="text-sm text-slate-400">({selected.relationship} — {selected.allocationPercent}% = {fmt(totalWorth * selected.allocationPercent / 100)})</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <select value={tone} onChange={e => setTone(e.target.value)}
                  className="p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white text-sm">
                  <option value="heartfelt">💝 Heartfelt & Emotional</option>
                  <option value="practical">📋 Practical & Direct</option>
                  <option value="philosophical">🌟 Philosophical</option>
                  <option value="humorous">😊 Lighthearted & Funny</option>
                </select>
                <button onClick={generate} disabled={loading}
                  className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg disabled:opacity-50 font-medium transition-all text-sm">
                  <Sparkles size={16} className={loading ? 'animate-spin' : ''} />
                  {loading ? 'Crafting letter...' : selected.aiLetter ? 'Regenerate Letter' : 'Generate Letter'}
                </button>
              </div>

              <textarea placeholder="Add a personal memory, inside joke, or message you want woven into the letter..."
                value={personalMsg} onChange={e => setPersonalMsg(e.target.value)}
                className="w-full p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white placeholder-slate-500 mb-4 h-20 text-sm focus:border-indigo-500/50 focus:outline-none transition-colors" />

              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="bg-gradient-to-br from-amber-50/95 to-orange-50/95 text-slate-900 p-8 rounded-xl shadow-xl text-center">
                    <div className="animate-pulse">
                      <Sparkles size={32} className="mx-auto mb-3 text-indigo-500" />
                      <p className="font-serif text-lg">Weaving your memories, assets & love into words...</p>
                      <p className="text-sm text-slate-500 mt-1">Using your actual portfolio of {fmt(totalWorth)} across {selected.allocationPercent}% allocation</p>
                    </div>
                  </motion.div>
                )}

                {selected.aiLetter && !loading && (
                  <motion.div key={`letter-${letterKey}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-gradient-to-br from-amber-50/95 to-orange-50/95 text-slate-900 p-8 rounded-xl shadow-xl">
                      <TypewriterText text={selected.aiLetter} speed={8} />
                    </div>
                    <div className="flex gap-2 mt-3 justify-end">
                      <button onClick={copyLetter}
                        className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:bg-white/10 transition-colors">
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button onClick={downloadPDF}
                        className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:bg-white/10 transition-colors">
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="glass-card p-12 rounded-2xl text-center text-slate-400">
              <Mail size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">Select a beneficiary to generate their personal letter</p>
              <p className="text-sm mt-2 text-slate-500">Letters are personalized using your actual assets, allocation percentages, and relationship data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
