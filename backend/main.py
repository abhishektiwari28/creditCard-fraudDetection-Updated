from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import numpy as np
from utils import send_fraud_alert_email, generate_fraud_report
from typing import Optional

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model and Artifacts
current_dir = os.path.dirname(os.path.abspath(__file__))
artifacts_dir = os.path.join(current_dir, 'artifacts')

try:
    model = joblib.load(os.path.join(artifacts_dir, 'fraud_model.pkl'))
    scaler = joblib.load(os.path.join(artifacts_dir, 'scaler.pkl'))
    encoders = joblib.load(os.path.join(artifacts_dir, 'encoders.pkl'))
    print("Model and artifacts loaded successfully.")
except Exception as e:
    print(f"Error loading model/artifacts: {e}")
    model = None
    scaler = None
    encoders = None

# In-memory history store
history_db = []

class TransactionData(BaseModel):
    trans_date_trans_time: str
    merchant: str
    category: str
    amt: float
    gender: str
    state: str
    job: str
    city_pop: int
    lat: float
    long: float
    merch_lat: float
    merch_lon: float

class ChatQuery(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"message": "Fraud Detection API V3 is running"}

@app.post("/predict")
def predict_fraud(data: TransactionData):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Preprocess Input
        # 1. Calculate distance
        dist = np.sqrt((data.lat - data.merch_lat)**2 + (data.long - data.merch_lon)**2)
        
        input_dict = {
            'merchant': [data.merchant],
            'category': [data.category],
            'amt': [data.amt],
            'gender': [data.gender],
            'city_pop': [data.city_pop],
            'job': [data.job],
            'merch_lat': [data.merch_lat],
            'merch_lon': [data.merch_lon],
            'lat': [data.lat],
            'long': [data.long],
            'dist': [dist]
        }
        
        df_input = pd.DataFrame(input_dict)
        
        # 3. Apply Label Encoding
        for col, le in encoders.items():
            if col in df_input.columns:
                df_input[col] = df_input[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else 0)

        # 4. Scale
        X_scaled = scaler.transform(df_input)
        
        # 5. Predict
        probability = model.predict_proba(X_scaled)[0][1] # Probability of Class 1 (Fraud)
        prediction = model.predict(X_scaled)[0]
        
        # Risk Levels
        risk_score = float(probability)
        if risk_score < 0.20:
            risk_level = "Risk Free"
            is_fraud = False
        elif risk_score < 0.50:
            risk_level = "Low Risk"
            is_fraud = False
        elif risk_score < 0.80:
            risk_level = "Medium Risk"
            is_fraud = False
        elif risk_score < 0.95:
            risk_level = "High Risk"
            is_fraud = False # Flagged but not auto-confirmed fraud yet, but needs attention
        else:
            risk_level = "Fraud"
            is_fraud = True

        result = {
            "prediction": int(prediction),
            "risk_score": risk_score,
            "is_fraud": is_fraud,
            "risk_level": risk_level,
            "details": f"{risk_level} detected ({risk_score*100:.1f}%)"
        }
        
        # Save to history
        history_record = data.dict()
        history_record.update(result)
        history_record['id'] = len(history_db) + 1
        history_record['dist'] = float(dist)
        
        # Auto Actions for Fraud
        if risk_level == "Fraud":
            history_record['action_taken'] = "Card Blocked & Email Sent"
            send_fraud_alert_email("abhishektiwari2807@gmail.com", history_record)
        elif risk_level == "High Risk":
            history_record['action_taken'] = "Flagged for Review"
        else:
            history_record['action_taken'] = "None"

        history_db.append(history_record)
        
        return result

    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history():
    return history_db

@app.get("/visualize")
def get_visualization_data():
    return history_db

@app.get("/report/{id}")
def download_report(id: int):
    # Find transaction
    record = next((item for item in history_db if item["id"] == id), None)
    if not record:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    filepath = generate_fraud_report(record)
    return FileResponse(filepath, media_type='application/pdf', filename=f"report_{id}.pdf")

@app.post("/chat")
def chat_bot(query_data: ChatQuery):
    query = query_data.query.lower()
    
    # 1. Model Explainability
    if "why" in query and "flagged" in query:
        return {"response": "This transaction was flagged because of a high transaction amount combined with an unusual location distance from your typical spending area. The model identified these as the strongest contributing factors."}

    # 2. Daily stats / Fraud cases
    if "how many fraud" in query or "stats" in query:
        fraud_count = len([x for x in history_db if x['risk_level'] == 'Fraud'])
        total = len(history_db)
        return {"response": f"I have analyzed {total} transactions in this session. {fraud_count} were detected as potential fraud."}

    # 3. Top Merchants
    if "top 10 merchants" in query:
        # Simple counting logic
        merchants = [x['merchant'] for x in history_db if x['risk_level'] in ['High Risk', 'Fraud']]
        if not merchants:
            return {"response": "No high-risk merchants detected yet."}
        from collections import Counter
        common = Counter(merchants).most_common(10)
        list_str = ", ".join([f"{m} ({c})" for m, c in common])
        return {"response": f"Top merchants with high risk flags: {list_str}"}

    # 4. Training/Education
    if "randomforest" in query or "how it works" in query:
        return {"response": "I use a Random Forest Classifier. It works by constructing multiple decision trees during training and outputting the class that is the mode of the classes (classification) of the individual trees. It's excellent for handling complex fraud patterns."}
    
    # 5. Operational
    if "block" in query:
        return {"response": "If you suspect fraud, I recommend blocking the card immediately. I have already auto-blocked cards for transactions confirmed as Fraud (>95% risk)."}

    # Default
    return {"response": "I can help you with analyzing fraud patterns, explaining predictions, or showing statistics. Try asking 'Why was this flagged?' or 'Show stats'."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
