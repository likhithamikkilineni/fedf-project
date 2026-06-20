import React, { useState } from 'react';

const DRUG_LIMITS = {
  'Paracetamol': { max: 1000, unit: 'mg', perDose: true  },
  'Aspirin':     { max:  325, unit: 'mg', perDose: true  },
  'Ibuprofen':   { max:  400, unit: 'mg', perDose: true  },
  'Vitamin C':   { max: 2000, unit: 'mg', perDose: false },
  'Amoxicillin': { max:  500, unit: 'mg', perDose: true  },
  'Metformin':   { max: 1000, unit: 'mg', perDose: true  },
  'Cetirizine':  { max:   10, unit: 'mg', perDose: true  },
  'Omeprazole':  { max:   40, unit: 'mg', perDose: true  },
};

function DosageValidator() {
  const [drug,   setDrug]   = useState('');
  const [dosage, setDosage] = useState('');
  const [result, setResult] = useState(null);

  const validate = () => {
    if (!dosage || isNaN(Number(dosage))) return;
    const d = Number(dosage);
    const limits = DRUG_LIMITS[drug];
    if (!limits) {
      setResult({ status: 'info', msg: `No specific limit data for "${drug || 'selected drug'}". General safe dosage rule applied: values >500mg warrant physician review.`, safePercent: d <= 500 ? 60 : 90 });
      return;
    }
    const pct = Math.min((d / limits.max) * 100, 100);
    if (d <= limits.max * 0.5) {
      setResult({ status: 'safe', msg: `✓ Safe dosage — ${d}${limits.unit} is within the recommended range for ${drug} (max ${limits.max}${limits.unit} per dose).`, safePercent: pct });
    } else if (d <= limits.max) {
      setResult({ status: 'caution', msg: `⚠ Caution — ${d}${limits.unit} is near the upper limit for ${drug}. Physician monitoring recommended.`, safePercent: pct });
    } else {
      setResult({ status: 'unsafe', msg: `✗ Unsafe — ${d}${limits.unit} exceeds the maximum safe dose of ${limits.max}${limits.unit} for ${drug}. Do NOT administer.`, safePercent: 100 });
    }
  };

  const barColor = result
    ? result.status === 'safe'    ? 'var(--accent)'
    : result.status === 'caution' ? 'var(--warning)'
    : 'var(--danger)'
    : 'var(--border)';

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">⚖️</div>
            Dosage Validator
          </div>
        </div>
        <p className="text-sm" style={{ marginBottom:20, lineHeight:1.6 }}>
          Enter the drug name and dosage to verify whether it falls within safe, recommended limits based on standard pharmaceutical guidelines.
        </p>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Drug Name</label>
            <select className="form-select" value={drug} onChange={e => setDrug(e.target.value)}>
              <option value="">Select drug</option>
              {Object.keys(DRUG_LIMITS).map(d => <option key={d}>{d}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Dosage (mg)</label>
            <input className="form-input" type="number" placeholder="Enter dosage in mg" value={dosage} onChange={e => setDosage(e.target.value)} min="0" />
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={validate}>Validate Dosage</button>

        {result && (
          <div style={{ marginTop:20 }}>
            <div className={`alert ${result.status === 'safe' ? 'alert-success' : result.status === 'caution' ? 'alert-warning' : result.status === 'info' ? 'alert-info' : 'alert-error'}`}>
              {result.msg}
            </div>
            {result.status !== 'info' && (
              <div style={{ marginTop:16 }}>
                <div className="flex-between text-xs" style={{ marginBottom:6 }}>
                  <span>Dosage level</span>
                  <span>{Math.round(result.safePercent)}% of max</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-bar" style={{ width:`${result.safePercent}%`, background: barColor }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reference table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">📊</div>
            Reference: Safe Dose Limits
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Drug</th><th>Max Per Dose</th><th>Type</th></tr></thead>
            <tbody>
              {Object.entries(DRUG_LIMITS).map(([name, info]) => (
                <tr key={name}>
                  <td className="fw-600">{name}</td>
                  <td>{info.max}{info.unit}</td>
                  <td><span className={`badge ${info.perDose ? 'badge-blue' : 'badge-green'}`}>{info.perDose ? 'Per dose' : 'Per day'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DosageValidator;