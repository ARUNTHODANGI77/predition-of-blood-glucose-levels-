import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const defaultPPG = {
  ppg_mean: 0.52,
  ppg_std: 0.12,
  ppg_max: 0.85,
  ppg_min: 0.22,
  ppg_peak_count: 8,
  ppg_heart_rate: 72,
  ppg_pulse_width: 0.34,
  ppg_amplitude: 0.63,
  ppg_rise_time: 0.11,
  ppg_fall_time: 0.22,
};

const defaultDemographic = {
  age: 35,
  gender: 0,
  bmi: 24.5,
  systolic_bp: 120,
  diastolic_bp: 80,
  has_diabetes_history: 0,
  physical_activity_level: 1,
  smoking_status: 0,
};

function PredictionForm({ apiBase }) {
  const [ppgData, setPpgData] = useState(defaultPPG);
  const [demoData, setDemoData] = useState(defaultDemographic);
  const [selectedModel, setSelectedModel] = useState('all');
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePpgChange = (field, value) => {
    setPpgData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleDemoChange = (field, value) => {
    setDemoData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiBase}/api/predict`, {
        ...ppgData,
        ...demoData,
        model: selectedModel,
      });
      if (res.data.success) {
        setPredictions(res.data.predictions);
        toast.success('Prediction completed successfully!');
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      toast.error('Failed to connect to backend. Make sure the server is running.');
    }
    setLoading(false);
  };

  const getGlucoseClass = (value) => {
    if (value < 100) return 'glucose-normal';
    if (value < 126) return 'glucose-pre-diabetic';
    return 'glucose-diabetic';
  };

  const getGlucoseLabel = (value) => {
    if (value < 100) return 'Normal';
    if (value < 126) return 'Pre-diabetic';
    return 'Diabetic Range';
  };

  return (
    <div>
      <div className="card">
        <h2>PPG Signal Features</h2>
        <div className="form-grid">
          {Object.entries(ppgData).map(([key, val]) => (
            <div className="form-group" key={key}>
              <label>{key.replace(/_/g, ' ').replace('ppg ', 'PPG ')}</label>
              <input
                type="number"
                step="any"
                value={val}
                onChange={(e) => handlePpgChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Demographic Data</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={demoData.age}
              onChange={(e) => handleDemoChange('age', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              value={demoData.gender}
              onChange={(e) => handleDemoChange('gender', e.target.value)}
            >
              <option value={0}>Female</option>
              <option value={1}>Male</option>
            </select>
          </div>
          <div className="form-group">
            <label>BMI</label>
            <input
              type="number"
              step="0.1"
              value={demoData.bmi}
              onChange={(e) => handleDemoChange('bmi', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Systolic BP</label>
            <input
              type="number"
              value={demoData.systolic_bp}
              onChange={(e) => handleDemoChange('systolic_bp', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Diastolic BP</label>
            <input
              type="number"
              value={demoData.diastolic_bp}
              onChange={(e) => handleDemoChange('diastolic_bp', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Diabetes History</label>
            <select
              value={demoData.has_diabetes_history}
              onChange={(e) => handleDemoChange('has_diabetes_history', e.target.value)}
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label>Physical Activity</label>
            <select
              value={demoData.physical_activity_level}
              onChange={(e) => handleDemoChange('physical_activity_level', e.target.value)}
            >
              <option value={0}>Sedentary</option>
              <option value={1}>Moderate</option>
              <option value={2}>Active</option>
            </select>
          </div>
          <div className="form-group">
            <label>Smoking Status</label>
            <select
              value={demoData.smoking_status}
              onChange={(e) => handleDemoChange('smoking_status', e.target.value)}
            >
              <option value={0}>Non-smoker</option>
              <option value={1}>Former Smoker</option>
              <option value={2}>Current Smoker</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="model-select-wrapper">
          <label style={{ color: '#8892b0' }}>Select Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              color: '#e0e0e0',
              fontSize: '0.95rem',
            }}
          >
            <option value="all">All Models</option>
            <option value="random_forest">Random Forest</option>
            <option value="gradient_boosting">Gradient Boosting</option>
            <option value="svr">SVR</option>
            <option value="linear_regression">Linear Regression</option>
            <option value="ridge">Ridge Regression</option>
            <option value="lasso">Lasso Regression</option>
            <option value="knn">K-Nearest Neighbors</option>
            <option value="decision_tree">Decision Tree</option>
          </select>
          <button className="btn-primary" onClick={handlePredict} disabled={loading}>
            {loading ? 'Predicting...' : 'Predict Blood Glucose'}
          </button>
        </div>
      </div>

      {predictions && (
        <div className="card">
          <h2>Prediction Results</h2>
          {Object.keys(predictions).length === 1 ? (
            <div className="result-box" style={{ textAlign: 'center' }}>
              {Object.entries(predictions).map(([model, value]) => (
                <div key={model}>
                  <p style={{ color: '#8892b0', marginBottom: 5 }}>
                    {model.replace(/_/g, ' ').toUpperCase()}
                  </p>
                  <div className={`prediction-value ${getGlucoseClass(value)}`}>
                    {value} <span className="prediction-unit">mg/dL</span>
                  </div>
                  <p style={{ marginTop: 10, fontSize: '0.9rem' }} className={getGlucoseClass(value)}>
                    {getGlucoseLabel(value)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="prediction-grid">
              {Object.entries(predictions).map(([model, value]) => (
                <div className="prediction-card" key={model}>
                  <div className="model-name">{model.replace(/_/g, ' ')}</div>
                  <div className={`model-value ${getGlucoseClass(value)}`}>{value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8892b0', marginTop: 4 }}>
                    mg/dL - {getGlucoseLabel(value)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PredictionForm;
