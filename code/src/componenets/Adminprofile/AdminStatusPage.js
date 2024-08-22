import React from 'react';
import './AdminStatusPage.css';

function StatusPage({ name, id, status }) {
  const getStatusClass = (currentStatus) => {
    if (status === 'submitted' && currentStatus === 'submitted') return 'completed';
    if (status === 'resignation_approved' && (currentStatus === 'submitted' || currentStatus === 'resignation_approved')) return 'completed';
    return 'pending';
  };

  return (
    <div className="admin-status-page">
      <p className='admin-status-title'>Status of Your Resignation</p>
      <div className="admin-status-employee-details">
        <p>Name: {name}</p>
        <p>ID Card Number: {id}</p>
      </div>
      <div className="admin-status-progress-bar">
        <div className={`admin-status-progress-step ${getStatusClass('submitted')}`}>
          <div className="admin-status-circle"></div>
          <span className='admin-status-label'>Submission</span>
        </div>
        <div className="admin-status-arrow-mark"></div>
        <div className={`admin-status-progress-step ${getStatusClass('resignation_approved')}`}>
          <div className="admin-status-circle"></div>
          <span className='admin-status-label'>Resignation Approved</span>
        </div>
      </div>
      <button className="admin-status-back-button" onClick={() => window.location.href = 0}>Back to Home</button>
    </div>
  );
}

export default StatusPage;
