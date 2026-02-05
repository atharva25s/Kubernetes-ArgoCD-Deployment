import { useState } from 'react';
import { api } from '../services/api';
import './ApiPage.css';

function ProcessPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setStartTime(Date.now());

    try {
      const data = await api.processRequest();
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
        <h1>⚙️ Process Request</h1>
        <p>Handle requests with variable processing delays</p>
      </div>

      <div className="api-card">
        <div className="endpoint-info">
          <span className="method-badge get">GET</span>
          <code className="endpoint">/process</code>
        </div>

        <button
          className="action-button"
          onClick={handleProcess}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Start Processing'}
        </button>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing your request... This may take 1-10 seconds</p>
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
              {startTime && (
                <p className="elapsed-time">
                  Actual elapsed time: {((Date.now() - startTime) / 1000).toFixed(2)}s
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>About This Endpoint</h3>
        <p>The process endpoint simulates variable processing times (1, 2, 5, or 10 seconds) to help test application behavior under different latency conditions.</p>
        <div className="info-grid">
          <div className="info-item">
            <strong>Possible Delays:</strong>
            <span>1s, 2s, 5s, 10s</span>
          </div>
          <div className="info-item">
            <strong>Success Rate:</strong>
            <span>100%</span>
          </div>
          <div className="info-item">
            <strong>Use Case:</strong>
            <span>Latency Testing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcessPage;
