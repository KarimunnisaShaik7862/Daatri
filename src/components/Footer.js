import React from "react";
import "./Footer.css";
import datriLogo from "./Datri logo.png";  // Import the logo image

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <img 
            src={datriLogo}  // Use the imported image
            alt="DATRI Logo" 
            className="footer-logo" 
          />
          <p className="tagline">Providing food for those in need.</p>
          <div className="social-buttons">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-button instagram"
            >
              Find us on Instagram
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-button linkedin"
            >
              Find us on LinkedIn
            </a>
          </div>
        </div>

        {/* Center Section */}
        <div className="footer-center">
          <h3 className="section-title">Quick Links</h3>
          <div className="footer-links">
            <a href="/home" className="footer-link">Home</a>
            <a href="/about" className="footer-link">About</a>
            <a href="/gallery" className="footer-link">Gallery</a>
            <a href="/contact" className="footer-link">Contact</a>
            <a href="/Donate" className="footer-link">Donate</a>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <h3 className="section-title">Contact Information</h3>
          <p className="contact-info">SRKR Engineering College, JP Road, Bhimavaram</p>
          <p className="contact-info">
            Email:{" "}
            <a href="mailto:datri.official2024@gmail.com" className="email-link">
              datri.official2024@gmail.com
            </a>
          </p>
          <p className="contact-info">Phone: 8341686359</p>
          <div className="disclaimer">
            <h4 className="section-title">Disclaimer:</h4>
            <p>The DATRI Foundation is located in Bhimavaram only and does not have branches.</p>
            <p>The foundation does not solicit funds via phone calls or door-to-door visits.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;