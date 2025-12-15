import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report
import joblib
import os

def train():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, '../data/dataset.csv')
    print("Loading dataset...")
    df = pd.read_csv(dataset_path)
    
    # Feature Engineering
    # Calculate distance between user and merchant (simple euclidean on lat/long for demo)
    df['dist'] = np.sqrt((df['lat'] - df['merch_lat'])**2 + (df['long'] - df['merch_lon'])**2)
    
    # Drop columns that are likely unique or not useful for this simple model
    # trans_num, first, last, street, city, zip, trans_date_trans_time, dob
    # We keep state, category, merchant, amt, gender, job, city_pop, dist
    # (Note: merchant might have too many values for OneHot, we use LabelEncoding)
    
    keep_cols = ['category', 'amt', 'gender', 'city_pop', 'job', 'merch_lat', 'merch_lon', 'lat', 'long', 'dist', 'is_fraud']
    # actually merchant might be useful
    keep_cols.insert(0, 'merchant')
    
    df_clean = df[keep_cols].copy()
    
    # Label Encode Categorical
    le_dict = {}
    cat_cols = ['merchant', 'category', 'gender', 'job']
    for col in cat_cols:
        le = LabelEncoder()
        df_clean[col] = le.fit_transform(df_clean[col].astype(str))
        le_dict[col] = le
    
    X = df_clean.drop('is_fraud', axis=1)
    y = df_clean['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Training Random Forest Model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train_scaled, y_train)
    
    print("Evaluating...")
    y_pred = model.predict(X_test_scaled)
    print(classification_report(y_test, y_pred))
    
    # Save Artifacts
    artifacts_dir = os.path.join(current_dir, 'artifacts')
    if not os.path.exists(artifacts_dir):
        os.makedirs(artifacts_dir)
        
    joblib.dump(model, os.path.join(artifacts_dir, 'fraud_model.pkl'))
    joblib.dump(scaler, os.path.join(artifacts_dir, 'scaler.pkl'))
    joblib.dump(le_dict, os.path.join(artifacts_dir, 'encoders.pkl'))
    
    print(f"Model, Scaler, and Encoders saved to {artifacts_dir}")

if __name__ == "__main__":
    train()
