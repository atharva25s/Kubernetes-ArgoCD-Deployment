import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import StatusPage from './pages/StatusPage';
import ProcessPage from './pages/ProcessPage';
import UnstablePage from './pages/UnstablePage';
import DataPage from './pages/DataPage';
import './App.css';

function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) return null;

  return (
    <nav className="main-nav">
      <Link to="/" className="nav-logo">CarTech Dashboard</Link>
      <div className="nav-links">
        <Link to="/status" className={location.pathname === '/status' ? 'active' : ''}>Status</Link>
        <Link to="/process" className={location.pathname === '/process' ? 'active' : ''}>Process</Link>
        <Link to="/unstable" className={location.pathname === '/unstable' ? 'active' : ''}>Unstable</Link>
        <Link to="/data" className={location.pathname === '/data' ? 'active' : ''}>Data</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/unstable" element={<UnstablePage />} />
          <Route path="/data" element={<DataPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
