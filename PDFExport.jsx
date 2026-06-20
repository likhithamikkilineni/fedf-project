import React, { useState } from 'react';

function PDFExport({ prescriptions }) {
  const [selected, setSelected] = useState('all');
  const [alert,    setAlert]    = useState(null);

  const handleExport = () => {
    const list = selected === 'all' ? prescriptions : prescriptions.filter(p => String(p.id) === selected);
    if (list.length === 0) { setAlert({ type:'error', msg:'No prescriptions to export.' }); return; }

    // Build printable HTML
    const rows = list.map(p => `
      <tr>
        <td>${p.patient}</td>
        <td>${p.drug}</td>
        <td>${p.dosage}</td>
        <td>${p.frequency || '—'}</td>
        <td>${p.pharmacy}</td>
        <td>${p.date}</td>
        <td>${p.status}</td>
      </tr>`).join('');

    const html = `
      <html><head><title>Prescriptions</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #1a202c; }
        h1   { color: #0f4c81; font-size: 22px; margin-bottom: 4px; }
        p    { color: #666; font-size: 13px; margin-bottom: 24px; }
        table{ width:100%; border-collapse:collapse; font-size:13px; }
        th   { background:#0f4c81; color:#fff; padding:10px 12px; text-align:left; }
        td   { padding:9px 12px; border-bottom:1px solid #e2e8f0; }
        tr:nth-child(even) td { background:#f7fafc; }
        .badge { display:inline-block; padding:2px 8px; border-radius:20px; font-size:11px; font-weight:700; }
        .active { background:#e6f9f4; color:#00835f; }
        .completed { background:#e8f1fb; color:#0f4c81; }
      </style></head>
      <body>
        <h1>RxManager — Prescription Report</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })} &nbsp;|&nbsp; ${list.length} prescription(s)</p>
        <table>
          <thead><tr><th>Patient</th><th>Drug</th><th>Dosage</th><th>Frequency</th><th>Pharmacy</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
    setAlert({ type:'success', msg:`${list.length} prescription(s) sent to print/PDF!` });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">📄</div>PDF Export</div>
        </div>
        <p className="text-sm" style={{ marginBottom:20, lineHeight:1.6 }}>
          Export prescriptions as a printable PDF report. Select a specific prescription or export all at once.
        </p>
        <div className="form-group">
          <label className="form-label">Select Prescription</label>
          <select className="form-select" value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="all">All Prescriptions ({prescriptions.length})</option>
            {prescriptions.map(p => (
              <option key={p.id} value={p.id}>{p.patient} — {p.drug} ({p.date})</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary btn-full" onClick={handleExport}>📄 Export as PDF</button>
        {alert && <div className={`alert alert-${alert.type}`} style={{ marginTop:12 }}>{alert.type==='success'?'✓':'⚠'} {alert.msg}</div>}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">👁</div>Preview</div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Patient</th><th>Drug</th><th>Dosage</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {(selected === 'all' ? prescriptions : prescriptions.filter(p => String(p.id) === selected)).map(p => (
                <tr key={p.id}>
                  <td className="fw-600">{p.patient}</td>
                  <td>{p.drug}</td>
                  <td>{p.dosage}</td>
                  <td className="text-xs">{p.date}</td>
                  <td><span className={`badge ${p.status==='Active'?'badge-green':'badge-blue'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PDFExport;