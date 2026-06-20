import React, { useState } from 'react';

const DRUG_DB = {
  'paracetamol':   { name: 'Paracetamol', category: 'Analgesic / Antipyretic', uses: 'Fever, mild to moderate pain relief', dosage: '500mg – 1000mg every 4–6 hours', maxDose: '4000mg/day', warning: 'Avoid alcohol. Do not exceed recommended dose.', sideEffects: 'Rare: liver damage (overdose)' },
  'dolo 650':      { name: 'Dolo 650',    category: 'Analgesic / Antipyretic', uses: 'Fever and body pain; commonly prescribed in viral fever', dosage: '650mg every 6–8 hours', maxDose: '2600mg/day', warning: 'Do not take with other paracetamol-containing products.', sideEffects: 'Nausea (rare)' },
  'aspirin':       { name: 'Aspirin',     category: 'NSAID / Antiplatelet',    uses: 'Pain, fever, anti-clotting (heart attack prevention)', dosage: '75mg – 325mg depending on use', maxDose: '4000mg/day (pain); 75–100mg/day (cardiac)', warning: 'Do not give to children under 16. Avoid if peptic ulcer.', sideEffects: 'GI bleeding, tinnitus' },
  'vitamin c':     { name: 'Vitamin C',   category: 'Vitamin / Supplement',    uses: 'Immunity boost, scurvy prevention, antioxidant', dosage: '250mg – 1000mg daily', maxDose: '2000mg/day', warning: 'High doses may cause kidney stones in susceptible individuals.', sideEffects: 'Diarrhea, stomach upset (high doses)' },
  'ibuprofen':     { name: 'Ibuprofen',   category: 'NSAID',                   uses: 'Pain, inflammation, fever', dosage: '200mg – 400mg every 6–8 hours', maxDose: '1200mg/day (OTC); 3200mg/day (prescription)', warning: 'Take with food. Avoid in kidney disease, pregnancy.', sideEffects: 'GI irritation, dizziness' },
  'amoxicillin':   { name: 'Amoxicillin', category: 'Antibiotic (Penicillin)', uses: 'Bacterial infections: throat, ear, UTI, chest', dosage: '250mg – 500mg every 8 hours', maxDose: '3000mg/day', warning: 'Complete full course. Check for penicillin allergy.', sideEffects: 'Diarrhea, rash, nausea' },
  'metformin':     { name: 'Metformin',   category: 'Antidiabetic',            uses: 'Type 2 diabetes management', dosage: '500mg – 1000mg twice daily with meals', maxDose: '2000mg/day', warning: 'Monitor kidney function. Stop before contrast imaging.', sideEffects: 'Nausea, diarrhea, lactic acidosis (rare)' },
  'atorvastatin':  { name: 'Atorvastatin',category: 'Statin (Cholesterol)',    uses: 'Lowering LDL cholesterol, heart disease prevention', dosage: '10mg – 80mg once daily', maxDose: '80mg/day', warning: 'Report muscle pain immediately. Avoid grapefruit juice.', sideEffects: 'Muscle pain, liver enzyme elevation' },
  'cetirizine':    { name: 'Cetirizine',  category: 'Antihistamine',           uses: 'Allergic rhinitis, urticaria, hay fever', dosage: '5mg – 10mg once daily', maxDose: '10mg/day', warning: 'May cause drowsiness. Avoid driving if affected.', sideEffects: 'Drowsiness, dry mouth' },
  'omeprazole':    { name: 'Omeprazole',  category: 'Proton Pump Inhibitor',   uses: 'Acid reflux, GERD, peptic ulcer', dosage: '20mg – 40mg once daily before meals', maxDose: '40mg/day', warning: 'Long-term use may reduce B12 and magnesium levels.', sideEffects: 'Headache, diarrhea, nausea' },
  'crocin':        { name: 'Crocin',      category: 'Analgesic / Antipyretic', uses: 'Fever, headache, mild pain', dosage: '500mg every 4–6 hours', maxDose: '4000mg/day', warning: 'Contains paracetamol — do not double-dose.', sideEffects: 'Rare with normal use' },
};

