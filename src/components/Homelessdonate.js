import React, { useState, useEffect } from 'react';
import './Homelessdonate.css';
import donateImage1 from './homeless.jpg';
import qrCodeImage from './munni qrcode.jpg';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

const HomelessDonate = () => {
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
    captcha: '',
    transactionId: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [captchaText, setCaptchaText] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [extractionMessage, setExtractionMessage] = useState('');
  const [detectedPaymentApp, setDetectedPaymentApp] = useState(null);
  const [screenshotType, setScreenshotType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate random CAPTCHA text
  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Validate phone number
  const validatePhoneNumber = (number) => {
    return /^\d{10}$/.test(number);
  };

  // Validate email (.com only)
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.com$/.test(email);
  };

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: '' });

    if (name === 'foodCount') {
      const foodCount = parseInt(value, 10);
      const totalAmount = foodCount > 0 ? foodCount * 25 : '';
      setFormData({ ...formData, foodCount: value, totalAmount });
    } else if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else if (name === 'donorEmail') {
      setFormData({ ...formData, [name]: value });
      if (value && !validateEmail(value)) {
        setErrors({ ...errors, [name]: 'Please enter a valid .com email address' });
      }
    } else if (name === 'transactionId') {
      setFormData({ ...formData, [name]: value });
      // Clear any previous transaction ID errors
      setErrors({ ...errors, [name]: '' });
      
      // Check for duplicate transaction ID if it's not empty
      if (value.trim()) {
        checkTransactionId(value);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Check if transaction ID already exists
  const checkTransactionId = async (transactionId) => {
    try {
      const response = await fetch('http://localhost:5000/check-transaction-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      });

      const result = await response.json();
      
      if (!response.ok && result.error) {
        setErrors({ ...errors, transactionId: result.error });
      }
    } catch (error) {
      console.error('Error checking transaction ID:', error);
    }
  };

  // Improved handleFileChange function with better payment app detection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFormData({ ...formData, file });
    setFileName(file ? file.name : '');
    
    // Clear any previous file or transaction ID errors and messages
    setErrors({ ...errors, file: '', transactionId: '' });
    setExtractionMessage('');
    
    // Reset app detection state
    setDetectedPaymentApp(null);
    setScreenshotType(null);
    
    // Pre-detect payment app from filename for immediate user feedback
    if (file) {
      const fileName = file.name.toLowerCase();
      
      if (fileName.includes('bhim')) {
        setDetectedPaymentApp('BHIM');
        console.log('Pre-detected BHIM from filename');
      } 
      // Enhanced Google Pay detection from filename
      else if (fileName.includes('google') || fileName.includes('gpay') || 
              fileName.includes('g pay') || fileName.includes('googlepay')) {
        setDetectedPaymentApp('Google Pay');
        console.log('Pre-detected Google Pay from filename');
      }
      else if (fileName.includes('paytm')) {
        setDetectedPaymentApp('Paytm');
        console.log('Pre-detected Paytm from filename');
      } 
      else if (fileName.includes('phonepe') || fileName.includes('phone pe') || fileName.includes('phonepay')) {
        setDetectedPaymentApp('PhonePe');
        console.log('Pre-detected PhonePe from filename');
      }
      
      // Now extract transaction ID using the server
      extractTransactionIdFromFile(file);
    }
  };
  
  // Extract transaction ID from the uploaded screenshot with improved Google Pay detection
  const extractTransactionIdFromFile = async (file) => {
    if (!file) {
      return;
    }

    setIsProcessingImage(true);
    
    try {
      const formPayload = new FormData();
      formPayload.append('file', file);
      
      const response = await fetch('http://localhost:5000/extract-transaction-id', {
        method: 'POST',
        body: formPayload,
      });

      const result = await response.json();
      
      console.log("Server extraction result:", result);
      
      // Update the detected payment app and screenshot type based on server response
      if (result.paymentApp) {
        setDetectedPaymentApp(result.paymentApp);
        if (result.appUIType) {
          setScreenshotType(result.appUIType);
        }
        console.log(`Server detected app: ${result.paymentApp}, type: ${result.appUIType || 'Standard'}`);
      }
      
      if (response.ok) {
        // Google Pay handling - improved to match the screenshots you provided
        if (result.paymentApp === 'Google Pay') {
          if (result.transactionId) {
            setFormData(prevState => ({...prevState, transactionId: result.transactionId}));
            setErrors(prevErrors => ({...prevErrors, transactionId: ''}));
            setExtractionMessage('Google Pay Transaction ID successfully extracted!');
          } else {
            setFormData(prevState => ({...prevState, transactionId: ''}));
            setErrors(prevErrors => ({...prevErrors, transactionId: 'Please enter transaction ID manually'}));
            setExtractionMessage('Transaction ID not found in the Google Pay screenshot. Please enter manually.');
          }
        }
        // BHIM app handling
        else if (result.paymentApp === 'BHIM' && result.transactionId) {
          setFormData(prevState => ({...prevState, transactionId: result.transactionId}));
          setErrors(prevErrors => ({...prevErrors, transactionId: ''}));
          setExtractionMessage('BHIM Transaction ID successfully extracted!');
        } 
        // PhonePe handling
        else if (result.paymentApp === 'PhonePe') {
          if (result.transactionId) {
            setFormData(prevState => ({...prevState, transactionId: result.transactionId}));
            setErrors(prevErrors => ({...prevErrors, transactionId: ''}));
            setExtractionMessage('PhonePe Transaction ID successfully extracted!');
          } else {
            setFormData(prevState => ({...prevState, transactionId: ''}));
            setErrors(prevErrors => ({...prevErrors, transactionId: 'Please enter transaction ID manually'}));
            setExtractionMessage('Transaction ID not found in the PhonePe screenshot. Please enter manually.');
          }
        }
        // Paytm Type1 handling (receipt screen)
        else if (result.paymentApp === 'Paytm' && result.appUIType === 'Type1') {
          if (result.transactionId) {
            setFormData(prevState => ({...prevState, transactionId: result.transactionId}));
            setErrors(prevErrors => ({...prevErrors, transactionId: ''}));
            setExtractionMessage('Paytm Reference Number successfully extracted!');
          } else {
            // For Type1 without reference number, request manual entry
            setFormData(prevState => ({...prevState, transactionId: ''}));
            setErrors(prevErrors => ({
              ...prevErrors, 
              transactionId: 'Please enter transaction ID manually'
            }));
            setExtractionMessage('For this Paytm receipt, please enter the Reference Number manually.');
          }
        } 
        // Paytm Type2 handling (Sent Successfully screen)
        else if (result.paymentApp === 'Paytm' && result.appUIType === 'Type2') {
          if (result.transactionId) {
            setFormData(prevState => ({...prevState, transactionId: result.transactionId}));
            setErrors(prevErrors => ({...prevErrors, transactionId: ''}));
            setExtractionMessage('Paytm Reference Number successfully extracted!');
          } else {
            setFormData(prevState => ({...prevState, transactionId: ''}));
            setErrors(prevErrors => ({
              ...prevErrors, 
              transactionId: 'Please enter UPI Reference Number manually'
            }));
            setExtractionMessage('UPI Reference Number not found. Please check at the bottom of your screenshot and enter manually.');
          }
        }
        // Other payment apps with successful extraction
        else if (result.transactionId) {
          setFormData(prevState => ({...prevState, transactionId: result.transactionId}));
          setErrors(prevErrors => ({...prevErrors, transactionId: ''}));
          setExtractionMessage(result.message || 'Transaction ID successfully extracted!');
        }
        // Handle case where no transaction ID was found
        else {
          let errorMessage = 'Please enter transaction ID manually';
          let extractionMsg = result.message || 'Transaction ID not found in the screenshot. Please enter manually.';
          
          setErrors(prevErrors => ({
            ...prevErrors, 
            transactionId: errorMessage
          }));
          setExtractionMessage(extractionMsg);
        }
      } else if (!response.ok && result.error) {
        // Show error if the ID is already used
        setErrors(prevErrors => ({...prevErrors, transactionId: result.error}));
        setExtractionMessage('');
      }
    } catch (error) {
      console.error('Error extracting transaction ID:', error);
      setErrors(prevErrors => ({
        ...prevErrors,
        transactionId: 'Please enter transaction ID manually'
      }));
      setExtractionMessage('Error processing image. Please enter transaction ID manually.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Handle confirm button click
  const handleConfirm = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate required fields
    const requiredFields = ['donorName', 'donorEmail', 'phoneNumber', 'parcelName', 'foodCount', 'birthdate'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate phone number
    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    // Validate email
    if (formData.donorEmail && !validateEmail(formData.donorEmail)) {
      newErrors.donorEmail = 'Please enter a valid .com email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowConfirmation(true);
  };

  // Handle form submission with improved error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Validate captcha
      if (formData.captcha !== captchaText) {
        setErrors({ ...errors, captcha: 'Invalid CAPTCHA' });
        setIsSubmitting(false);
        return;
      }

      // Validate transaction ID is provided
      if (!formData.transactionId) {
        setErrors({ ...errors, transactionId: 'Transaction ID is required' });
        setIsSubmitting(false);
        return;
      }

      // Validate file is uploaded
      if (!formData.file) {
        setErrors({ ...errors, file: 'Please upload a payment screenshot' });
        setIsSubmitting(false);
        return;
      }

      const formPayload = new FormData();
      const uniqueId = `${formData.donorName}_${captchaText}_${Date.now()}`;
      
      Object.keys(formData).forEach((key) => {
        if (key !== 'file') {
          formPayload.append(key, formData[key]);
        }
      });
      
      // Append file with a more descriptive name if possible
      const fileExt = formData.file.name.split('.').pop();
      const paymentApp = detectedPaymentApp || 'payment';
      const betterFileName = `${formData.donorName}_${formData.totalAmount}_${paymentApp}.${fileExt}`;
      
      // Create a new file object with a better name
      const renamedFile = new File([formData.file], betterFileName, { type: formData.file.type });
      formPayload.append('file', renamedFile);
      
      formPayload.append('uniqueId', uniqueId);

      const response = await fetch('http://localhost:5000/donate', {
        method: 'POST',
        body: formPayload,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Donation successful!');
        window.location.reload();
      } else if (result.error === 'Email already exists') {
        setErrors({ ...errors, donorEmail: 'This email is already used.' });
      } else if (result.error === 'This transaction ID has already been used.') {
        setErrors({ ...errors, transactionId: result.error });
      } else if (result.error && result.error.includes('Amount not matched!')) {
        alert(result.error);
      } else {
        alert('Error in submission: ' + (result.error || 'Please check your form and try again.'));
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get transaction ID field label based on payment app and screenshot type
  const getTransactionIdLabel = () => {
    if (!detectedPaymentApp) return "Transaction ID";
    
    switch(detectedPaymentApp) {
      case 'PhonePe':
        return "PhonePe Transaction ID";
      case 'Google Pay':
        return "Google Pay UPI ID";
      case 'Paytm':
        return "Paytm Reference Number";
      case 'BHIM':
        return "BHIM Transaction ID";
      default:
        return "Transaction ID";
    }
  };

  return (
    <div className="donate-container">
      <div className="image-section">
        <img src={donateImage1} alt="Homeless help" className="homeless-image" />
      </div>
      <div className="form-section">
        <form className="donate-form" onSubmit={showConfirmation ? handleSubmit : handleConfirm}>
          {!showConfirmation ? (
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
                  {errors.donorName && <span className="error-message">{errors.donorName}</span>}
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
                  {errors.donorEmail && <span className="error-message">{errors.donorEmail}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                  />
                  {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
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
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalAmount">Total Amount (₹)</label>
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

              <div className="button-group">
                <button type="submit" className="submit-btn">Confirm</button>
              </div>
            </>
          ) : (
            <>
              <div className="qr-code-container">
                <h3>Scan to Donate ₹{formData.totalAmount}</h3>
                <img src={qrCodeImage} alt="QR Code" className="qr-code-image" />
                <p className="amount-instruction">Please pay exactly ₹{formData.totalAmount} and upload the screenshot.</p>
              </div>

              <div className="upload-section">
                <label>Upload Receipt</label>
                <div className="file-input-container">
                  <div className="file-input-button">Choose File</div>
                  <input
                    type="file"
                    id="fileUpload"
                    name="file"
                    onChange={handleFileChange}
                    autoComplete="off"
                    accept="image/*"
                    required
                  />
                </div>
                {fileName && <div className="file-name">{fileName}</div>}
                {errors.file && <span className="error-message">{errors.file}</span>}
                {isProcessingImage && (
                  <div className="processing-indicator">
                    <FaSpinner className="spinner-icon" /> Processing screenshot...
                  </div>
                )}
                {detectedPaymentApp && !isProcessingImage && (
                  <div className="detected-app">
                    Detected payment app: {detectedPaymentApp}
                    {screenshotType && ` (${screenshotType})`}
                  </div>
                )}
              </div>

              {/* Improved verification container with better feedback */}
              <div className="verification-container">
                <div className="verification-row">
                  {/* Transaction ID Column - Enhanced with app-specific labels */}
                  <div className="verification-column">
                    <label className="verification-label">{getTransactionIdLabel()}</label>
                    <input
                      type="text"
                      id="transactionId"
                      name="transactionId"
                      placeholder={`Enter ${getTransactionIdLabel()}`}
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      className={`verification-input ${formData.transactionId ? 'has-value' : ''}`}
                      autoComplete="off"
                      required
                    />
                    {extractionMessage && !errors.transactionId && (
                      <div className="extraction-message success-message">
                        {extractionMessage}
                      </div>
                    )}
                    {errors.transactionId && (
                      <div className="error-message-container">
                        <span className="error-message">
                          {errors.transactionId}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* CAPTCHA Column */}
                  <div className="verification-column">
                    <div className="captcha-container">
                      <div className="captcha-header">
                        <span className="captcha-label">Enter CAPTCHA</span>
                        <div className="captcha-display">{captchaText}</div>
                      </div>
                      <input
                        type="text"
                        id="captcha"
                        name="captcha"
                        value={formData.captcha}
                        onChange={handleInputChange}
                        placeholder="Enter CAPTCHA"
                        className="verification-input"
                        required
                      />
                      {errors.captcha && (
                        <div className="error-message-container">
                          <span className="error-message">{errors.captcha}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-group">
                <button type="button" className="back-btn" onClick={() => setShowConfirmation(false)}>
                  <FaArrowLeft /> Back
                </button>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spinner-icon" /> Processing...
                    </>
                  ) : 'Submit'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default HomelessDonate;