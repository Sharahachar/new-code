import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Adminlogout.css';

const AdminLogout = () => {
    const [logoutSuccess, setLogoutSuccess] = useState(false);
    const navigate = useNavigate();

    const handleConfirmLogout = () => {
        console.log('Logging out...'); // Placeholder for actual logout logic
        setLogoutSuccess(true);
        setTimeout(() => {
            navigate('/'); // Redirect to home page after a delay
        }, 1000); // 2-second delay before redirecting
    };
    const handleBack = () => {
        navigate(0);
      };
    const handleTouchStart = (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchMove = (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = () => {
        if (this.touchStartX - this.touchEndX > 150) {
            // Swiped left - you can customize the action here
            handleConfirmLogout();
        }
        if (this.touchStartX - this.touchEndX < -150) {
            // Swiped right - you can customize the action here
            navigate(0);
        }
    };

    return (
        <div 
            className="admin-logout-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="admin-logout-content">
                <h2 className='admin-logout-title'>Confirm Logout</h2>
                <p className="admin-logout-message">Are you sure you want to logout?</p>
                <div className="admin-button-container">
                    <button className="admin-confirm-button" onClick={handleConfirmLogout}>
                        Logout
                    </button>
                    <button className="admin-cancel-button">
                        <Link className="admin-link-button" onClick={handleBack}>Cancel</Link>
                    </button>
                </div>
                {logoutSuccess && <p className="admin-logout-success">Logout successful!</p>}
            </div>
        </div>
    );
};

export default AdminLogout;
