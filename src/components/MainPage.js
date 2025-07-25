import React from 'react';
import image1 from './image1.png'; // Adjust the path as necessary
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page" style={{ backgroundImage: `url(${image1})` }}>
      <div className="main-content">
        <h1>Welcome to MyWebsite</h1>
        <p>Discover amazing content and features by navigating through the website.</p>
      </div>
    </div>
  );
};

export default MainPage;
