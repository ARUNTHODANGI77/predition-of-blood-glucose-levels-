from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
import os
from models import train_models, predict_glucose, load_models

app = Flask(__name__)
CORS(app)

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'ppg_glucose_dataset.csv')

models = None
scaler = None
feature_columns = None

def initialize():
    global models, scaler, feature_columns
    if os.path.exists(os.path.join(MODELS_DIR, 'random_forest.pkl')):
        models, scaler, feature_columns = load_models(MODELS_DIR)
        print("Loaded pre-trained models.")
    else:
        print("Training models from dataset...")
        models, scaler, feature_columns, metrics = train_models(DATASET_PATH, MODELS_DIR)
        print("Models trained and saved.")

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "models_loaded": models is not None})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        ppg_features = {
            'ppg_mean': float(data.get('ppg_mean', 0)),
            'ppg_std': float(data.get('ppg_std', 0)),
            'ppg_max': float(data.get('ppg_max', 0)),
            'ppg_min': float(data.get('ppg_min', 0)),
            'ppg_peak_count': float(data.get('ppg_peak_count', 0)),
            'ppg_heart_rate': float(data.get('ppg_heart_rate', 0)),
            'ppg_pulse_width': float(data.get('ppg_pulse_width', 0)),
            'ppg_amplitude': float(data.get('ppg_amplitude', 0)),
            'ppg_rise_time': float(data.get('ppg_rise_time', 0)),
            'ppg_fall_time': float(data.get('ppg_fall_time', 0)),
        }

        demographic_features = {
            'age': float(data.get('age', 30)),
            'gender': float(data.get('gender', 0)),
            'bmi': float(data.get('bmi', 25)),
            'systolic_bp': float(data.get('systolic_bp', 120)),
            'diastolic_bp': float(data.get('diastolic_bp', 80)),
            'has_diabetes_history': float(data.get('has_diabetes_history', 0)),
            'physical_activity_level': float(data.get('physical_activity_level', 1)),
            'smoking_status': float(data.get('smoking_status', 0)),
        }

        all_features = {**ppg_features, **demographic_features}
        model_name = data.get('model', 'random_forest')
        predictions = predict_glucose(models, scaler, feature_columns, all_features, model_name)

        return jsonify({
            "success": True,
            "predictions": predictions,
            "input_features": all_features
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/train', methods=['POST'])
def retrain():
    global models, scaler, feature_columns
    try:
        models, scaler, feature_columns, metrics = train_models(DATASET_PATH, MODELS_DIR)
        return jsonify({
            "success": True,
            "message": "Models retrained successfully",
            "metrics": metrics
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    try:
        metrics_path = os.path.join(MODELS_DIR, 'metrics.pkl')
        if os.path.exists(metrics_path):
            with open(metrics_path, 'rb') as f:
                metrics = pickle.load(f)
            return jsonify({"success": True, "metrics": metrics})
        else:
            return jsonify({"success": False, "error": "No metrics available. Train models first."})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/dataset/info', methods=['GET'])
def dataset_info():
    try:
        df = pd.read_csv(DATASET_PATH)
        info = {
            "rows": len(df),
            "columns": list(df.columns),
            "glucose_stats": {
                "mean": round(df['blood_glucose'].mean(), 2),
                "std": round(df['blood_glucose'].std(), 2),
                "min": round(df['blood_glucose'].min(), 2),
                "max": round(df['blood_glucose'].max(), 2),
            },
            "sample_data": df.head(10).to_dict(orient='records')
        }
        return jsonify({"success": True, "info": info})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    initialize()
    app.run(debug=True, host='0.0.0.0', port=5000)
