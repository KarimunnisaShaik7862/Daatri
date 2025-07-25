import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        whatsappNumber: '',
        bloodGroup: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', isError: false });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear any error messages when user starts typing
        setMessage({ text: '', isError: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Keep the existing functionality but ensure proper date formatting
            // This ensures the date is stored correctly in MongoDB
            const formattedData = {
                ...formData,
                // Keep the date format as is - the server will handle it
                dateOfBirth: formData.dateOfBirth
            };

            const response = await axios.post('http://localhost:5000/api/users', formattedData);
            setMessage({ text: 'User details submitted successfully', isError: false });
            setFormData({
                name: '',
                email: '',
                dateOfBirth: '',
                phoneNumber: '',
                whatsappNumber: '',
                bloodGroup: ''
            });
        } catch (error) {
            // Handle specific error messages from the backend
            const errorMessage = error.response?.data?.error || 'Failed to submit user details. Please try again.';
            setMessage({ text: errorMessage, isError: true });
        } finally {
            setSubmitting(false);
        }
    };

    // Handler to prevent clicks inside the form from closing the modal
    const handleContainerClick = (e) => {
        if (e.target.className === 'Register-container') {
            onClose();
        }
    };

    return (
        <div className="Register-container" onClick={handleContainerClick}>
            <div className="Register">
                <button className="close-button" onClick={onClose}>×</button>
                <form className="user-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="example@mail.com" 
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\.[a-z]{2,}" 
                            title="Please enter a valid email address" 
                            required 
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth:</label>
                        <input 
                            type="date" 
                            name="dateOfBirth" 
                            value={formData.dateOfBirth} 
                            onChange={handleChange} 
                            required 
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input 
                            type="text" 
                            name="phoneNumber" 
                            value={formData.phoneNumber} 
                            onChange={handleChange} 
                            pattern="\d{10}" 
                            title="Please enter exactly 10 digits" 
                            required 
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group">
                        <label>WhatsApp Number:</label>
                        <input 
                            type="text" 
                            name="whatsappNumber" 
                            value={formData.whatsappNumber} 
                            onChange={handleChange} 
                            pattern="\d{10}" 
                            title="Please enter exactly 10 digits" 
                            required 
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group">
                        <label>Blood Group:</label>
                        <select 
                            name="bloodGroup" 
                            value={formData.bloodGroup} 
                            onChange={handleChange} 
                            required
                            autoComplete="off"
                        >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                    <button type="submit" disabled={submitting}>Submit</button>
                    {submitting && <p>Submitting...</p>}
                </form>
                {message.text && (
                    <p style={{ color: message.isError ? 'red' : 'green' }}>
                        {message.text}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Register;