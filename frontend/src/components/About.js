import React from 'react';

function About() {
  return (
    <div>
      <div className="card about-section">
        <h2>About This Project</h2>
        <p>
          This project implements a non-invasive blood glucose prediction system using
          Photoplethysmography (PPG) signal patterns combined with demographic data.
          Multiple supervised learning models are trained and compared to provide
          accurate glucose level predictions.
        </p>

        <h3>PPG Signal Features</h3>
        <ul>
          <li><strong>PPG Mean</strong> - Average amplitude of the PPG signal</li>
          <li><strong>PPG Std</strong> - Standard deviation indicating signal variability</li>
          <li><strong>PPG Max/Min</strong> - Peak and trough values of the signal</li>
          <li><strong>PPG Peak Count</strong> - Number of peaks detected in the signal window</li>
          <li><strong>PPG Heart Rate</strong> - Heart rate derived from peak-to-peak intervals</li>
          <li><strong>PPG Pulse Width</strong> - Duration of each pulse wave</li>
          <li><strong>PPG Amplitude</strong> - Difference between systolic peak and diastolic trough</li>
          <li><strong>PPG Rise Time</strong> - Time from diastolic minimum to systolic peak</li>
          <li><strong>PPG Fall Time</strong> - Time from systolic peak to next diastolic minimum</li>
        </ul>

        <h3>Demographic Features</h3>
        <ul>
          <li><strong>Age</strong> - Patient age in years</li>
          <li><strong>Gender</strong> - Biological gender (0: Female, 1: Male)</li>
          <li><strong>BMI</strong> - Body Mass Index</li>
          <li><strong>Blood Pressure</strong> - Systolic and diastolic measurements</li>
          <li><strong>Diabetes History</strong> - Family history of diabetes</li>
          <li><strong>Physical Activity Level</strong> - Sedentary, Moderate, or Active</li>
          <li><strong>Smoking Status</strong> - Non-smoker, Former, or Current smoker</li>
        </ul>

        <h3>Machine Learning Models</h3>
        <ul>
          <li><strong>Random Forest</strong> - Ensemble of decision trees with bootstrap aggregation</li>
          <li><strong>Gradient Boosting</strong> - Sequential ensemble with boosting strategy</li>
          <li><strong>SVR</strong> - Support Vector Regression with RBF kernel</li>
          <li><strong>Linear Regression</strong> - Standard ordinary least squares regression</li>
          <li><strong>Ridge Regression</strong> - L2 regularized linear regression</li>
          <li><strong>Lasso Regression</strong> - L1 regularized linear regression</li>
          <li><strong>K-Nearest Neighbors</strong> - Instance-based learning algorithm</li>
          <li><strong>Decision Tree</strong> - Single tree-based regression model</li>
        </ul>

        <h3>Evaluation Metrics</h3>
        <ul>
          <li><strong>MAE</strong> - Mean Absolute Error (lower is better)</li>
          <li><strong>RMSE</strong> - Root Mean Squared Error (lower is better)</li>
          <li><strong>R2 Score</strong> - Coefficient of Determination (closer to 1 is better)</li>
        </ul>

        <h3>Technology Stack</h3>
        <ul>
          <li><strong>Backend</strong> - Python, Flask, scikit-learn, pandas, numpy</li>
          <li><strong>Frontend</strong> - React.js, Recharts, Axios</li>
          <li><strong>Dataset</strong> - 2000 synthetic samples with 18 features</li>
        </ul>

        <h3>How to Use</h3>
        <ul>
          <li>1. Navigate to the <strong>Predict Glucose</strong> tab</li>
          <li>2. Enter PPG signal features (or use default values)</li>
          <li>3. Enter demographic data for the patient</li>
          <li>4. Select a specific model or choose "All Models" for comparison</li>
          <li>5. Click <strong>Predict Blood Glucose</strong> to see results</li>
          <li>6. Check <strong>Model Metrics</strong> tab to compare model performance</li>
          <li>7. Explore the <strong>Dataset Explorer</strong> to understand the training data</li>
        </ul>

        <h3>Glucose Level Categories</h3>
        <ul>
          <li><span style={{ color: '#00e676', fontWeight: 600 }}>Normal</span> - Below 100 mg/dL</li>
          <li><span style={{ color: '#ffab00', fontWeight: 600 }}>Pre-diabetic</span> - 100 to 125 mg/dL</li>
          <li><span style={{ color: '#ff1744', fontWeight: 600 }}>Diabetic Range</span> - 126 mg/dL and above</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
