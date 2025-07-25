import React from 'react';
import './NourishmentProcess.css';
import nourishmentImage from './process.jpg';

const NourishmentProcess = () => {
  return (
    <div className="nourishment-process">
      <h1 className="title">Process Of Nourishment</h1>
      <p className="description">
        From clean kitchens to caring hands, each meal is a journey of hope for those in need.
      </p>
      <p className="subtitle">Here’s How The Magic Happens!</p>
      
      <img 
        src={nourishmentImage} 
        alt="Process of Nourishment" 
        className="nourishment-image" 
      />
    </div>
  );
};

export default NourishmentProcess;
