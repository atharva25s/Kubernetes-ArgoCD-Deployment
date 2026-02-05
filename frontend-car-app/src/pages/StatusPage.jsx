import { useState } from 'react';
import { api } from '../services/api';
import './ApiPage.css';

function StatusPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckStatus = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.getStatus();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-page">
      <div className="page-header">
        <h1>📊 Health Check</h1>
        <p>Monitor the health and availability of the service</p>
      </div>

      <div className="api-card">
        <div className="endpoint-info">
          <span className="method-badge get">GET</span>
          <code className="endpoint">/health</code>
        </div>

        <button
          className="action-button"
          onClick={handleCheckStatus}
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check health'}
        </button>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Fetching status...</p>
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
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>About This Endpoint</h3>
        <p>The status endpoint provides real-time information about the service health. It returns a simple confirmation that the service is running and operational.</p>
        <div className="info-grid">
          <div className="info-item">
            <strong>Response Time:</strong>
            <span>Instant</span>
          </div>
          <div className="info-item">
            <strong>Success Rate:</strong>
            <span>99.9%</span>
          </div>
          <div className="info-item">
            <strong>Use Case:</strong>
            <span>Health Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusPage;
