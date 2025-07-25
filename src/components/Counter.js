import React from 'react';
import CountUp from 'react-countup';
import './Counter.css';

const Counter = () => {
  return (
    <div className="counter-container">
      <h2>Our Impact</h2>
      <div className="counter-grid">
        <div className="counter-item">
          <h3>Homeless People Impacted</h3>
          <CountUp end={+0} duration={2} separator="," />
        </div>
        <div className="counter-item">
          <h3>Stray Dogs Impacted</h3>
          <CountUp end={+0} duration={2} separator="," />
        </div>
        <div className="counter-item">
          <h3>Children Benefited</h3>
          <CountUp end={+0} duration={2} separator="," />
        </div>
      </div>
    </div>
  );
};

export default Counter;
