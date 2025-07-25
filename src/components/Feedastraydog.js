import React, { useState } from 'react';
import './Feedastraydog.css';
import donateImage1 from './Feedastraydog.jpg';
import qrCodeImage from './qr code.jpg';

const FeedAStrayDog = () => {
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
  const [fileError, setFileError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRCodePage, setShowQRCodePage] = useState(false);
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.com$/.test(email);
  };

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setCaptchaError('');

    if (name === 'foodCount') {
      const foodCount = parseInt(value, 10);
      const totalAmount = foodCount * 20;
      setFormData({
        ...formData,
        foodCount: value,
        totalAmount: totalAmount || '',
      });
    } else if (name === 'phoneNumber') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 10) {
        setFormData({
          ...formData,
          phoneNumber: digits,
        });
      }
    } else if (name === 'donorEmail') {
      setFormData({
        ...formData,
        donorEmail: value,
      });
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid .com email address');
      } else {
        setEmailError('');
        checkEmailUniqueness(value);
      }
    } else if (name === 'captcha') {
      setFormData({
        ...formData,
        captcha: value,
      });
      setCaptchaError('');
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const checkEmailUniqueness = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/straydog/check-email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      if (data.exists) {
        setEmailError('This email is already used');
      }
    } catch (err) {
      console.error('Error checking email:', err);
    }
  };

  const handleConfirm = () => {
    if (!formData.donorName || !formData.donorEmail || !formData.phoneNumber || 
        !formData.parcelName || !formData.foodCount || !formData.birthdate) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }

    if (!validateEmail(formData.donorEmail)) {
      setError('Please enter a valid .com email address');
      return;
    }

    const newCaptcha = generateCaptcha();
    setGeneratedCaptcha(newCaptcha);
    setShowQRCodePage(true);
  };

  const handleBack = () => {
    setShowQRCodePage(false);
    setFormData({
      ...formData,
      file: null,
      captcha: ''
    });
    setFileError('');
    setCaptchaError('');
  };
   
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFileError('Please upload an image file');
        setFormData({
          ...formData,
          file: null,
        });
        return;
      }
      setFormData({
        ...formData,
        file: file,
      });
      setFileError('');
    } else {
      setFileError('Please select a file');
      setFormData({
        ...formData,
        file: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.file) {
      setFileError('Please select a file');
      setIsSubmitting(false);
      return;
    }

    if (formData.captcha !== generatedCaptcha) {
      setCaptchaError('Invalid CAPTCHA');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      const uniqueId = `${formData.donorName.replace(/\s+/g, '')}_${generatedCaptcha}`;
      
      Object.keys(formData).forEach(key => {
        if (key === 'file') {
          formDataToSend.append('file', formData.file);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      formDataToSend.append('uniqueId', uniqueId);

      const response = await fetch('http://localhost:5000/api/straydog/donate', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Donation successful!');
        window.location.reload();
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="donate-container">
      <div className="image-section">
        <img src={donateImage1} alt="Feed a stray dog" className="homeless-image" />
      </div>
      <div className="form-section">
        {error && <div className="error-message">{error}</div>}
        <form className="donate-form" onSubmit={handleSubmit}>
          {!showQRCodePage ? (
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
                    autoComplete="off"
                    required
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
                    autoComplete="off"
                    required
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
                    autoComplete="off"
                    required
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
                    autoComplete="off"
                    required
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
                    autoComplete="off"
                    required
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
                    autoComplete="off"
                    required
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
                    autoComplete="off"
                    readOnly
                  />
                </div>
              </div>
              <div className="center-button">
                <button 
                  type="button" 
                  className="confirm-btn"
                  onClick={handleConfirm}
                >
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
                  accept="image/*"
                  required
                />
                {fileError && <div className="error-message file-error">{fileError}</div>}
              </div>

              <div className="captcha-section">
                <div className="captcha-display">{generatedCaptcha}</div>
                <input
                  type="text"
                  name="captcha"
                  placeholder="Enter CAPTCHA"
                  value={formData.captcha}
                  onChange={handleInputChange}
                  className="captcha-input wider-captcha"
                  autoComplete="off"
                  required
                />
                {captchaError && <div className="error-message captcha-error">{captchaError}</div>}
              </div>
              
              <div className="button-group">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={isSubmitting || !formData.file || error}
                >
                  {isSubmitting ? 'Processing...' : 'Donate Now'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedAStrayDog;