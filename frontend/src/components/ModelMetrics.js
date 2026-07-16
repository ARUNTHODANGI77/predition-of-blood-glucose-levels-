import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

function ModelMetrics({ apiBase }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/api/metrics`);
      if (res.data.success) {
        setMetrics(res.data.metrics);
      } else {
        toast.info('No metrics available. Train models first.');
      }
    } catch {
      toast.error('Failed to fetch metrics.');
    }
    setLoading(false);
  };

  const handleRetrain = async () => {
    setRetraining(true);
    toast.info('Retraining models... This may take a moment.');
    try {
      const res = await axios.post(`${apiBase}/api/train`);
      if (res.data.success) {
        setMetrics(res.data.metrics);
        toast.success('Models retrained successfully!');
      } else {
        toast.error(res.data.error);
      }
    } catch {
      toast.error('Failed to retrain models.');
    }
    setRetraining(false);
  };

  if (loading) {
    return (
      <div className="card loading">
        <div className="spinner" />
        <p>Loading metrics...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="card">
        <h2>Model Performance Metrics</h2>
        <p style={{ color: '#8892b0', marginBottom: 20 }}>
          No metrics available yet. Train the models first.
        </p>
        <button className="btn-primary" onClick={handleRetrain} disabled={retraining}>
          {retraining ? 'Training...' : 'Train Models'}
        </button>
      </div>
    );
  }

  const chartData = Object.entries(metrics).map(([name, m]) => ({
    name: name.replace(/_/g, ' '),
    MAE: m.mae,
    RMSE: m.rmse,
    R2: m.r2,
  }));

  const radarData = Object.entries(metrics).map(([name, m]) => ({
    model: name.replace(/_/g, ' ').substring(0, 12),
    R2Score: Math.max(0, m.r2 * 100),
    Accuracy: Math.max(0, (1 - m.mae / 150) * 100),
  }));

  return (
    <div>
      <div className="card">
        <h2>Model Performance Metrics</h2>
        <div className="actions">
          <button className="btn-primary" onClick={handleRetrain} disabled={retraining}>
            {retraining ? 'Retraining...' : 'Retrain All Models'}
          </button>
          <button className="btn-secondary" onClick={fetchMetrics}>
            Refresh Metrics
          </button>
        </div>

        <table className="metrics-table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Model</th>
              <th>MAE</th>
              <th>RMSE</th>
              <th>R2 Score</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(metrics)
              .sort((a, b) => b[1].r2 - a[1].r2)
              .map(([name, m]) => (
                <tr key={name}>
                  <td style={{ fontWeight: 500 }}>{name.replace(/_/g, ' ')}</td>
                  <td>{m.mae}</td>
                  <td>{m.rmse}</td>
                  <td style={{ color: m.r2 > 0.8 ? '#00e676' : m.r2 > 0.5 ? '#ffab00' : '#ff1744' }}>
                    {m.r2}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Error Comparison (MAE & RMSE)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#8892b0' }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#00d2ff' }}
              />
              <Legend />
              <Bar dataKey="MAE" fill="#3a7bd5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="RMSE" fill="#00d2ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2>R2 Score Comparison</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#8892b0' }} domain={[0, 1]} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#00d2ff' }}
              />
              <Bar dataKey="R2" fill="#00e676" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2>Model Radar Comparison</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="model" tick={{ fill: '#8892b0', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#8892b0' }} domain={[0, 100]} />
              <Radar name="R2 Score %" dataKey="R2Score" stroke="#3a7bd5" fill="#3a7bd5" fillOpacity={0.3} />
              <Radar name="Accuracy %" dataKey="Accuracy" stroke="#00d2ff" fill="#00d2ff" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ModelMetrics;
