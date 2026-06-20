import React, { useState } from 'react';
import './App.css';

import PrescriptionForm from './components/PrescriptionForm';
import DrugSearch      from './components/DrugSearch';
import DosageValidator from './components/DosageValidator';
import RefillRequest   from './components/RefillRequest';
import PharmacyAssign  from './components/PharmacyAssign';
import PDFExport       from './components/PDFExport';
import AdherenceTracker from './components/AdherenceTracker';
import History         from './components/History';
import Notifications   from './components/Notifications';
import AdminPanel      from './components/AdminPanel';

const NAV = [
  { id: 'prescriptions', label: 'Prescriptions',   icon: '📋', section: 'main' },
  { id: 'drug-search',   label: 'Drug Search',      icon: '🔍', section: 'main' },
  { id: 'dosage',        label: 'Dosage Validator', icon: '⚖️', section: 'main' },
  { id: 'refill',        label: 'Refill Request',   icon: '🔄', section: 'main' },
  { id: 'pharmacy',      label: 'Pharmacy Assign',  icon: '🏥', section: 'main' },
  { id: 'pdf',           label: 'PDF Export',       icon: '📄', section: 'main' },
  { id: 'adherence',     label: 'Adherence Tracker',icon: '✅', section: 'tracking' },
  { id: 'history',       label: 'History',          icon: '🕐', section: 'tracking' },
  { id: 'notifications', label: 'Notifications',    icon: '🔔', section: 'tracking' },
  { id: 'admin',         label: 'Admin Panel',      icon: '🛡️', section: 'admin'    },
];

function App() {
  const [activePage, setActivePage] = useState('prescriptions');

  // ── Shared prescription state ──
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, patient: 'Ravi Kumar',  drug: 'Paracetamol', dosage: '500mg', frequency: '2× daily',  pharmacy: 'Apollo Pharmacy', date: '2025-05-20', status: 'Active'   },
    { id: 2, patient: 'Priya Reddy', drug: 'Vitamin C',   dosage: '250mg', frequency: '1× daily',  pharmacy: 'MedPlus',         date: '2025-05-18', status: 'Active'   },
    { id: 3, patient: 'Arun Singh',  drug: 'Aspirin',     dosage: '75mg',  frequency: '1× morning', pharmacy: 'Apollo Pharmacy', date: '2025-05-15', status: 'Completed'},
  ]);

  const addPrescription = (entry) => {
    setPrescriptions(prev => [
      { ...entry, id: Date.now(), date: new Date().toISOString().slice(0,10), status: 'Active' },
      ...prev,
    ]);
  };

  // notifications count
  const notifCount = 3;

  const pageTitle = NAV.find(n => n.id === activePage)?.label || 'Dashboard';

  return (
    <div className="app-shell">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>RxManager</h1>
          <span>Prescription System</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {NAV.filter(n => n.section === 'main').map(item => (
            <button
              key={item.id}
              className={`nav-item${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 12 }}>Tracking</div>
          {NAV.filter(n => n.section === 'tracking').map(item => (
            <button
              key={item.id}
              className={`nav-item${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id === 'notifications' && notifCount > 0 && (
                <span className="nav-badge">{notifCount}</span>
              )}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 12 }}>Admin</div>
          {NAV.filter(n => n.section === 'admin').map(item => (
            <button
              key={item.id}
              className={`nav-item${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <span style={{ color: 'var(--text-3)', fontWeight: 400, fontSize: 14 }}>RxManager /</span>{' '}
            <span>{pageTitle}</span>
          </div>
          <div className="topbar-right">
            <button className="topbar-notif-btn" onClick={() => setActivePage('notifications')}>
              🔔
              {notifCount > 0 && <span className="notif-dot" />}
            </button>
            <div className="avatar">Dr</div>
          </div>
        </header>

        <main className="page-body">
          {activePage === 'prescriptions'  && <PrescriptionForm  prescriptions={prescriptions} addPrescription={addPrescription} />}
          {activePage === 'drug-search'    && <DrugSearch        prescriptions={prescriptions} />}
          {activePage === 'dosage'         && <DosageValidator   />}
          {activePage === 'refill'         && <RefillRequest     prescriptions={prescriptions} />}
          {activePage === 'pharmacy'       && <PharmacyAssign    prescriptions={prescriptions} />}
          {activePage === 'pdf'            && <PDFExport         prescriptions={prescriptions} />}
          {activePage === 'adherence'      && <AdherenceTracker  prescriptions={prescriptions} />}
          {activePage === 'history'        && <History           prescriptions={prescriptions} />}
          {activePage === 'notifications'  && <Notifications     prescriptions={prescriptions} />}
          {activePage === 'admin'          && <AdminPanel        prescriptions={prescriptions} setPrescriptions={setPrescriptions} />}
        </main>
      </div>

    </div>
  );
}

export default App;