import React, { useState } from 'react';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const today = new Date().getDay(); // 0=Sun ... 6=Sat
const todayIdx = today === 0 ? 6 : today - 1;

function AdherenceTracker({ prescriptions }) {
  // For each prescription: array of 7 day statuses: null | 'taken' | 'missed'
  const [records, setRecords] = useState(() =>
    Object.fromEntries(
      prescriptions.map(p => [p.id, Array(7).fill(null).map((_, i) => i < todayIdx ? 'taken' : null)])
    )
  );

  // Sync when prescriptions change (new ones)
  const getRecord = (id) => records[id] || Array(7).fill(null);

  const toggle = (id, dayIdx) => {
    if (dayIdx > todayIdx) return; // can't mark future
    setRecords(prev => {
      const curr = getRecord(id).slice();
      curr[dayIdx] = curr[dayIdx] === 'taken' ? 'missed' : curr[dayIdx] === 'missed' ? null : 'taken';
      return { ...prev, [id]: curr };
    });
  };

  const adherencePercent = (rec) => {
    const past = rec.slice(0, todayIdx + 1);
    if (past.length === 0) return 0;
    const taken = past.filter(d => d === 'taken').length;
    return Math.round((taken / past.length) * 100);
  };

  return (
    <div>
      {/* Summary stats */}
      <div className="grid-3" style={{ marginBottom:20 }}>
        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div className="stat-label">Active Medications</div>
          <div className="stat-value">{prescriptions.filter(p=>p.status==='Active').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Avg Adherence (this week)</div>
          <div className="stat-value">
            {prescriptions.length === 0 ? '—' :
              Math.round(prescriptions.reduce((acc,p) => acc + adherencePercent(getRecord(p.id)), 0) / prescriptions.length) + '%'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Today</div>
          <div className="stat-value">{DAYS[todayIdx]}</div>
          <div className="stat-sub">{new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">✅</div>Weekly Adherence Tracker</div>
        </div>

        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          <div className="flex-gap-sm"><div className="pill-slot taken" style={{ cursor:'default', width:20, height:20, fontSize:10, borderRadius:6 }} />  <span className="text-xs">Taken</span></div>
          <div className="flex-gap-sm"><div className="pill-slot missed" style={{ cursor:'default', width:20, height:20, fontSize:10, borderRadius:6 }} /> <span className="text-xs">Missed</span></div>
          <div className="flex-gap-sm"><div className="pill-slot"        style={{ cursor:'default', width:20, height:20, fontSize:10, borderRadius:6 }} /> <span className="text-xs">Pending / Future</span></div>
        </div>

        {prescriptions.filter(p => p.status === 'Active').length === 0 ? (
          <p className="text-sm">No active prescriptions. Add one to start tracking.</p>
        ) : (
          prescriptions.filter(p => p.status === 'Active').map(rx => {
            const rec  = getRecord(rx.id);
            const pct  = adherencePercent(rec);
            return (
              <div key={rx.id} style={{ marginBottom:24 }}>
                <div className="flex-between" style={{ marginBottom:8 }}>
                  <div>
                    <span className="fw-600" style={{ fontSize:14 }}>{rx.drug}</span>
                    <span className="text-xs" style={{ marginLeft:8 }}>— {rx.patient}</span>
                  </div>
                  <span className={`badge ${pct>=80?'badge-green':pct>=50?'badge-orange':'badge-red'}`}>{pct}% adherent</span>
                </div>

                {/* Day pills */}
                <div className="pill-row">
                  {DAYS.map((day, i) => (
                    <div key={day} style={{ textAlign:'center' }}>
                      <div className="text-xs" style={{ marginBottom:4, color: i===todayIdx?'var(--primary)':'var(--text-3)', fontWeight: i===todayIdx?700:400 }}>{day}</div>
                      <div
                        className={`pill-slot ${rec[i]==='taken'?'taken':rec[i]==='missed'?'missed':''}`}
                        style={{ cursor: i<=todayIdx?'pointer':'default', opacity: i>todayIdx?0.4:1 }}
                        onClick={() => toggle(rx.id, i)}
                        title={i<=todayIdx ? 'Click to toggle' : 'Future date'}
                      >
                        {rec[i]==='taken' ? '✓' : rec[i]==='missed' ? '✗' : '·'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="progress-wrap" style={{ marginTop:8 }}>
                  <div className="progress-bar" style={{ width:`${pct}%`, background: pct>=80?'var(--accent)':pct>=50?'var(--warning)':'var(--danger)' }} />
                </div>
                <div className="text-xs" style={{ marginTop:4, color:'var(--text-3)' }}>{rx.dosage} · {rx.frequency}</div>
                {rx.id !== prescriptions.filter(p=>p.status==='Active').at(-1)?.id && <div className="divider" style={{ marginTop:16 }} />}
              </div>
            );
          })
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">💡</div>Adherence Tips</div>
        </div>
        <ul style={{ paddingLeft:20, lineHeight:2 }}>
          {['Set a daily alarm on your phone as a medicine reminder.',
            'Keep medicines visible — place them near your toothbrush or breakfast spot.',
            'Use a weekly pill organiser to track doses at a glance.',
            'Never skip a dose without consulting your doctor first.',
            'If you miss a dose, take it as soon as you remember — unless it\'s near the next dose time.',
          ].map((tip, i) => (
            <li key={i} className="text-sm">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdherenceTracker;