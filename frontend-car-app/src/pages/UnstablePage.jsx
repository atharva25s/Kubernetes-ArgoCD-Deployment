import { useState } from 'react';
import { api } from '../services/api';
import './ApiPage.css';

function UnstablePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);

  const handleUnstableRequest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAttempts(prev => prev + 1);

    try {
      const data = await api.unstableRequest();
      setResult(data);
      setSuccessCount(prev => prev + 1);
    } catch (err) {
      setError(err.message);
      setFailureCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const resetStats = () => {
    setAttempts(0);
    setSuccessCount(0);
    setFailureCount(0);
    setResult(null);
    setError(null);
  };

  return (
    <div className="api-page">
      <div className="page-header">
        <h1>⚡ Unstable API</h1>
        <p>Test error handling with a 30% failure rate</p>
      </div>

      <div className="api-card">
        <div className="endpoint-info">
          <span className="method-badge get">GET</span>
          <code className="endpoint">/unstable</code>
        </div>

        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-number">{attempts}</div>
            <div className="stat-label">Total Attempts</div>
          </div>
          <div className="stat-box success">
            <div className="stat-number">{successCount}</div>
            <div className="stat-label">Successes</div>
          </div>
          <div className="stat-box failure">
            <div className="stat-number">{failureCount}</div>
            <div className="stat-label">Failures</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">
              {attempts > 0 ? ((successCount / attempts) * 100).toFixed(1) : 0}%
            </div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>

        <div className="button-group">
          <button
            className="action-button"
            onClick={handleUnstableRequest}
            disabled={loading}
          >
            {loading ? 'Attempting...' : 'Make Request'}
          </button>
          <button
            className="action-button secondary"
            onClick={resetStats}
            disabled={loading || attempts === 0}
          >
            Reset Stats
          </button>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Making unstable request...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <span className="error-icon">❌</span>
            <div>
              <strong>Request Failed:</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="success-box">
            <span className="success-icon">✅</span>
            <div>
              <strong>Request Succeeded:</strong>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>About This Endpoint</h3>
        <p>The unstable endpoint randomly fails 30% of the time (HTTP 500) to simulate real-world error conditions and test your application's error handling capabilities.</p>
        <div className="info-grid">
          <div className="info-item">
            <strong>Failure Rate:</strong>
            <span>~30%</span>
          </div>
          <div className="info-item">
            <strong>Error Type:</strong>
            <span>Internal Server Error</span>
          </div>
          <div className="info-item">
            <strong>Use Case:</strong>
            <span>Error Handling Testing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnstablePage;
