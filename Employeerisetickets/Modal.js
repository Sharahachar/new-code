import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Raiseticket.css';
import { TicketContext } from '../../../contexts/TicketContext';
import Modal from './Modal'; // Adjust the path as necessary

const RaiseTicket = () => {
    const [location, setLocation] = useState('');
    const [supportTeam, setSupportTeam] = useState('');
    const [queryType, setQueryType] = useState('');
    const [reason, setReason] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const formContainerRef = useRef(null);

    const { addTicket } = useContext(TicketContext);

    const getRecipients = (supportTeam) => {
        const recipients = {
            'HR Support': ['sharathnvmca2023@gmail.com', 'sharathachar55@gmail.com'],
            'Manager Support': ['sharathachar55@gmail.com', 'sharathnvmca2023@gmail.com'],
            'Leader Support': ['kamalmeda0139@gmail.com', 'sharathachar55@gmail.com'],
            'Customer Support': ['sharathachar55@gmail.com', 'sharathnvmca2023@gmail.com'],
        };
        return recipients[supportTeam] || [];
    };

    const sendEmails = async (ticket) => {
        setLoading(true);
        const emailBody = `
            <h3>New Ticket Submitted</h3>
            <p><strong>Location:</strong> ${ticket.location}</p>
            <p><strong>Support Team:</strong> ${ticket.supportTeam}</p>
            <p><strong>Query Type:</strong> ${ticket.queryType}</p>
            <p><strong>Reason:</strong> ${ticket.reason}</p>
            <p><strong>Priority:</strong> ${ticket.priority}</p>
            <p><strong>Description:</strong> ${ticket.description}</p>
            <p><strong>Attachment:</strong> ${ticket.attachment ? ticket.attachment : 'None'}</p>
        `;

        const recipients = getRecipients(ticket.supportTeam);

        try {
            const response = await fetch('http://localhost:5000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipients: recipients,
                    subject: 'New Ticket Submitted',
                    body: emailBody,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            const result = await response.json();
            console.log(result);
            setNotification('Ticket submitted successfully!');
            setTimeout(() => setNotification(''), 5000); // Hide notification after 5 seconds
        } catch (error) {
            console.error('Error sending email:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTicket = {
            id: Date.now(),
            location,
            supportTeam,
            queryType,
            reason,
            priority,
            description,
            attachment: attachment ? attachment.name : null,
        };
        addTicket(newTicket);
        sendEmails(newTicket);
        setModalMessage('Ticket submitted successfully!'); // Set modal message
        setModalOpen(true); // Open the modal
        clearForm();
    };

    const clearForm = () => {
        setLocation('');
        setSupportTeam('');
        setQueryType('');
        setReason('');
        setPriority('');
        setDescription('');
        setAttachment(null);
    };

    const handleCancel = () => {
        clearForm();
        navigate(0);
    };

    const scrollToTop = () => {
        if (formContainerRef.current) {
            formContainerRef.current.scrollTop = 0;
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const form = e.target.form;
            const formElements = Array.from(form.elements);
            const nextElement = formElements[index + 1];
            if (nextElement) {
                nextElement.focus();
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        navigate();
    };

    return (
        <div className="raise-ticket-container">
            {notification && (
                <div className="notification-bar">
                    {notification}
                </div>
            )}
            <h1>Raise Ticket</h1>
            <div className="raise-ticket-form-container" ref={formContainerRef}>
                <form onSubmit={handleSubmit}>
                    {/* Form fields here */}
                    <div className="raise-ticket-form-group">
                        <label className='raise-ticket-label'>Location:</label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 0)}
                            required
                        >
                            <option value="" disabled>Select location</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                        </select>
                    </div>
                    <div className="raise-ticket-form-row">
                        <div className="raise-ticket-form-group raise-ticket-half-width">
                            <label className='raise-ticket-label'>Support Team:</label>
                            <select
                                value={supportTeam}
                                onChange={(e) => setSupportTeam(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, 1)}
                                required
                            >
                                <option value="" disabled>Select support team</option>
                                <option value="HR Support">HR Support</option>
                                <option value="Manager Support">Manager Support</option>
                                <option value="Leader Support">Leader Support</option>
                                <option value="Customer Support">Customer Support</option>
                            </select>
                        </div>
                        <div className="raise-ticket-form-group raise-ticket-half-width">
                            <label className='raise-ticket-label'>Query Type:</label>
                            <input
                                type="text"
                                value={queryType}
                                onChange={(e) => setQueryType(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, 2)}
                                required
                            />
                        </div>
                    </div>
                    <div className="raise-ticket-form-group">
                        <label className='raise-ticket-label'>Reason:</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 3)}
                            required
                        />
                    </div>
                    <div className="raise-ticket-form-row">
                        <div className="raise-ticket-form-group raise-ticket-half-width">
                            <label className='raise-ticket-label'>Priority:</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, 4)}
                                required
                            >
                                <option value="" disabled>Select priority</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="raise-ticket-form-group raise-ticket-half-width">
                            <label className='raise-ticket-label'>Attachment:</label>
                            <input
                                type="file"
                                onChange={(e) => setAttachment(e.target.files[0])}
                                onKeyDown={(e) => handleKeyDown(e, 5)}
                            />
                        </div>
                    </div>
                    <div className="raise-ticket-form-group">
                        <label className='raise-ticket-label'>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 6)}
                            required
                        />
                    </div>
                    <div className="raise-ticket-buttons">
                        <button type="submit" disabled={loading}>Submit</button>
                        <button type="button" onClick={handleCancel} disabled={loading}>Cancel</button>
                    </div>
                </form>
            </div>
            {modalOpen && (
                <Modal
                    message={modalMessage}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default RaiseTicket;
