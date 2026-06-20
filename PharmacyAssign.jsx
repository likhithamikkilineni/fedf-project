import React, { useState } from 'react';

const PHARMACIES = [
  { name: 'Apollo Pharmacy',    area: 'Banjara Hills',  rating: 4.8, open: true,  phone: '+91 98765 43210' },
  { name: 'MedPlus',           area: 'Jubilee Hills',  rating: 4.5, open: true,  phone: '+91 91234 56789' },
  { name: 'Netmeds',           area: 'Online Delivery', rating: 4.6, open: true,  phone: '+91 80000 12345' },
  { name: '1mg',               area: 'Online Delivery', rating: 4.4, open: true,  phone: '+91 99999 11111' },
  { name: 'Wellness Forever',  area: 'Madhapur',       rating: 4.3, open: false, phone: '+91 77777 88888' },
];

function PharmacyAssign({ prescriptions }) {
  const [assignments, setAssignments] = useState({});
  const [alert, setAlert] = useState(null);

  const assign = (prescriptionId, pharmacyName) => {
    setAssignments(prev => ({ ...prev, [prescriptionId]: pharmacyName }));
    const rx = prescriptions.find(p => p.id === prescriptionId);
    setAlert({ type:'success', msg:`${pharmacyName} assigned to ${rx?.drug} for ${rx?.patient}!` });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">🏥</div>Available Pharmacies</div>
        </div>
        <div className="grid-2">
          {PHARMACIES.map(p => (
            <div key={p.name} style={{ border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
              <div className="flex-between" style={{ marginBottom:8 }}>
                <span className="fw-600" style={{ fontSize:14 }}>{p.name}</span>
                <span className={`badge ${p.open ? 'badge-green' : 'badge-red'}`}>{p.open ? 'Open' : 'Closed'}</span>
              </div>
              <div className="text-xs" style={{ marginBottom:4 }}>📍 {p.area}</div>
              <div className="text-xs" style={{ marginBottom:4 }}>📞 {p.phone}</div>
              <div className="text-xs">⭐ {p.rating}/5.0</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">📋</div>Assign Pharmacy to Prescription</div>
        </div>
        {alert && <div className={`alert alert-${alert.type}`} style={{ marginBottom:16 }}>✓ {alert.msg}</div>}
        {prescriptions.length === 0 ? (
          <p className="text-sm">No prescriptions yet. Add one first.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Patient</th><th>Drug</th><th>Dosage</th><th>Assigned Pharmacy</th><th>Action</th></tr></thead>
              <tbody>
                {prescriptions.map(rx => (
                  <tr key={rx.id}>
                    <td className="fw-600">{rx.patient}</td>
                    <td>{rx.drug}</td>
                    <td>{rx.dosage}</td>
                    <td>
                      {assignments[rx.id] || rx.pharmacy
                        ? <span className="badge badge-green">{assignments[rx.id] || rx.pharmacy}</span>
                        : <span className="text-xs" style={{ color:'var(--text-3)' }}>Not assigned</span>
                      }
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding:'5px 10px', fontSize:12.5 }}
                        value={assignments[rx.id] || rx.pharmacy || ''}
                        onChange={e => assign(rx.id, e.target.value)}
                      >
                        <option value="">Reassign...</option>
                        {PHARMACIES.filter(p => p.open).map(p => (
                          <option key={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PharmacyAssign;