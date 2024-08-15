import React, { useState } from 'react';
import axios from 'axios';
import './HomePage.css';
import image from './image1.png';

function HomePage() {
    const initialFormData = {
        name: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        whatsappNumber: '',
        bloodGroup: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.post('http://localhost:5000/api/users', formData);
            console.log(response.data);
            alert('User details submitted successfully');
            setFormData(initialFormData);
        } catch (error) {
            console.error('There was an error submitting the form!', error);
            alert('Failed to submit user details. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="HomePage">
            <div className="form-heading">
                <h1>Join Our Mission</h1>
                <p>Register today to be a part of our initiative to help the needy. Together, we can make a difference.</p>
            </div>
            <form className="user-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Date of Birth:</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>WhatsApp Number:</label>
                    <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={submitting}>Submit</button>
                {submitting && <p>Submitting...</p>}
            </form>
            <div className="right-image-container">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <img src={image} alt="Children" className="right-image" />
                <div className="shape shape-3"></div>
            </div>
        </div>
    );
}

export default HomePage;
