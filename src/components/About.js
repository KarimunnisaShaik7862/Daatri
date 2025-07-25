import React from 'react';
import './About.css';

const About = () => {
  return (
    <div>
      {/* Full-screen top image */}
      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVuZ3J5JTIwY2hpbGRyZW58ZW58MHx8MHx8fDA%3D" // Replace with relevant image URL
          alt="Birthday Charity Hero Image"
        />
      </div>

      <div className="container">
        <h1 className="main-title">Mission and Vision</h1>
        <div className="section-row">
          <div className="section-text">
            <p>
              We envision a world where birthdays are celebrated by giving back and spreading kindness to those in need. Our mission is to transform the joy of birthdays into an opportunity for positive change. By connecting generous individuals with underprivileged communities, we ensure that birthday donations provide essential resources like food and clothing to those who need them most.
            </p>
            <p>
              Our platform encourages individuals to reimagine their birthday celebrations as a way to make a lasting impact on those less fortunate. We believe that by turning personal milestones into moments of giving, we can foster a culture of empathy and gratitude. Each birthday donation not only addresses immediate needs but also contributes to long-term development, offering education, healthcare, and support for sustainable living.
            </p>
          </div>
          <div className="section-image">
            <img
              src="https://images.forbesindia.com/blog/wp-content/uploads/2017/03/shutterstock_390522649_Sm.jpg?impolicy=website&width=900&height=600"
              alt="Vision and Mission"
            />
          </div>
        </div>

        <h1 className="main-title">Our Motive</h1>
        <div className="section-row">
          <div className="section-text">
            <p>
              Our motive is to encourage you to transform your birthday into an opportunity to make a meaningful impact on the lives of those in need. By donating your birthday funds, you can help provide essential resources like nutritious meals, clothing, shelter, education, and healthcare to poor communities. We believe that your generosity can bring joy, hope, and positive change, making your special day even more significant and inspiring others to join in this act of kindness.
            </p>
            <p>
              Your contributions not only address immediate needs but also support sustainable development in underprivileged areas. Each donation helps break the cycle of poverty by empowering individuals with education and healthcare, giving them the tools they need for a brighter future. By celebrating your birthday in this way, you are spreading love and compassion, showing that even small acts of kindness can have a profound impact.
            </p>
          </div>
          <div className="section-image">
            <img
              src="https://c8.alamy.com/comp/2BFNM31/collage-with-poor-people-in-desperate-need-of-help-2BFNM31.jpg"
              alt="Our Motive"
              className="motive-image" // Added a class for styling
            />
          </div>
        </div>

        <h1 className="main-title">What We Will Do</h1>
        <div className="section-row">
          <div className="section-text">
            <p>
              When you donate your birthday funds, we will ensure that every contribution is used to make a significant impact on the lives of those in need. Your donations will be channeled through trusted charities to provide nutritious meals, essential clothing, and safe shelter for poor communities. Additionally, we will support educational programs and healthcare services to empower individuals and break the cycle of poverty. Our transparent and accountable process guarantees that your generosity brings real and lasting change, helping to create a better future for those who need it most.
            </p>
            <p>
            Your donations will be directed through trusted and reputable charities to provide not only nutritious meals, but also essential clothing, safe shelter, and basic necessities for vulnerable and impoverished communities.
In addition to addressing immediate needs, we will support educational programs, vocational training, and access to healthcare, empowering individuals to improve their circumstances and break the cycle of poverty.
Fostering hope and opportunity for a brighter future for those in need.
            </p>
          </div>
          <div className="section-image">
            <img
              src="https://akshayachaitanya.org/public/assets/images/special-days.webp"
              alt="What We Will Do with Donations"
            />
          </div>
        </div>

        <h1 className="main-title">How to Feed the Food</h1>
        <div className="section-row">
          <div className="section-text">
            <p>
              With your birthday donations, we partner with established charities to efficiently distribute food to those in need. These organizations use the funds to purchase and prepare nutritious meals, which are then delivered to underserved communities through local food banks, shelters, and community kitchens. We ensure that the food is not only sufficient in quantity but also balanced and healthy, meeting the dietary needs of recipients. Our goal is to make sure that every donation directly supports efforts to alleviate hunger and provide essential nourishment to those who need it most.
            </p>
            <p>
              Your contributions not only address immediate needs but also support sustainable development in underprivileged areas. Each donation helps break the cycle of poverty by empowering individuals with education and healthcare, giving them the tools they need for a brighter future. By celebrating your birthday in this way, you are spreading love and compassion, showing that even small acts of kindness can have a profound impact.
            </p>
          </div>
          <div className="section-image">
            <img
              src="https://happyfacesvadodara.com/wp-content/uploads/elementor/thumbs/159902871_3759745484112749_725992634867889733_o-1-q8uzuwc9i5lpd41qp5quaxet4wzolth6err01wl29m.jpg"
              alt="Feeding the Food"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;