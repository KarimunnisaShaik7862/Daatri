import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import contactImage from './contact.jpg';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError('');
    setSuccess('');

    // Validation
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits.');
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[com]{3}$/.test(formData.email)) {
      setError('Email must be a valid .com address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.error) {
        if (result.error === 'Phone number already exists') {
          setError('This phone number is already in use.');
        } else {
          setError(result.error);
        }
      } else {
        setSuccess('Message sent successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
        setTimeout(() => window.location.reload(), 1000); // Refresh the page after 1 second
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      {/* Responsive Image */}
      <div style={{ backgroundImage: `url(${contactImage})`, height: '300px', backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '20px' }}></div>

      {/* Main Content */}
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Contact Information Section */}
          <div style={{ flex: 1, padding: '20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#111439' }}>Contact Information</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '10px', fontSize: '20px', color: '#2E8B57' }} />
              <p>SRKR ENGINEERING COLLEGE</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '10px', fontSize: '20px', color: '#2E8B57' }} />
              <p>8897272390</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px', fontSize: '20px', color: '#2E8B57' }} />
              <p>datri.official2024@gmail.com</p>
            </div>
          </div>

          {/* Send Us a Message Section */}
          <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '15px', boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#111439' }}>Send Us a Message</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={{ padding: '10px', borderRadius: '20px', border: '1px solid #ddd', flex: 1, width: '70%' }}
                  autoComplete="off"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={{ padding: '10px', borderRadius: '20px', border: '1px solid #ddd', flex: 1, width: '70%' }}
                  autoComplete="off"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ padding: '10px', borderRadius: '20px', border: '1px solid #ddd', width: '95%', marginTop: '10px' }}
                autoComplete="off"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                style={{ padding: '10px', borderRadius: '20px', border: '1px solid #ddd', width: '95%', marginTop: '10px' }}
                autoComplete="off"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                style={{ padding: '10px', borderRadius: '20px', border: '1px solid #ddd', width: '95%', height: '150px', marginTop: '10px' }}
                autoComplete="off"
              />
              <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#2E8B57', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', marginTop: '10px' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
