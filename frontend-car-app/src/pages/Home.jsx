import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    { title: 'Status Check', path: '/status', icon: '📊', desc: 'Monitor service health' },
    { title: 'Process Data', path: '/process', icon: '⚙️', desc: 'Handle requests with delays' },
    { title: 'Unstable API', path: '/unstable', icon: '⚡', desc: 'Test error handling' },
    { title: 'Data Query', path: '/data', icon: '🔍', desc: 'Retrieve item data' }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="dashboard-overlay">
          <div className="speedometer">
            <div className="speed-indicator">{time.getSeconds()}</div>
            <div className="speed-label">API Monitor</div>
          </div>
          <h1 className="hero-title">CarTech Dashboard</h1>
          <p className="hero-subtitle">Advanced API Performance & Monitoring System</p>
          <div className="time-display">{time.toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <Link to={feature.path} key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <div className="card-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-value">99.9%</div>
          <div className="stat-label">Uptime</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">Fast</div>
          <div className="stat-label">Response</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">24/7</div>
          <div className="stat-label">Monitoring</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">Secure</div>
          <div className="stat-label">Connection</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
