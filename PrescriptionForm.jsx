import React, { useState } from 'react';

const DRUG_LIST = ['Paracetamol','Dolo 650','Aspirin','Vitamin C','Ibuprofen','Amoxicillin','Metformin','Atorvastatin','Cetirizine','Omeprazole'];
const FREQUENCY = ['Once daily','Twice daily','Three times daily','Every 8 hours','Every morning','Every night','As needed'];
const PHARMACIES = ['Apollo Pharmacy','MedPlus','Netmeds','1mg','Wellness Forever'];

function PrescriptionForm({ prescriptions, addPrescription }) {
  const [patient,   setPatient]   = useState('');
  const [drug,      setDrug]      = useState('');
  const [dosage,    setDosage]    = useState('');
  const [frequency, setFrequency] = useState('');
  const [pharmacy,  setPharmacy]  = useState('');
  const [alert,     setAlert]     = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleDrugInput = (val) => {
    setDrug(val);
    if (val.length > 0) {
      setSuggestions(DRUG_LIST.filter(d => d.toLowerCase().startsWith(val.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !drug || !dosage || !frequency || !pharmacy) {
      setAlert({ type: 'error', msg: 'All fields are required.' });
      return;
    }
    addPrescription({ patient, drug, dosage, frequency, pharmacy });
    setAlert({ type: 'success', msg: `Prescription for ${patient} added successfully!` });
    setPatient(''); setDrug(''); setDosage(''); setFrequency(''); setPharmacy('');
    setSuggestions([]);
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div>
      {/* Stats row */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-label">Total Prescriptions</div>
          <div className="stat-value">{prescriptions.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Active</div>
          <div className="stat-value">{prescriptions.filter(p => p.status === 'Active').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-label">Completed</div>
          <div className="stat-value">{prescriptions.filter(p => p.status === 'Completed').length}</div>
        </div>
      </div>

      {/* Form card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">📋</div>
            New Prescription
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Patient Name</label>
              <input className="form-input" placeholder="e.g. Ravi Kumar" value={patient} onChange={e => setPatient(e.target.value)} />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Drug Name</label>
              <input className="form-input" placeholder="Search drug..." value={drug} onChange={e => handleDrugInput(e.target.value)} autoComplete="off" />
              {suggestions.length > 0 && (
                <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid var(--border)', borderRadius:10, zIndex:99, boxShadow:'var(--shadow-md)', overflow:'hidden' }}>
                  {suggestions.map(s => (
                    <div key={s} style={{ padding:'10px 14px', cursor:'pointer', fontSize:13.5, color:'var(--text-1)' }}
                      onMouseDown={() => { setDrug(s); setSuggestions([]); }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >{s}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Dosage</label>
              <input className="form-input" placeholder="e.g. 500mg" value={dosage} onChange={e => setDosage(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Frequency</label>
              <select className="form-select" value={frequency} onChange={e => setFrequency(e.target.value)}>
                <option value="">Select frequency</option>
                {FREQUENCY.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Assign Pharmacy</label>
              <select className="form-select" value={pharmacy} onChange={e => setPharmacy(e.target.value)}>
                <option value="">Select pharmacy</option>
                {PHARMACIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 4 }}>
            ＋ Add Prescription
          </button>
        </form>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.type === 'success' ? '✓' : '⚠'} {alert.msg}
          </div>
        )}
      </div>

      {/* Recent prescriptions */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">🕐</div>
            Recent Prescriptions
          </div>
          <span className="badge badge-blue">{prescriptions.length} total</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th><th>Drug</th><th>Dosage</th><th>Frequency</th><th>Pharmacy</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map(p => (
                <tr key={p.id}>
                  <td className="fw-600">{p.patient}</td>
                  <td>{p.drug}</td>
                  <td>{p.dosage}</td>
                  <td>{p.frequency}</td>
                  <td>{p.pharmacy}</td>
                  <td className="text-xs">{p.date}</td>
                  <td><span className={`badge ${p.status === 'Active' ? 'badge-green' : 'badge-blue'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionForm;