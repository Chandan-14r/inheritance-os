import { useData } from '../DataContext';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, Bell, Calendar, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeadManSwitch() {
  const { profile, setProfile, checkIn, beneficiaries } = useData();

  const daysSince = Math.floor((Date.now() - new Date(profile.lastCheckIn).getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = profile.deadManSwitchDays - daysSince;
  const progress = Math.min((daysSince / profile.deadManSwitchDays) * 100, 100);
  const isWarning = daysLeft <= 30 && daysLeft > 7;
  const isCritical = daysLeft <= 7;

  const handleCheckIn = () => {
    checkIn();
    toast.success('✓ Checked in! Timer reset.');
  };

  const progressColor = isCritical ? '#F6465D' : isWarning ? '#F59E0B' : '#00C48C';
  const statusLabel = !profile.switchEnabled ? 'PAUSED' : isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'ACTIVE';
  const statusColor = !profile.switchEnabled ? 'var(--text-muted)' : isCritical ? 'var(--accent-red)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-green)';

  const TIMELINE = [
    { pct: 67, icon: Bell, action: 'Email reminder sent to you' },
    { pct: 83, icon: AlertTriangle, action: 'SMS + Email warning to you' },
    { pct: 94, icon: Zap, action: 'Final countdown warning' },
    { pct: 100, icon: CheckCircle, action: `Executor (${profile.executorEmail?.split('@')[0] || '…'}) notified` },
    { pct: 101, icon: ShieldCheck, action: `Letters sent to ${beneficiaries.length} beneficiaries` },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dead Man's Switch</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Automated protection that activates when your family needs it most</p>
        </div>
        <button onClick={handleCheckIn} className="btn btn-primary py-3 px-6">
          <CheckCircle size={16} /> Check In Now
        </button>
      </div>

      {/* Status hero card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="card p-7"
        style={{ border: `1px solid ${progressColor}30`, background: `${progressColor}08` }}>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${progressColor}20`, border: `1px solid ${progressColor}30` }}>
              {isCritical ? <AlertTriangle size={24} style={{ color: progressColor }} /> : <ShieldCheck size={24} style={{ color: progressColor }} />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="status-dot" style={{ background: progressColor, boxShadow: `0 0 6px ${progressColor}` }} />
                <span className="text-lg font-bold font-mono-num" style={{ color: statusColor }}>{statusLabel}</span>
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {!profile.switchEnabled
                  ? 'Switch is paused'
                  : daysLeft > 0
                  ? `${daysLeft} days until switch activates`
                  : '⚠️ Switch has been triggered!'
                }
              </div>
            </div>
          </div>

          {/* Enabled toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Switch</span>
            <button
              onClick={() => { setProfile(p => ({ ...p, switchEnabled: !p.switchEnabled })); toast.success(profile.switchEnabled ? 'Switch paused' : 'Switch activated'); }}
              className="toggle"
              style={{ background: profile.switchEnabled ? 'var(--accent-green)' : 'var(--bg-elevated)' }}
            >
              <div className="toggle-thumb" style={{ transform: `translateX(${profile.switchEnabled ? 20 : 2}px)` }} />
            </button>
            <span className="text-sm font-semibold" style={{ color: profile.switchEnabled ? 'var(--accent-green)' : 'var(--text-muted)' }}>
              {profile.switchEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>Last check-in: {daysSince}d ago</span>
            <span>Threshold: {profile.deadManSwitchDays} days</span>
          </div>
          <div className="progress-track">
            <motion.div className="progress-fill"
              initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ background: `linear-gradient(90deg, ${progressColor}, ${progressColor}AA)` }} />
          </div>
          <div className="flex justify-between mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Day 0</span>
            <span>Day {profile.deadManSwitchDays}</span>
          </div>
        </div>
      </motion.div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-5">
        {/* Config */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Clock size={16} style={{ color: '#818CF8' }} /> Configuration
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Inactivity Threshold (days)</label>
              <input type="number" className="input-field font-mono-num"
                value={profile.deadManSwitchDays}
                onChange={e => setProfile(p => ({ ...p, deadManSwitchDays: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Executor Email</label>
              <input type="email" className="input-field" placeholder="executor@example.com"
                value={profile.executorEmail || ''}
                onChange={e => setProfile(p => ({ ...p, executorEmail: e.target.value }))} />
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(75,110,245,0.06)', border: '1px solid rgba(75,110,245,0.12)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Time since last check-in</div>
            <div className="text-3xl font-bold font-mono-num" style={{ color: progressColor }}>{daysSince}d</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{daysLeft > 0 ? `${daysLeft} days remaining` : 'Threshold exceeded'}</div>
          </div>
        </motion.div>

        {/* Activation Sequence */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Bell size={16} style={{ color: 'var(--accent-amber)' }} /> Activation Sequence
          </h3>
          <div className="space-y-2 relative">
            {/* Connecting line */}
            <div className="absolute left-4 top-5 bottom-5 w-0.5" style={{ background: 'var(--border)' }} />
            {TIMELINE.map((step, i) => {
              const dayTrigger = Math.round(profile.deadManSwitchDays * step.pct / 100);
              const triggered = daysSince >= dayTrigger;
              return (
                <div key={i} className="flex items-start gap-3 relative pl-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                    style={triggered
                      ? { background: '#F6465D20', border: '1px solid #F6465D50' }
                      : { background: 'var(--bg-elevated)', border: '1px solid var(--border)' }
                    }>
                    <step.icon size={11} style={{ color: triggered ? 'var(--accent-red)' : 'var(--text-muted)' }} />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="text-xs font-bold font-mono-num mb-0.5" style={{ color: triggered ? 'var(--accent-red)' : '#818CF8' }}>
                      Day {dayTrigger}
                    </div>
                    <div className="text-xs" style={{ color: triggered ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.action}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Check-in History */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Calendar size={16} style={{ color: 'var(--accent-green)' }} /> Check-in History
          </h3>
          <div className="space-y-2">
            {(profile.checkInHistory || []).slice(0, 8).map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(h.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className="badge badge-green">{h.method || 'manual'}</span>
              </div>
            ))}
            {(!profile.checkInHistory?.length) && (
              <div className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No check-ins recorded yet</p>
                <p className="text-xs mt-1">Click "Check In Now" above to start</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
