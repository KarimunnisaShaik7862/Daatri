import React, { useState } from 'react';
import axios from 'axios';
import './VolunteerPage.css';
import volunteer1 from './volunteer 1.jpg';
import volunteer2 from './volunteer 2.jpg';

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    email: '',
    dateOfBirth: '',
    volunteerDuration: '',
    bloodDonor: '',
    bloodGroup: '',
    address: '',
    city: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    message: '',
    isError: false
  });

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phone: ''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    setValidationErrors({
      ...validationErrors,
      [name]: ''
    });

    if (name === 'phone') {
      if (value && !validatePhone(value)) {
        setValidationErrors(prev => ({
          ...prev,
          phone: 'Phone number must be 10 digits'
        }));
      }
    }

    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'Please enter a valid .com email address'
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: '', isError: false }); // Clear previous status

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      setValidationErrors(prev => ({
        ...prev,
        phone: 'Phone number must be 10 digits'
      }));
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setValidationErrors(prev => ({
        ...prev,
        email: 'Please enter a valid .com email address'
      }));
      return;
    }

    try {
      // Configure axios with timeout and headers
      const axiosConfig = {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Check if email exists
      try {
        const checkEmailResponse = await axios.get(
          `http://localhost:5000/api/volunteers/check-email/${formData.email}`,
          axiosConfig
        );
        
        if (checkEmailResponse.data.exists) {
          setValidationErrors(prev => ({
            ...prev,
            email: 'This email is already used'
          }));
          return;
        }
      } catch (emailCheckError) {
        console.error('Email check failed:', emailCheckError);
        // If email check fails, we'll assume it's a new email and continue
      }

      // Proceed with form submission
      const response = await axios.post(
        'http://localhost:5000/api/volunteers', 
        formData,
        axiosConfig
      );

      if (response.data) {
        setSubmitStatus({
          message: 'Thank you for volunteering! We will contact you soon.',
          isError: false
        });

        // Clear form
        setFormData({
          name: '',
          phone: '',
          gender: '',
          email: '',
          dateOfBirth: '',
          volunteerDuration: '',
          bloodDonor: '',
          bloodGroup: '',
          address: '',
          city: ''
        });

        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Submit error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.message || 'Server error. Please try again.';
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = 'Failed to submit form. Please try again.';
      }

      setSubmitStatus({
        message: errorMessage,
        isError: true
      });
    }
  };

  return (
    <div className="volunteer-container">
      <div className="header-section">
        <img className="volunteer-image-full" src={volunteer1} alt="Volunteer Image 1" />
        <h2 className="volunteer-heading">Join Us as a Volunteer!</h2>
      </div>

      <div className="content-layout">
        <div className="text-content">
          <img className="volunteer-image-side" src={volunteer2} alt="Volunteer Image 2" />
          <h2>A challenge may seem impossible when faced alone. But when forces join hands, that challenge seems like an opportunity to realize every dream.</h2>
          <p>
            Become a volunteer and join our mission to enhance the lives of those in our community. Your involvement allows us to provide nourishing meals to the homeless, offer essential supplies to families facing hardships, and promote education for children.
          </p>
          <p>
            Take action and make a difference—join us in our efforts today! Your contribution has the potential to transform lives, bringing support and care to those who need it most.
          </p>
        </div>

        <div className="form-layout">
          <form className="volunteer-form" onSubmit={handleSubmit} autoComplete="off">
            {submitStatus.message && (
              <div className={`status-message ${submitStatus.isError ? 'error' : 'success'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              autoComplete="off"
            />
            <div className="input-group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                autoComplete="off"
              />
              {validationErrors.phone && (
                <div className="error-message">{validationErrors.phone}</div>
              )}
            </div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              autoComplete="off"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div className="input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                autoComplete="off"
              />
              {validationErrors.email && (
                <div className="error-message">{validationErrors.email}</div>
              )}
            </div>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder="Date of Birth"
              required
              autoComplete="off"
            />
            <select
              name="volunteerDuration"
              value={formData.volunteerDuration}
              onChange={handleChange}
              required
              autoComplete="off"
            >
              <option value="">Volunteer Duration</option>
              <option value="1-month">1 Month</option>
              <option value="6-months">6 Months</option>
              <option value="1-year">1 Year</option>
              <option value="2-years">2 Years</option>
            </select>
            <select
              name="bloodDonor"
              value={formData.bloodDonor}
              onChange={handleChange}
              required
              autoComplete="off"
            >
              <option value="">Blood Donor</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              autoComplete="off"
            >
              <option value="">Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
              autoComplete="off"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              autoComplete="off"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VolunteerForm;