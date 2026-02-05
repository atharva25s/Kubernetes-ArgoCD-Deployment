import { useState } from 'react';
import { api } from '../services/api';
import './ApiPage.css';
import CarDetails from '../components/CarDetails';

function DataPage() {
  const carOptions = [
    'bmw_m3',
    'bmw_x5',
    'tesla_model_s',
    'tesla_model_3',
    'audi_a4',
    'audi_q7',
    'mercedes_c_class',
    'mercedes_gle',
    'toyota_fortuner',
    'toyota_camry',
    'ford_mustang',
    'lamborghini_huracan'
  ];

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // will hold actual response object
  const [error, setError] = useState(null);
  const [carName, setCarName] = useState('');
  const [history, setHistory] = useState([]);

  const handleGetData = async (e) => {
    e.preventDefault();

    if (!carName || !carOptions.includes(carName)) {
      setError('Please select a valid car from the list');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.getCarDetailsByName(carName);
      console.log('Car details response:', data); // keep full response in console for inspection
      setResult(data); // store full response for rendering
      setHistory(prev => [
        { name: carName, timestamp: new Date(), response: data },
        ...prev.slice(0, 4)
      ]);
    } catch (err) {
      console.error('Car details error:', err);
      setError(err.message || 'Request failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (historyItem) => {
    setCarName(historyItem.name);
    setResult(historyItem.response || null);
    setError(null);
    console.log('History response for', historyItem.name, historyItem.response);
  };

  return (
    <div className="api-page">
      <div className="page-header">
        <h1>🔍 Data Query</h1>
        <p>Retrieve car details by name</p>
      </div>

      <div className="api-card">
        <div className="endpoint-info">
          <span className="method-badge get">GET</span>
          <code className="endpoint">/getCarDetailsByName/:car_name</code>
        </div>

        <form onSubmit={handleGetData} className="data-form">
          <div className="form-group">
            <label htmlFor="carName">Car Name:</label>
            <select
              id="carName"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              className='form-group'
              disabled={loading}
            >
              <option value="">Select a car</option>
              {carOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="action-button"
            disabled={loading || !carName}
          >
            {loading ? 'Fetching...' : 'Get Car Details'}
          </button>
        </form>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Retrieving details for {carName}...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <span className="error-icon">❌</span>
            <div>
              <strong>Error:</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="success-box">
            <span className="success-icon">✅</span>
            <div>
              <strong>Response:</strong>
              <CarDetails data={result} />
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <h3>Recent Queries</h3>
            <div className="history-list">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => loadFromHistory(item)}
                >
                  <div className="history-id">{item.name}</div>
                  <div className="history-time">
                    {item.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>About This Endpoint</h3>
        <p>The car details endpoint accepts the car name in the URL path and returns associated information. Responses are logged to the browser console; the UI shows whether the request succeeded or failed.</p>
        <div className="info-grid">
          <div className="info-item">
            <strong>Parameter:</strong>
            <span>car_name (string)</span>
          </div>
          <div className="info-item">
            <strong>Response Time:</strong>
            <span>Instant</span>
          </div>
          <div className="info-item">
            <strong>Use Case:</strong>
            <span>Car Details Lookup</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataPage;
