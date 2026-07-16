import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PredictionForm from './components/PredictionForm';
import ModelMetrics from './components/ModelMetrics';
import DatasetExplorer from './components/DatasetExplorer';
import About from './components/About';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/health`);
      setBackendStatus(res.data);
    } catch {
      setBackendStatus({ status: 'disconnected' });
    }
  };

  const tabs = [
    { id: 'predict', label: 'Predict Glucose' },
    { id: 'metrics', label: 'Model Metrics' },
    { id: 'dataset', label: 'Dataset Explorer' },
    { id: 'about', label: 'About' },
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>Blood Glucose Prediction System</h1>
        <p>Using PPG Signal Patterns & Demographic Data with Supervised Learning</p>
        {backendStatus && (
          <p style={{ marginTop: 10, fontSize: '0.85rem' }}>
            Backend:{' '}
            <span style={{ color: backendStatus.status === 'ok' ? '#00e676' : '#ff1744' }}>
              {backendStatus.status === 'ok' ? 'Connected' : 'Disconnected'}
            </span>
          </p>
        )}
      </header>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'predict' && <PredictionForm apiBase={API_BASE} />}
      {activeTab === 'metrics' && <ModelMetrics apiBase={API_BASE} />}
      {activeTab === 'dataset' && <DatasetExplorer apiBase={API_BASE} />}
      {activeTab === 'about' && <About />}
    </div>
  );
}

export default App;
