// Hunger.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hunger.css"; // Assuming you have a CSS file for styling

function Hunger() {
  const navigate = useNavigate();

  const handleHomelessDonateClick = () => {
    navigate('/homeless-donate');
  };

  const handleWishvideoClick = () => {
    navigate('/get-a-wish-video'); // Navigate to the route for Wishvideo
  };
  
  const handleEducateachildClick = () => {
    navigate('/Educate-a-child'); // Navigate to the route for Educate a Child
  };

  const handleFeedastraydogClick = () => {
    navigate('/feed-a-stray-dog'); // Navigate to Feed a Stray Dog
  };

  return (
    <div className="donation-section">
      <h1>Causes</h1>
      <p>Together, we fight hunger</p>
      <div className="donation-options">
        <div className="donation-option">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Helping_the_homeless.jpg"
            alt="Feed the Homeless"
          />
          <h2>Feed a Homeless Person</h2>
          <p>Every meal shared is a step toward a brighter future.</p>
          <a className="button-standard" onClick={handleHomelessDonateClick}>Donate Now ›</a>
        </div>

        <div className="donation-option">
          <img
            src="https://www.shutterstock.com/shutterstock/videos/1109539465/thumb/1.jpg?ip=x480"
            alt="Get a Wish Video"
          />
          <h2>Get a Wish Video</h2>
          <p>A simple meal can change a life; let's share our blessings and nourish hope together!</p>
          <a className="button-standard" onClick={handleWishvideoClick}>Donate Now ›</a>
        </div>

        <div className="donation-option">
          <img
            src="https://articles.unesco.org/sites/default/files/2023-09/school%20girl%20thailand.jpg"
            alt="Educate a Child"
          />
          <h2>Educate a Child</h2>
          <p>Supporting education for street children is the key to breaking the cycle of poverty.</p>
          <a className="button-standard" onClick={handleEducateachildClick}>Donate Now ›</a>
        </div>

        <div className="donation-option">
          <img
            src="https://t3.ftcdn.net/jpg/06/94/76/38/360_F_694763800_aJqdgKMXF9gwPZQWIwmCnw4uRHLsjyMN.jpg"
            alt="Feed a Street Dog"
          />
          <h2>Feed a Stray Dog</h2>
          <p>Compassion for animals is a reflection of our humanity. A simple meal for a street dog can change their world.</p>
          <a className="button-standard" onClick={handleFeedastraydogClick}>Donate Now ›</a>
        </div>
      </div>
    </div>
  );
}

export default Hunger;
