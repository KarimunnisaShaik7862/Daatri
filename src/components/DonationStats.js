import React, { useState, useEffect } from 'react';
import './DonationStats.css';

const ThreeDotsMenu = ({ onClick }) => (
  <div className="three-dots-menu" onClick={onClick}>
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);

const adminCredentials = [
  { email: 'manojlovely679@gmail.com', password: 'manoj' },
  { email: 'mounikamandangi99@gmail.com', password: 'mounika' },
  { email: 'priyadarsinijaddu@gmail.com', password: 'priya' },
  { email: 'karimunnisashaik7862@gmail.com', password: 'karimunnisa' },
  { email: '258gnanasekhar.v@gmail.com', password: 'sekhar' },
  { email: 'vamsikiran198@gmail.com', password: 'vamsi' },
];

const DonationStats = () => {
  const [mealsServed, setMealsServed] = useState(0);
  const [beneficiariesFed, setBeneficiariesFed] = useState(0);
  const [targetMealsServed, setTargetMealsServed] = useState(() => {
    return parseInt(localStorage.getItem('targetMealsServed')) || 0;
  });
  const [targetBeneficiariesFed, setTargetBeneficiariesFed] = useState(() => {
    return parseInt(localStorage.getItem('targetBeneficiariesFed')) || 0;
  });
  const [isAdmin, setIsAdmin] = useState(() => JSON.parse(localStorage.getItem('isAdmin')) || false);
  const [newMeals, setNewMeals] = useState('');
  const [newBeneficiaries, setNewBeneficiaries] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(isAdmin);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');

  const animateIncrement = (start, end, setValue) => {
    if (start === end) return;

    const increment = end > start ? 1 : -1;
    const duration = 1000;
    const steps = Math.abs(end - start);
    const stepDuration = duration / steps;

    let currentValue = start;
    const step = () => {
      currentValue += increment;
      setValue(currentValue);
      if (currentValue !== end) {
        setTimeout(step, stepDuration);
      }
    };
    step();
  };

  useEffect(() => {
    animateIncrement(0, targetMealsServed, setMealsServed);
    animateIncrement(0, targetBeneficiariesFed, setBeneficiariesFed);
  }, [targetMealsServed, targetBeneficiariesFed]);

  useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  const handleMealIncrement = () => {
    const increment = parseInt(newMeals);
    if (!isNaN(increment)) {
      setTargetMealsServed(prev => {
        const newTarget = prev + increment;
        localStorage.setItem('targetMealsServed', newTarget);
        return newTarget;
      });
      setNewMeals('');
      if (newBeneficiaries === '') {
        setShowAdminForm(false);
        setIsAdmin(false);
        localStorage.removeItem('isAdmin');
        setMenuOpen(false);
        setAdminEmail('');
        setAdminPassword('');
      }
    } else {
      alert("Please enter a valid number for meals.");
    }
  };

  const handleBeneficiaryIncrement = () => {
    const increment = parseInt(newBeneficiaries);
    if (!isNaN(increment)) {
      setTargetBeneficiariesFed(prev => {
        const newTarget = prev + increment;
        localStorage.setItem('targetBeneficiariesFed', newTarget);
        return newTarget;
      });
      setNewBeneficiaries('');
      if (newMeals === '') {
        setShowAdminForm(false);
        setIsAdmin(false);
        localStorage.removeItem('isAdmin');
        setMenuOpen(false);
        setAdminEmail('');
        setAdminPassword('');
      }
    } else {
      alert("Please enter a valid number for beneficiaries.");
    }
  };

  const handleLogin = () => {
    const validAdmin = adminCredentials.find(
      cred => cred.email === adminEmail && cred.password === adminPassword
    );

    if (validAdmin) {
      setIsAdmin(true);
      setShowAdminForm(true);
      setMenuOpen(false);
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleReset = () => {
    // Clear the donation statistics and local storage
    setMealsServed(0);
    setBeneficiariesFed(0);
    setTargetMealsServed(10);
    setTargetBeneficiariesFed(10);
    localStorage.removeItem('targetMealsServed');
    localStorage.removeItem('targetBeneficiariesFed');
    // Hide the admin form, logout, and clear inputs
    setShowAdminForm(false);
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    setMenuOpen(false);
    setAdminEmail('');
    setAdminPassword('');
  };

  return (
    <div className="donation-container">
      <h1>Online Donations To Empower Hope In India</h1>
      <div className="stats-container">
        <div>
          <h2>{mealsServed.toLocaleString()}+</h2>
          <p>Cumulative Meals Served</p>
        </div>
        <div>
          <h2>{beneficiariesFed.toLocaleString()}+</h2>
          <p>Beneficiaries Fed Daily</p>
        </div>
      </div>
      {showAdminForm && isAdmin && (
        <div className="admin-form">
          <div>
            <input
              type="number"
              value={newMeals}
              onChange={(e) => setNewMeals(e.target.value)}
              placeholder="Enter number of meals"
            />
            <button onClick={handleMealIncrement}>Add Meals</button>
          </div>
          <div>
            <input
              type="number"
              value={newBeneficiaries}
              onChange={(e) => setNewBeneficiaries(e.target.value)}
              placeholder="Enter number of beneficiaries"
            />
            <button onClick={handleBeneficiaryIncrement}>Add Beneficiaries</button>
          </div>
          <button onClick={handleReset} className="reset-button">Reset Donations</button>
        </div>
      )}
      {!isAdmin && !showAdminForm && menuOpen && (
        <div className="menu-popup">
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="Admin Email"
          />
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Admin Password"
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
      <ThreeDotsMenu onClick={() => setMenuOpen(!menuOpen)} />
    </div>
  );
};

export default DonationStats;
