import { useState } from 'react';
import { useData } from '../DataContext';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, Bell, Calendar, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeadManSwitch() {
  const { profile, setProfile, checkIn, beneficiaries } = useData();

  const daysSinceCheckIn = Math.floor((Date.now() - new Date(profile.lastCheckIn).getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = profile.deadManSwitchDays - daysSinceCheckIn;
  const progressPercent = Math.min((daysSinceCheckIn / profile.deadManSwitchDays) * 100, 100);
  const isWarning = daysRemaining <= 30 && daysRemaining > 7;
  const isCritical = daysRemaining <= 7;

  const handleCheckIn = () => {
    checkIn();
    toast.success('✅ Check-in recorded! Timer has been reset.');
  };

  const updateThreshold = (days) => {
    setProfile(prev => ({ ...prev, deadManSwitchDays: Number(days) }));
  };

  const updateExecutor = (email) => {
    setProfile(prev => ({ ...prev, executorEmail: email }));
  };

  const toggleSwitch = () => {
    setProfile(prev => ({ ...prev, switchEnabled: !prev.switchEnabled }));
    toast.success(profile.switchEnabled ? 'Switch disabled' : 'Switch enabled');
  };

  const statusColor = isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-green-400';
  const statusBg = isCritical ? 'from-red-500/20 to-red-600/10' : isWarning ? 'from-amber-500/20 to-amber-600/10' : 'from-green-500/20 to-green-600/10';
  const progressColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dead Man's Switch</h1>
      <p className="text-slate-400 mb-8">Automated protection ensures your plan activates when it matters most</p>

      {/* Main Status Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`glass-card rounded-2xl p-8 mb-6 bg-gradient-to-br ${statusBg}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isCritical ? 'from-red-500 to-red-700' : isWarning ? 'from-amber-500 to-amber-700' : 'from-green-500 to-green-700'} flex items-center justify-center shadow-lg`}>
              {isCritical ? <AlertTriangle size={28} /> : <ShieldCheck size={28} />}
            </div>
            <div>
              <div className={`text-2xl font-bold ${statusColor}`}>
                {!profile.switchEnabled ? '⏸ PAUSED' : isCritical ? '⚠️ CRITICAL' : isWarning ? '⚡ WARNING' : '✅ ACTIVE & SAFE'}
              </div>
              <div className="text-slate-400">
                {!profile.switchEnabled ? 'Switch is currently disabled' :
                  daysRemaining > 0
                    ? `${daysRemaining} days until switch activates`
                    : 'Switch has been triggered!'}
              </div>
            </div>
          </div>
          <button onClick={handleCheckIn}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2">
            <CheckCircle size={20} /> Check In Now
          </button>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Last check-in: {daysSinceCheckIn} day{daysSinceCheckIn !== 1 ? 's' : ''} ago</span>
            <span className="text-slate-400">Threshold: {profile.deadManSwitchDays} days</span>
          </div>
          <div className="h-3 bg-[#1a1f35] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${progressColor}, ${progressColor}88)` }}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Configuration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-indigo-400" /> Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Inactivity threshold (days)</label>
              <input type="number" value={profile.deadManSwitchDays}
                onChange={e => updateThreshold(e.target.value)}
                className="w-full p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white focus:border-indigo-500/50 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Executor email</label>
              <input type="email" value={profile.executorEmail}
                onChange={e => updateExecutor(e.target.value)}
                className="w-full p-3 bg-[#0b1120] rounded-lg border border-[#1e293b] text-white focus:border-indigo-500/50 focus:outline-none transition-colors" />
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0b1120] rounded-lg border border-[#1e293b]">
              <span className="text-sm">Switch enabled</span>
              <button onClick={toggleSwitch}
                className={`w-12 h-6 rounded-full transition-colors relative ${profile.switchEnabled ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${profile.switchEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Activation Sequence */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Bell size={18} className="text-amber-400" /> Activation Sequence</h3>
          <div className="space-y-3">
            {[
              { pct: 67, action: 'Email reminder sent to you' },
              { pct: 83, action: 'SMS + Email warning to you' },
              { pct: 94, action: 'Final warning with countdown' },
              { pct: 100, action: `Executor (${profile.executorEmail?.split('@')[0] || '...'}) notified` },
              { pct: 101, action: `Letters emailed to ${beneficiaries.length} beneficiaries` },
            ].map((step, i) => {
              const dayTrigger = Math.round(profile.deadManSwitchDays * step.pct / 100);
              const triggered = daysSinceCheckIn >= dayTrigger;
              return (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${triggered ? 'bg-red-500/10' : 'bg-[#0b1120]'}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${triggered ? 'bg-red-400' : 'bg-slate-600'}`} />
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-indigo-400">Day {dayTrigger}</span>
                    <div className="text-sm">{step.action}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Check-in History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar size={18} className="text-green-400" /> Check-in History</h3>
          <div className="space-y-2">
            {(profile.checkInHistory || []).slice(0, 8).map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-[#0b1120] rounded-lg">
                <div>
                  <div className="text-sm font-medium">{new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div className="text-xs text-slate-500">{new Date(h.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">{h.method}</span>
              </div>
            ))}
            {(!profile.checkInHistory || profile.checkInHistory.length === 0) && (
              <p className="text-sm text-slate-500 text-center py-4">No check-ins recorded yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
