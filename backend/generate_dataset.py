import numpy as np
import pandas as pd
import os

np.random.seed(42)

N = 2000

age = np.random.randint(18, 80, N)
gender = np.random.choice([0, 1], N)
bmi = np.round(np.random.normal(26, 5, N).clip(16, 45), 1)
systolic_bp = np.random.randint(90, 180, N)
diastolic_bp = np.random.randint(60, 110, N)
has_diabetes_history = np.random.choice([0, 1], N, p=[0.7, 0.3])
physical_activity_level = np.random.choice([0, 1, 2], N, p=[0.3, 0.5, 0.2])
smoking_status = np.random.choice([0, 1, 2], N, p=[0.5, 0.3, 0.2])

ppg_heart_rate = np.random.normal(75, 12, N).clip(50, 120)
ppg_mean = np.random.normal(0.5, 0.15, N).clip(0.1, 1.0)
ppg_std = np.random.normal(0.12, 0.04, N).clip(0.02, 0.3)
ppg_max = ppg_mean + np.random.uniform(0.2, 0.6, N)
ppg_min = ppg_mean - np.random.uniform(0.1, 0.4, N)
ppg_peak_count = np.random.randint(3, 15, N)
ppg_pulse_width = np.random.normal(0.35, 0.08, N).clip(0.15, 0.6)
ppg_amplitude = ppg_max - ppg_min
ppg_rise_time = np.random.normal(0.12, 0.03, N).clip(0.05, 0.25)
ppg_fall_time = np.random.normal(0.23, 0.05, N).clip(0.1, 0.4)

base_glucose = 90
glucose = (
    base_glucose
    + 0.3 * age
    + 2.5 * bmi
    - 5 * physical_activity_level
    + 8 * has_diabetes_history * 10
    + 0.15 * systolic_bp
    + 3 * smoking_status
    + 20 * ppg_std
    - 15 * ppg_pulse_width
    + 0.3 * ppg_heart_rate
    + 10 * ppg_amplitude
    - 8 * ppg_rise_time
    + np.random.normal(0, 8, N)
)
glucose = np.round(glucose.clip(60, 350), 1)

df = pd.DataFrame({
    'ppg_mean': np.round(ppg_mean, 4),
    'ppg_std': np.round(ppg_std, 4),
    'ppg_max': np.round(ppg_max, 4),
    'ppg_min': np.round(ppg_min, 4),
    'ppg_peak_count': ppg_peak_count,
    'ppg_heart_rate': np.round(ppg_heart_rate, 1),
    'ppg_pulse_width': np.round(ppg_pulse_width, 4),
    'ppg_amplitude': np.round(ppg_amplitude, 4),
    'ppg_rise_time': np.round(ppg_rise_time, 4),
    'ppg_fall_time': np.round(ppg_fall_time, 4),
    'age': age,
    'gender': gender,
    'bmi': bmi,
    'systolic_bp': systolic_bp,
    'diastolic_bp': diastolic_bp,
    'has_diabetes_history': has_diabetes_history,
    'physical_activity_level': physical_activity_level,
    'smoking_status': smoking_status,
    'blood_glucose': glucose,
})

output_path = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'ppg_glucose_dataset.csv')
df.to_csv(output_path, index=False)
print(f"Dataset generated: {output_path}")
print(f"Shape: {df.shape}")
print(f"\nGlucose distribution:")
print(df['blood_glucose'].describe())
