import React from 'react';
import './Adminhelp.css'; // Import CSS file for styles
import { useNavigate } from 'react-router-dom';
import { IoReturnDownBack } from "react-icons/io5";

const AdminHelp = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(0);
    };

    return (
        <div className="admin-help-menu">
            <h2 className='admin-help-title'>Help Menu</h2>
            <p className='admin-help-contact'>Contact Information:</p>
            <div className="admin-contact-info">
                <ul className="admin-help-list">
                    <li className="admin-help-list-item">Company Email: syliqonsoftware.com</li>
                    <li className="admin-help-list-item">HR Email: hr@syliqonsoftware.com</li>
                    <li className="admin-help-list-item">Manager Email: manager@syliqonsoftware.com</li>
                    <li className="admin-help-list-item">Team Leader Email: teamleader@syliqon.com</li>
                </ul>
            </div>
            
            <button className="admin-back-button" onClick={handleBack}> Back</button>
            
        </div>
    );
};

export default AdminHelp;