function DrugSearch({ prescriptions }) {
  const [query,  setQuery]  = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null); // 'found' | 'not-found'

  // unique drugs from prescriptions
  const prescribedDrugs = [...new Set(prescriptions.map(p => p.drug))];

  const handleSearch = () => {
    const key = query.trim().toLowerCase();
    if (!key) return;
    const found = DRUG_DB[key];
    if (found) {
      setResult(found);
      setStatus('found');
    } else {
      setResult(null);
      setStatus('not-found');
    }
  };

  const quickSearch = (name) => {
    setQuery(name);
    const found = DRUG_DB[name.toLowerCase()];
    if (found) { setResult(found); setStatus('found'); }
    else { setResult(null); setStatus('not-found'); }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">🔍</div>
            Drug Search
          </div>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <input
            className="form-input"
            style={{ flex:1 }}
            placeholder="Search drug name (e.g. Paracetamol, Aspirin)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>

        {/* Quick search chips */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:14 }}>
          {Object.values(DRUG_DB).map(d => (
            <button
              key={d.name}
              className="btn btn-outline btn-sm"
              onClick={() => quickSearch(d.name)}
            >{d.name}</button>
          ))}
        </div>

        {/* Result */}
        {status === 'not-found' && (
          <div className="alert alert-error" style={{ marginTop:16 }}>⚠ Drug not found in database.</div>
        )}
        {status === 'found' && result && (
          <div className="drug-result" style={{ marginTop:16 }}>
            <div className="flex-between" style={{ marginBottom:12 }}>
              <div>
                <h4 style={{ fontSize:17, fontWeight:700, color:'var(--primary)', marginBottom:4 }}>{result.name}</h4>
                <span className="badge badge-blue">{result.category}</span>
              </div>
              <span style={{ fontSize:22 }}>💊</span>
            </div>
            <div className="divider" />
            <div className="grid-2" style={{ gap:12 }}>
              <div><div className="form-label">Uses</div><p className="text-sm" style={{lineHeight:1.6}}>{result.uses}</p></div>
              <div><div className="form-label">Dosage</div><p className="text-sm">{result.dosage}</p></div>
              <div><div className="form-label">Max Dose</div><p className="text-sm">{result.maxDose}</p></div>
              <div><div className="form-label">Side Effects</div><p className="text-sm">{result.sideEffects}</p></div>
            </div>
            <div className="alert alert-warning" style={{ marginTop:12 }}>
              ⚠ {result.warning}
            </div>
          </div>
        )}
      </div>

      {/* Drugs from your prescriptions */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">📋</div>
            Drugs in Your Prescriptions
          </div>
          <span className="badge badge-blue">{prescribedDrugs.length} drugs</span>
        </div>
        {prescribedDrugs.length === 0 ? (
          <p className="text-sm">No prescriptions added yet.</p>
        ) : (
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {prescribedDrugs.map(drug => (
              <button
                key={drug}
                className="btn btn-outline btn-sm"
                style={{ borderColor:'var(--accent)', color:'var(--accent)' }}
                onClick={() => quickSearch(drug)}
              >💊 {drug}</button>
            ))}
          </div>
        )}
        {prescriptions.length > 0 && (
          <div className="table-wrap" style={{ marginTop:16 }}>
            <table className="table">
              <thead><tr><th>Patient</th><th>Drug</th><th>Dosage</th><th>Status</th></tr></thead>
              <tbody>
                {prescriptions.map(p => (
                  <tr key={p.id}>
                    <td className="fw-600">{p.patient}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{ padding:'3px 10px' }} onClick={() => quickSearch(p.drug)}>
                        {p.drug}
                      </button>
                    </td>
                    <td>{p.dosage}</td>
                    <td><span className={`badge ${p.status === 'Active' ? 'badge-green' : 'badge-blue'}`}>{p.status}</span></td>
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

export default DrugSearch;