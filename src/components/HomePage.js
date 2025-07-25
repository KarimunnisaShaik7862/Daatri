// HomePage.js
import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Hunger from './Hunger';
import TheProblem from './TheProblem';
import NourishmentProcess from './NourishmentProcess';
import Counter from './Counter';
import Footer from './Footer'; // Added Footer import

// Import images
import img1 from './1.jpg';
import img2 from './2.jpg';
import img3 from './3.jpg';
import img4 from './4.jpg';
import aboutImage from './about.jpg';

const HomePage = () => {
  const images = [img1, img2, img3, img4];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <div className="homepage-container">
      {/* Image Slider */}
      <div className="image-slider">
        <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
      </div>

      {/* About Us Section */}
      <div className="about-us-section">
        <img src={aboutImage} alt="About Us" className="about-image" />
        <div className="about-text-container">
          <h2 className="about-heading">About Us</h2>
          <p className="about-text">
            We envision a world where birthdays are celebrated by giving back and spreading kindness to those in need. Our mission is to transform the joy of birthdays into an opportunity for positive change. By connecting generous individuals with underprivileged communities, we ensure that birthday donations provide essential resources like food and clothing to those who need them most.
          </p>
          <p className="about-text">
            Our platform encourages individuals to reimagine their birthday celebrations as a way to make a lasting impact on those less fortunate. We believe that by turning personal milestones into moments of giving, we can foster a culture of empathy and gratitude. Each birthday donation not only addresses immediate needs but also contributes to long-term development, offering education, healthcare, and support for sustainable living.
          </p>
        </div>
      </div>

      {/* Insert TheProblem Component */}
      <div className="problem-container">
        <TheProblem />
      </div>

      {/* Insert Hunger Component */}
      <div className="hunger-container">
        <Hunger />
      </div>

      {/* Insert NourishmentProcess Component */}
      <div className="nourishment-container">
        <NourishmentProcess />
      </div>

      {/* Insert Counter Component */}
      <div className="counter">
        <Counter />
      </div>

      {/* Added Footer Component */}
      <Footer />
    </div>
  );
};

export default HomePage;