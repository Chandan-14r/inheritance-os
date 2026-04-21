import { useState, useEffect, useRef } from 'react';
import { useData } from '../DataContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Download, Copy, Check, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';

function TypewriterText({ text, speed = 8 }) {
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
    <div ref={ref} className="max-h-[480px] overflow-y-auto pr-2">
      <div className="whitespace-pre-wrap font-serif text-base leading-loose" style={{ color: '#1E293B' }}>
        {displayed}
        {!done && <span className="animate-pulse" style={{ color: '#4B6EF5' }}>|</span>}
      </div>
    </div>
  );
}

const TONES = [
  { value: 'heartfelt', label: '💝 Heartfelt', desc: 'Warm & emotional' },
  { value: 'practical', label: '📋 Practical', desc: 'Direct & clear' },
  { value: 'philosophical', label: '🌟 Philosophical', desc: 'Deep & reflective' },
  { value: 'humorous', label: '😊 Lighthearted', desc: 'Fun & uplifting' },
];

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
  const allGenerated = beneficiaries.length > 0 && beneficiaries.every(b => b.aiLetter);

  const generate = async () => {
    if (!selected) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    generateLetter(selected._id, tone, personalMsg);
    setLetterKey(prev => prev + 1);
    toast.success('Letter crafted by Gemini AI ✨');
    setLoading(false);
  };

  const copyLetter = () => {
    if (!selected?.aiLetter) return;
    navigator.clipboard.writeText(selected.aiLetter);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadLetter = () => {
    if (!selected?.aiLetter) return;
    
    const doc = new jsPDF();
    
    // Add letterhead/title
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text(`A Letter to ${selected.name}`, 20, 20);
    
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    
    // Auto-wrap text at 170mm (A4 width is 210mm)
    const lines = doc.splitTextToSize(selected.aiLetter, 170); 
    let y = 35;
    
    for (let i = 0; i < lines.length; i++) {
        if (y > 280) {
            doc.addPage();
            y = 20; // reset Y on new page
        }
        doc.text(lines[i], 20, y);
        y += 7; // roughly 1.5 line height
    }

    doc.save(`letter-${selected.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    toast.success('Letter downloaded as PDF');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>AI-Generated Letters</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Powered by Gemini AI · using your real ₹{(totalWorth / 100000).toFixed(0)}L portfolio data
          </p>
        </div>
        {allGenerated && (
          <div className="badge badge-green">✓ All {beneficiaries.length} letters ready</div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Sidebar — Recipients */}
        <div className="space-y-2">
          <div className="section-label">Select Recipient</div>
          {beneficiaries.length === 0 && (
            <div className="card p-6 text-center">
              <Mail size={28} className="mx-auto mb-2 opacity-20" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add beneficiaries first</p>
            </div>
          )}
          {beneficiaries.map(b => (
            <button key={b._id}
              onClick={() => { setSelectedId(b._id); setLetterKey(k => k + 1); }}
              className="w-full p-4 rounded-xl text-left transition-all duration-200"
              style={selectedId === b._id
                ? { background: 'rgba(75,110,245,0.12)', border: '1px solid rgba(75,110,245,0.3)', borderRadius: 12 }
                : { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#4B6EF5,#7C3AED)' }}>
                    {b.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{b.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {b.relationship} · {b.allocationPercent}% · {fmt(totalWorth * b.allocationPercent / 100)}
                    </div>
                  </div>
                </div>
                {b.aiLetter
                  ? <Check size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                  : <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                }
              </div>
            </button>
          ))}
        </div>

        {/* Main — Letter Editor */}
        <div className="col-span-2">
          {selected ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Controls */}
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Mail size={16} style={{ color: '#818CF8' }} />
                  <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Letter to {selected.name}
                  </h2>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {selected.relationship} · {selected.allocationPercent}% = {fmt(totalWorth * selected.allocationPercent / 100)}
                  </span>
                </div>

                {/* Tone selector */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {TONES.map(t => (
                    <button key={t.value} type="button" onClick={() => setTone(t.value)}
                      className="py-2 px-3 rounded-xl text-left transition-all"
                      style={tone === t.value
                        ? { background: 'rgba(75,110,245,0.12)', border: '1px solid rgba(75,110,245,0.3)' }
                        : { background: 'var(--bg-primary)', border: '1px solid var(--border)' }
                      }
                    >
                      <div className="text-xs font-semibold" style={{ color: tone === t.value ? '#818CF8' : 'var(--text-primary)' }}>{t.label}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.desc}</div>
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  className="input-field resize-none mb-4"
                  placeholder="Add a personal memory, inside joke, or message to weave into the letter..."
                  value={personalMsg}
                  onChange={e => setPersonalMsg(e.target.value)}
                />

                <button onClick={generate} disabled={loading} className="btn btn-primary w-full py-3">
                  <Sparkles size={15} className={loading ? 'animate-spin' : ''} />
                  {loading ? 'Gemini is writing...' : selected.aiLetter ? 'Regenerate Letter' : 'Generate Letter with Gemini AI'}
                </button>
              </div>

              {/* Letter display */}
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="card p-12 text-center">
                    <Sparkles size={32} className="mx-auto mb-4 animate-pulse" style={{ color: '#818CF8' }} />
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Gemini AI is crafting your letter...</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Weaving in your {fmt(totalWorth)} portfolio & {selected.relationship.toLowerCase()} relationship
                    </p>
                  </motion.div>
                )}
                {selected.aiLetter && !loading && (
                  <motion.div key={`letter-${letterKey}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Letter on paper */}
                    <div className="rounded-2xl p-8 shadow-2xl" style={{ background: 'linear-gradient(135deg, #FFFBF0, #FFF8E7)', border: '1px solid #E8D5A3' }}>
                      <TypewriterText text={selected.aiLetter} speed={8} />
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2 mt-3 justify-end">
                      <button onClick={copyLetter} className="btn btn-ghost text-sm">
                        {copied ? <Check size={14} style={{ color: 'var(--accent-green)' }} /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button onClick={downloadLetter} className="btn btn-ghost text-sm">
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="card p-16 h-full flex flex-col items-center justify-center text-center">
              <Mail size={48} className="mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Select a beneficiary</p>
              <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
                Each letter is personalized using your actual assets, allocation percentages, and relationships
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
