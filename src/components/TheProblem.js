import React from 'react';
import './TheProblem.css';

const TheProblem = () => {
  const problems = [
    {
      image: 'https://www.actionagainsthunger.org/app/uploads/2022/09/Week_1_-_A_portrait_of_Halima_and_her_mother_Amran_after_a_screening-scaled-aspect-ratio-1920-1040.jpg', // Replace with direct image URL
      text: 'Hunger causes health issues and weakens people, especially kids.',
    },
    {
      image: 'https://image.cnbcfm.com/api/v1/image/104152609-AP_16286553629960.jpg?v=1529473530&w=1858&h=1045&vtcrop=y', // Replace with direct image URL
      text: 'Every 10 seconds, a child dies from hunger.',
    },
    {
      image: 'https://newsmedia.tasnimnews.com/Tasnim/Uploaded/Image/1401/04/07/1401040709471759425592714.jpg', // Replace with direct image URL
      text: ' Children are suffering from stunted growth because their families cannot afford nutritious meals.',
    },
    {
      image: 'https://www.livemint.com/rf/Image-621x414/LiveMint/Period1/2015/05/28/Photos/tribals-kQW--621x414@LiveMint.jpg', // Replace with direct image URL
      text: 'One in every eight people sleeps hungry each night.',
    },
    {
      image: 'https://www.actionagainsthunger.org/app/uploads/2022/09/RUTF_photo.jpg', // Replace with direct image URL
      text: 'Families are forced to skip meals, leading to severe health issues and chronic diseases.',
    },
    {
      image: 'https://notestowomen.wordpress.com/wp-content/uploads/2017/05/indian_beggar_woman.jpg', // Replace with direct image URL
      text: '924 million hungry people in the world.',
    },
  ];

  return (
    <div className="problem-section">
      <h2 className="problem-title">The Problem</h2>
      <p className="problem-subtitle">
      Every meal that goes uneaten is a step away from the dream of a better future.
      </p>
      <div className="problem-grid">
        {problems.map((problem, index) => (
          <div key={index} className="problem-card">
            <img 
              src={problem.image} 
              alt={`Problem ${index + 1}`} 
              className="problem-image" 
              onError={(e) => e.target.style.display = 'none'} // Hide image if it fails to load
            />
            <p className="problem-text">{problem.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheProblem;
