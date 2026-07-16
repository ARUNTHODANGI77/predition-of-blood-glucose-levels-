import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

function DatasetExplorer({ apiBase }) {
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatasetInfo();
  }, []);

  const fetchDatasetInfo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/api/dataset/info`);
      if (res.data.success) {
        setDatasetInfo(res.data.info);
      } else {
        toast.error(res.data.error);
      }
    } catch {
      toast.error('Failed to fetch dataset information.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="card loading">
        <div className="spinner" />
        <p>Loading dataset information...</p>
      </div>
    );
  }

  if (!datasetInfo) {
    return (
      <div className="card">
        <h2>Dataset Explorer</h2>
        <p style={{ color: '#8892b0' }}>No dataset information available.</p>
      </div>
    );
  }

  const scatterData = datasetInfo.sample_data.map((row) => ({
    bmi: row.bmi,
    glucose: row.blood_glucose,
    age: row.age,
    heartRate: row.ppg_heart_rate,
  }));

  return (
    <div>
      <div className="card">
        <h2>Dataset Overview</h2>
        <div className="dataset-info">
          <div className="stat-card">
            <div className="stat-label">Total Samples</div>
            <div className="stat-value">{datasetInfo.rows.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Features</div>
            <div className="stat-value">{datasetInfo.columns.length - 1}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Mean Glucose</div>
            <div className="stat-value">{datasetInfo.glucose_stats.mean}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Std Dev</div>
            <div className="stat-value">{datasetInfo.glucose_stats.std}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Min Glucose</div>
            <div className="stat-value">{datasetInfo.glucose_stats.min}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Max Glucose</div>
            <div className="stat-value">{datasetInfo.glucose_stats.max}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Feature Columns</h2>
        <div className="feature-list">
          {datasetInfo.columns.map((col) => (
            <div className="feature-item" key={col}>
              {col.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>BMI vs Blood Glucose (Sample)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="bmi" name="BMI" tick={{ fill: '#8892b0' }} label={{ value: 'BMI', position: 'bottom', fill: '#8892b0' }} />
              <YAxis dataKey="glucose" name="Glucose" tick={{ fill: '#8892b0' }} label={{ value: 'Glucose (mg/dL)', angle: -90, position: 'left', fill: '#8892b0' }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#00d2ff' }}
              />
              <Scatter data={scatterData} fill="#00d2ff" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2>Heart Rate vs Blood Glucose (Sample)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="heartRate" name="Heart Rate" tick={{ fill: '#8892b0' }} label={{ value: 'Heart Rate (bpm)', position: 'bottom', fill: '#8892b0' }} />
              <YAxis dataKey="glucose" name="Glucose" tick={{ fill: '#8892b0' }} label={{ value: 'Glucose (mg/dL)', angle: -90, position: 'left', fill: '#8892b0' }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#00d2ff' }}
              />
              <Scatter data={scatterData} fill="#3a7bd5" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2>Sample Data (First 10 Records)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="metrics-table">
            <thead>
              <tr>
                {datasetInfo.columns.slice(0, 8).map((col) => (
                  <th key={col}>{col.replace(/_/g, ' ')}</th>
                ))}
                <th>glucose</th>
              </tr>
            </thead>
            <tbody>
              {datasetInfo.sample_data.map((row, i) => (
                <tr key={i}>
                  {datasetInfo.columns.slice(0, 8).map((col) => (
                    <td key={col}>{typeof row[col] === 'number' ? row[col].toFixed ? row[col].toFixed(2) : row[col] : row[col]}</td>
                  ))}
                  <td style={{ fontWeight: 600, color: '#00d2ff' }}>{row.blood_glucose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DatasetExplorer;
