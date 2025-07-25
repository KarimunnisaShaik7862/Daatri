import React, { useState, useEffect } from 'react';
import './Educateachild.css';
import donateImage1 from './educatechild.jpg';
import qrCodeImage from './qr code.jpg';
import axios from 'axios';

const EducateChildDonate = () => {
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    phoneNumber: '',
    parcelName: '',
    foodCount: '',
    totalAmount: '',
    birthdate: '',
    instagramID: '',
    captcha: '',
    file: null,
  });

  const [errorMessages, setErrorMessages] = useState({
    emailError: '',
    phoneError: '',
    fileError: '',
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');

  const checkEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/Birthday-wishes/api/check-email/${email}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  useEffect(() => {
    const isComplete = 
      formData.donorName &&
      formData.donorEmail &&
      formData.phoneNumber &&
      formData.parcelName &&
      formData.foodCount &&
      formData.totalAmount &&
      formData.birthdate &&
      !errorMessages.emailError &&
      !errorMessages.phoneError;
    
    setIsFormValid(isComplete);
  }, [formData, errorMessages]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'foodCount') {
      const foodCount = parseInt(value, 10);
      const totalAmount = foodCount * 200;
      setFormData({
        ...formData,
        foodCount: value,
        totalAmount: totalAmount || '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (name === 'donorEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[com]+$/;
      if (!emailRegex.test(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          emailError: 'Please enter a valid email address ending with .com',
        }));
      } else {
        const isEmailExists = await checkEmail(value);
        if (isEmailExists) {
          setErrorMessages((prevState) => ({
            ...prevState,
            emailError: 'This email is already in use.',
          }));
        } else {
          setErrorMessages((prevState) => ({
            ...prevState,
            emailError: '',
          }));
        }
      }
    }

    if (name === 'phoneNumber') {
      if (value.length !== 10 || isNaN(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          phoneError: 'Phone number must be exactly 10 digits.',
        }));
      } else {
        setErrorMessages((prevState) => ({
          ...prevState,
          phoneError: '',
        }));
      }
    }
  };

  const handleConfirm = () => {
    if (isFormValid) {
      setShowQRCode(true);
      const randomCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCaptchaValue(randomCaptcha);
    } else {
      alert('Please fill all required fields correctly.');
    }
  };

  const handleBack = () => {
    setShowQRCode(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setErrorMessages((prevState) => ({
        ...prevState,
        fileError: '',
      }));
    } else {
      setFormData({ ...formData, file: null });
      setErrorMessages((prevState) => ({
        ...prevState,
        fileError: 'Please select an image.',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.captcha !== captchaValue) {
      alert('Invalid CAPTCHA! Please try again.');
      return;
    }

    if (!errorMessages.emailError && !errorMessages.phoneError && !errorMessages.fileError) {
      const formDataToSend = new FormData();
      const uniqueId = `${formData.donorName}_${formData.captcha}`;
      
      formDataToSend.append('uniqueId', uniqueId);
      formDataToSend.append('donorName', formData.donorName);
      formDataToSend.append('donorEmail', formData.donorEmail);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('parcelName', formData.parcelName);
      formDataToSend.append('foodCount', formData.foodCount);
      formDataToSend.append('totalAmount', formData.totalAmount);
      formDataToSend.append('birthdate', formData.birthdate);
      formDataToSend.append('instagramID', formData.instagramID);
      formDataToSend.append('captcha', formData.captcha);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      try {
        const response = await axios.post('http://localhost:5000/Birthday-wishes/api/donate', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          alert('Donation completed successfully!');
          window.location.reload();
        } else {
          alert(response.data.message || 'An error occurred');
        }
      } catch (error) {
        console.error('Error submitting donation:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Please fix the errors in the form.');
    }
  };

  return (
    <div className="donate-container">
      <div className="image-section">
        <img src={donateImage1} alt="Educate Child" className="educate-child-image" />
      </div>
      <div className="form-section">
        <form className="donate-form" onSubmit={handleSubmit}>
          {!showQRCode ? (
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
                  {errorMessages.emailError && <p className="error-message">{errorMessages.emailError}</p>}
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
              {errorMessages.phoneError && <p className="error-message">{errorMessages.phoneError}</p>}
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
                <button 
                  type="button" 
                  className="confirm-btn"
                  onClick={handleConfirm}
                  disabled={!isFormValid}
                >
                  Confirm Details
                </button>
              </div>
            </>
          ) : (
            <div className="confirmation-section">
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
                {errorMessages.fileError && <p className="error-message">{errorMessages.fileError}</p>}
              </div>

              <div className="captcha-section">
                <label htmlFor="captcha">Enter CAPTCHA: {captchaValue}</label>
                <input
                  type="text"
                  id="captcha"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                  placeholder="Enter the CAPTCHA shown above"
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
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EducateChildDonate;