import React, { useState } from 'react';

function History({ prescriptions }) {
  const [search,     setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sort,       setSort]       = useState('newest');

  let filtered = prescriptions.filter(p => {
    const q = search.toLowerCase();
    return (
      p.patient.toLowerCase().includes(q) ||
      p.drug.toLowerCase().includes(q) ||
      p.pharmacy?.toLowerCase().includes(q)
    );
  });

  if (filterStatus !== 'All') filtered = filtered.filter(p => p.status === filterStatus);

  filtered = [...filtered].sort((a, b) =>
    sort === 'newest' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
  );

  return (
    <div>
      {/* Stats */}
      <div className="grid-3" style={{ marginBottom:20 }}>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{prescriptions.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Active</div>
          <div className="stat-value">{prescriptions.filter(p=>p.status==='Active').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏁</div>
          <div className="stat-label">Completed</div>
          <div className="stat-value">{prescriptions.filter(p=>p.status==='Completed').length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">🕐</div>Prescription History</div>
          <span className="badge badge-blue">{filtered.length} records</span>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
          <input
            className="form-input"
            style={{ flex:1, minWidth:200 }}
            placeholder="Search patient, drug, pharmacy..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="form-select" style={{ width:140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
          <select className="form-select" style={{ width:150 }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="alert alert-info">No prescriptions found matching your search.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Patient</th><th>Drug</th><th>Dosage</th><th>Frequency</th><th>Pharmacy</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td className="text-xs">{i+1}</td>
                    <td className="fw-600">{p.patient}</td>
                    <td>{p.drug}</td>
                    <td>{p.dosage}</td>
                    <td className="text-xs">{p.frequency || '—'}</td>
                    <td className="text-xs">{p.pharmacy}</td>
                    <td className="text-xs">{p.date}</td>
                    <td>
                      <span className={`badge ${p.status==='Active'?'badge-green':'badge-blue'}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drug frequency summary */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">📊</div>Most Prescribed Drugs</div>
        </div>
        {prescriptions.length === 0 ? (
          <p className="text-sm">No data yet.</p>
        ) : (
          Object.entries(
            prescriptions.reduce((acc, p) => { acc[p.drug] = (acc[p.drug]||0)+1; return acc; }, {})
          ).sort((a,b)=>b[1]-a[1]).map(([drug, count]) => {
            const pct = Math.round((count / prescriptions.length) * 100);
            return (
              <div key={drug} style={{ marginBottom:14 }}>
                <div className="flex-between text-sm" style={{ marginBottom:6 }}>
                  <span className="fw-600">{drug}</span>
                  <span className="text-xs">{count} prescription{count>1?'s':''}</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-bar" style={{ width:`${pct}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default History;