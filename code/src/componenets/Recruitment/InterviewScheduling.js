import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InterviewScheduling.css';

const InterviewScheduling = () => {
    const [interviews, setInterviews] = useState([
        { id: 1, applicant: 'sharath', date: '2024-08-20', time: '10:00 ', email: 'sharathachar55@gmail.com', link: 'https://meet.google.com/your-meet-link' },
        { id: 2, applicant: 'naveed', date: '2024-08-21', time: '11:00 ', email: 'naveed@gmail.com', link: 'https://meet.google.com/your-meet-link' },
    ]);
    const [editingInterview, setEditingInterview] = useState(null);
    const [editForm, setEditForm] = useState({ date: '', time: '', email: '', link: '' });

    const navigate = useNavigate();

    const formatTimeTo12Hour = (time) => {
        let [hours, minutes] = time.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    };

    const formatTimeTo24Hour = (time) => {
        let [hours, minutesWithPeriod] = time.split(':');
        const [minutes, period] = minutesWithPeriod.split(' ');
        hours = period === 'PM' && hours < 12 ? parseInt(hours) + 12 : hours;
        hours = period === 'AM' && hours === '12' ? '00' : hours;
        return `${hours}:${minutes}`;
    };

    const sendEmailNotification = async (applicant, date, time, email, link) => {
        const subject = `Interview Scheduled with ${applicant}`;
        const text = `Dear ${applicant},

Your interview is scheduled for ${date} at ${formatTimeTo12Hour(time)}.

Please join the meeting using the following link: ${link}

About Sylicon Software Pvt Ltd:
Sylicon Software Pvt Ltd is a leading provider of cutting-edge technology solutions that empower businesses to reach their full potential. We are committed to innovation, quality, and customer satisfaction.

Thank you, and we look forward to your interview.

With regards,
HR, Sylicon Software Pvt Ltd
BTM Layout`;

        try {
            await axios.post('http://localhost:5000/send-email', {
                to: email,
                subject,
                text
            });
            alert('Email sent successfully');
        } catch (error) {
            alert('Failed to send email');
        }
    };

    const handleEditClick = (interview) => {
        setEditingInterview(interview.id);
        setEditForm({
            date: interview.date,
            time: interview.time,
            email: interview.email,
            link: interview.link
        });
    };

    const handleSaveClick = (id) => {
        setInterviews(interviews.map(interview => 
            interview.id === id ? { ...interview, ...editForm } : interview
        ));
        setEditingInterview(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        if (name === 'time') {
            // Convert to 24-hour format for processing
            setEditForm(prevForm => ({
                ...prevForm,
                time: formatTimeTo24Hour(value)
            }));
        } else {
            setEditForm(prevForm => ({
                ...prevForm,
                [name]: value
            }));
        }
    };

    return (
        <div className="unique-interview-container">
            <h2 className='interview-title'>Interview Scheduling</h2>
            <ul className="unique-interview-list">
                {interviews.map((interview) => (
                    <li key={interview.id} className="unique-interview-item">
                        <h3>{interview.applicant}</h3>
                        <div className="details">
                            {editingInterview === interview.id ? (
                                <div className="edit-form-container">
                                    <label>Date: <input type="date" name="date" value={editForm.date} onChange={handleChange} /></label>
                                    <label>
                                        Time: 
                                        <input 
                                            type="time" 
                                            name="time" 
                                            value={formatTimeTo12Hour(editForm.time)} 
                                            onChange={handleTimeChange} 
                                            step="300"
                                        />
                                    </label>
                                    <label>Email: <input type="email" name="email" value={editForm.email} onChange={handleChange} /></label>
                                    <label>Link: <input type="url" name="link" value={editForm.link} onChange={handleChange} /></label>
                                    <button className="unique-save-btn" onClick={() => handleSaveClick(interview.id)}>Save</button>
                                </div>
                            ) : (
                                <div>
                                    <label>Date: {interview.date}</label>
                                    <label>Time: {formatTimeTo12Hour(interview.time)}</label>
                                    <label>Email: {interview.email}</label>
                                    <label>Link: <a href={interview.link}>Join Interview</a></label>
                                    <div className="unique-button-group">
                                        <button className="unique-edit-btn" onClick={() => handleEditClick(interview)}>Edit</button>
                                        <button className="unique-send-email-btn" onClick={() => sendEmailNotification(interview.applicant, interview.date, interview.time, interview.email, interview.link)}>Send Email</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="unique-button-container">
                <button className="unique-back-btn" onClick={() => navigate('/')}>Back</button>
            </div>
        </div>
    );
};

export default InterviewScheduling;
