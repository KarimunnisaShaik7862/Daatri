import React, { useState } from 'react';
import './Wishvideo.css';
import donateImage1 from './wish video.jpg';
import qrCodeImage from './qr code.jpg';

const WishVideo = () => {
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    phoneNumber: '',
    parcelName: '',
    foodCount: '',
    totalAmount: '',
    birthdate: '',
    instagramID: '',
    file: null,
    captcha: ''
  });

  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showConfirmSection, setShowConfirmSection] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError('');

    if (name === 'foodCount') {
      const foodCount = parseInt(value, 10);
      const totalAmount = foodCount * 80;
      setFormData({
        ...formData,
        foodCount: value,
        totalAmount: totalAmount || '',
      });
    } else if (name === 'phoneNumber') {
      const phoneNumber = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        phoneNumber,
      });
    } else if (name === 'donorEmail') {
      setFormData({
        ...formData,
        donorEmail: value,
      });
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
      if (!emailRegex.test(value)) {
        setEmailError('Please enter a valid .com email address');
      } else {
        setEmailError('');
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const validateForm = () => {
    if (!formData.donorName || !formData.donorEmail || !formData.phoneNumber || 
        !formData.parcelName || !formData.foodCount || !formData.birthdate) {
      setError('Please fill in all required fields.');
      return false;
    }

    if (formData.phoneNumber.length !== 10) {
      setError('Phone number must be 10 digits.');
      return false;
    }

    if (!formData.donorEmail.toLowerCase().endsWith('.com')) {
      setError('Please enter a valid .com email address.');
      return false;
    }

    return true;
  };

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(captcha);
    return captcha;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      setShowConfirmSection(true);
      generateCaptcha();
    }
  };

  const handleBack = () => {
    setShowConfirmSection(false);
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/check-email/${email}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (formData.captcha !== captchaCode) {
      setError('Invalid CAPTCHA code');
      return;
    }

    const emailExists = await checkEmailExists(formData.donorEmail);
    if (emailExists) {
      setError('This email is already used.');
      return;
    }

    const submitData = new FormData();
    const uniqueId = `${formData.donorName}_${captchaCode}`;

    Object.keys(formData).forEach(key => {
      if (key === 'file') {
        if (formData.file) {
          submitData.append('receiptImage', formData.file);
        }
      } else {
        submitData.append(key, formData[key]);
      }
    });
    submitData.append('uniqueId', uniqueId);

    try {
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'An error occurred');
        return;
      }

      window.location.reload();
    } catch (error) {
      setError('Failed to submit donation');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="donate-container">
      <div className="image-section">
        <img src={donateImage1} alt="Homeless help" className="homeless-image" />
      </div>
      <div className="form-section">
        {error && <div className="error-message">{error}</div>}
        <form className="donate-form" onSubmit={handleSubmit}>
          {!showConfirmSection ? (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="donorName">Donor Name</label>
                  <input
                    type="text"
                    id="donorName"
                    name="donorName"
                    placeholder="Enter Donor Name"
                    value={formData.donorName}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="donorEmail">Donor Email</label>
                  <input
                    type="email"
                    id="donorEmail"
                    name="donorEmail"
                    placeholder="Enter Donor Email"
                    value={formData.donorEmail}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  />
                  {emailError && <div className="error-message">{emailError}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="birthdate">Birthdate</label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="instagramID">Instagram ID (Optional)</label>
                  <input
                    type="text"
                    id="instagramID"
                    name="instagramID"
                    placeholder="Enter Instagram ID"
                    value={formData.instagramID}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="parcelName">Parcel Name</label>
                  <input
                    type="text"
                    id="parcelName"
                    name="parcelName"
                    placeholder="Enter Parcel Name"
                    value={formData.parcelName}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="foodCount">Food Count</label>
                  <input
                    type="number"
                    id="foodCount"
                    name="foodCount"
                    placeholder="Enter Food Count"
                    value={formData.foodCount}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalAmount">Total Amount</label>
                  <input
                    type="number"
                    id="totalAmount"
                    name="totalAmount"
                    placeholder="Total Amount"
                    value={formData.totalAmount}
                    readOnly
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="center-button">
                <button type="button" className="confirm-btn" onClick={handleConfirm}>
                  Confirm Details
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="qr-code-container">
                <h3>Scan to Donate</h3>
                <img src={qrCodeImage} alt="QR Code" className="qr-code-image" />
              </div>
              
              <div className="upload-section">
                <label htmlFor="fileUpload">Upload Receipt</label>
                <input
                  type="file"
                  id="fileUpload"
                  name="file"
                  onChange={handleFileChange}
                  required
                  autoComplete="off"
                />
              </div>

              <div className="captcha-section">
                <div className="captcha-display">{captchaCode}</div>
                <input
                  type="text"
                  name="captcha"
                  placeholder="Enter CAPTCHA"
                  value={formData.captcha}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="button-group">
                <button type="button" className="back-btn" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" className="submit-btn">
                  Submit Donation
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default WishVideo;