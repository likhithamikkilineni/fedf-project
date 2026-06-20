import React, { useState } from 'react';

function AdminPanel() {

  const [message, setMessage] = useState('');

  const manageUsers = () => {
    setMessage('Users Managed Successfully');
  };

  return (
    <div className="card">

      <h2>Admin Panel</h2>

      <p>
        The admin panel helps administrators manage doctors,
        patients, pharmacies, prescriptions, and system records.
      </p>

      <button onClick={manageUsers}>
        Manage Users
      </button>

      <button onClick={() => setMessage('Prescription Records Updated')}>
        Update Records
      </button>

      <button onClick={() => setMessage('Notifications Sent')}>
        Send Notifications
      </button>

      <p>{message}</p>

    </div>
  );
}

export default AdminPanel;