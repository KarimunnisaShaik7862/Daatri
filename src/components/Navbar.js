// Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import logo from './Datri logo.png'; // Update this path accordingly
import Register from './Register'; // Import the Register component

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // State to control Register form visibility
  const navigate = useNavigate(); // Hook for navigation

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleRegister = () => {
    setIsRegisterOpen(!isRegisterOpen); // Toggle Register form visibility
    // Add or remove a class to the body to blur the background when the register form is open
    if (!isRegisterOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
    }
  };

  const openVolunteerPage = () => {
    navigate('/volunteer'); // Redirect to the Volunteer page using useNavigate
    setIsMenuOpen(false); // Optionally close the menu
  };

  const closeRegister = () => {
    setIsRegisterOpen(false); // Close Register form when the user is done
    document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
  };

  const navigateToHunger = () => {
    navigate('/hunger'); // Navigate to the Hunger page
    setIsMenuOpen(false); // Optionally close the menu
  };

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
        <div className="topbar-right">
          <span className="topbar-item" onClick={toggleRegister}>Register</span> {/* Toggle Register form */}
          <span className="topbar-item" onClick={navigateToHunger}>Donate</span> {/* Navigate to Hunger page */}
          <span className="topbar-item" onClick={openVolunteerPage}>Volunteer</span> {/* Redirect to Volunteer page */}
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <button className="navbar-toggle" onClick={toggleMenu}>
          &#9776; {/* Unicode character for the hamburger icon */}
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/home" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/gallery" onClick={toggleMenu}>Gallery</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
        </ul>
      </nav>

      {/* Register Form */}
      {isRegisterOpen && <Register onClose={closeRegister} />} {/* Show Register form if isRegisterOpen is true */}
    </>
  );
};

export default Navbar;