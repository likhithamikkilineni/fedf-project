import React, { useState } from 'react';

function RefillRequest({ prescriptions }) {
  const [selected, setSelected] = useState('');
  const [reason,   setReason]   = useState('');
  const [requests, setRequests] = useState([
    { id: 1, drug: 'Paracetamol', patient: 'Ravi Kumar', date: '2025-05-20', status: 'Approved' },
  ]);
  const [alert, setAlert] = useState(null);

  const activePrescriptions = prescriptions.filter(p => p.status === 'Active');

  const handleSubmit = () => {
    if (!selected) { setAlert({ type:'error', msg:'Please select a prescription.' }); return; }
    const rx = prescriptions.find(p => String(p.id) === String(selected));
    setRequests(prev => [
      { id: Date.now(), drug: rx.drug, patient: rx.patient, date: new Date().toISOString().slice(0,10), status: 'Pending' },
      ...prev,
    ]);
    setAlert({ type:'success', msg:`Refill request for ${rx.drug} sent successfully!` });
    setSelected(''); setReason('');
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">🔄</div>New Refill Request</div>
        </div>
        <p className="text-sm" style={{ marginBottom:20, lineHeight:1.6 }}>
          Request a refill for an existing active prescription. Your pharmacy will be notified automatically.
        </p>
        <div className="form-group">
          <label className="form-label">Select Prescription</label>
          <select className="form-select" value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">Choose active prescription...</option>
            {activePrescriptions.map(p => (
              <option key={p.id} value={p.id}>{p.patient} — {p.drug} ({p.dosage})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Reason (optional)</label>
          <input className="form-input" placeholder="e.g. Running low, 3 days supply left" value={reason} onChange={e => setReason(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-full" onClick={handleSubmit}>Send Refill Request</button>
        {alert && <div className={`alert alert-${alert.type}`}>{alert.type==='success'?'✓':'⚠'} {alert.msg}</div>}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">📋</div>Refill History</div>
          <span className="badge badge-blue">{requests.length} requests</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Patient</th><th>Drug</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td className="fw-600">{r.patient}</td>
                  <td>{r.drug}</td>
                  <td className="text-xs">{r.date}</td>
                  <td>
                    <span className={`badge ${r.status==='Approved'?'badge-green':r.status==='Pending'?'badge-orange':'badge-red'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RefillRequest;