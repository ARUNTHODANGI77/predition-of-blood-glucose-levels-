import numpy as np
import pandas as pd
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.neighbors import KNeighborsRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def train_models(dataset_path, models_dir):
    os.makedirs(models_dir, exist_ok=True)

    df = pd.read_csv(dataset_path)

    feature_columns = [
        'ppg_mean', 'ppg_std', 'ppg_max', 'ppg_min', 'ppg_peak_count',
        'ppg_heart_rate', 'ppg_pulse_width', 'ppg_amplitude',
        'ppg_rise_time', 'ppg_fall_time',
        'age', 'gender', 'bmi', 'systolic_bp', 'diastolic_bp',
        'has_diabetes_history', 'physical_activity_level', 'smoking_status'
    ]
    target_column = 'blood_glucose'

    X = df[feature_columns].values
    y = df[target_column].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model_configs = {
        'random_forest': RandomForestRegressor(
            n_estimators=100, max_depth=15, random_state=42, n_jobs=-1
        ),
        'gradient_boosting': GradientBoostingRegressor(
            n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
        ),
        'svr': SVR(kernel='rbf', C=10, gamma='scale'),
        'linear_regression': LinearRegression(),
        'ridge': Ridge(alpha=1.0),
        'lasso': Lasso(alpha=0.1),
        'knn': KNeighborsRegressor(n_neighbors=5),
        'decision_tree': DecisionTreeRegressor(max_depth=10, random_state=42),
    }

    models = {}
    metrics = {}

    for name, model in model_configs.items():
        print(f"Training {name}...")
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)

        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        models[name] = model
        metrics[name] = {
            'mae': round(mae, 4),
            'rmse': round(rmse, 4),
            'r2': round(r2, 4)
        }

        with open(os.path.join(models_dir, f'{name}.pkl'), 'wb') as f:
            pickle.dump(model, f)

        print(f"  {name}: MAE={mae:.4f}, RMSE={rmse:.4f}, R2={r2:.4f}")

    with open(os.path.join(models_dir, 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)

    with open(os.path.join(models_dir, 'feature_columns.pkl'), 'wb') as f:
        pickle.dump(feature_columns, f)

    with open(os.path.join(models_dir, 'metrics.pkl'), 'wb') as f:
        pickle.dump(metrics, f)

    return models, scaler, feature_columns, metrics


def load_models(models_dir):
    models = {}
    model_names = [
        'random_forest', 'gradient_boosting', 'svr',
        'linear_regression', 'ridge', 'lasso', 'knn', 'decision_tree'
    ]

    for name in model_names:
        path = os.path.join(models_dir, f'{name}.pkl')
        if os.path.exists(path):
            with open(path, 'rb') as f:
                models[name] = pickle.load(f)

    with open(os.path.join(models_dir, 'scaler.pkl'), 'rb') as f:
        scaler = pickle.load(f)

    with open(os.path.join(models_dir, 'feature_columns.pkl'), 'rb') as f:
        feature_columns = pickle.load(f)

    return models, scaler, feature_columns


def predict_glucose(models, scaler, feature_columns, features_dict, model_name='random_forest'):
    feature_values = [features_dict[col] for col in feature_columns]
    X = np.array(feature_values).reshape(1, -1)
    X_scaled = scaler.transform(X)

    predictions = {}

    if model_name == 'all':
        for name, model in models.items():
            pred = model.predict(X_scaled)[0]
            predictions[name] = round(float(pred), 2)
    else:
        if model_name in models:
            pred = models[model_name].predict(X_scaled)[0]
            predictions[model_name] = round(float(pred), 2)
        else:
            raise ValueError(f"Model '{model_name}' not found. Available: {list(models.keys())}")

    return predictions
