import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './HomePage';
import About from './About';
import Gallery from './Gallery';
import Contact from './Contact';
import VolunteerPage from './VolunteerPage';
import  Register from'./Register';
import Counter from './Counter';
import Hunger from './Hunger';
import Homelessdonate from './Homelessdonate';
import Wishvideo from './Wishvideo';
import Educateachild from './Educateachild';
import Feedastraydog from './Feedastraydog';
function App() {
  return (
    <div className="App">
      <Navbar />  {/* Navbar is displayed on all pages */}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect to /home */}
        <Route path="/home" element={<HomePage />} /> {/* Home Page route */}
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/home" />} /> {/* Redirect any unknown route to home */}
        <Route path="/volunteer" element={<VolunteerPage />} /> 
        <Route path="/Register" element={<Register />} />
        <Route path="/" element={<Hunger />} />
        <Route path="/homeless-donate" element={<Homelessdonate />} />
        {/* Other routes can be added here */}
        <Route path="/" element={<Hunger />} />
        <Route path="/get-a-wish-video" element={<Wishvideo />} />
        {/* Add other routes here */}
        <Route path="/" element={<Hunger />} />
        <Route path="/Educate-a-child" element={<Educateachild />} />
        {/* Add other routes here */}
        <Route path="/" element={<Hunger />} />
        <Route path="/Feed-a-stray-dog" element={<Feedastraydog/>} />
        {/* Add other routes here */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/hunger" element={<Hunger />} /> {/* Route for Hunger component */}
        {/* Add other routes as necessary */}
      </Routes>
    </div>
  );
}

export default App;
