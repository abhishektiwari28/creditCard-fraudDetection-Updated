...\backend> pip install -r requirements.txt   
...\backend> python main.py  #uvicorn main:app --reload --port 8000


...\frontend> npm install
...\frontend> npm run dev




Low Risk:
Merchant   merchant_448
Category   Grocery POS
Amount	   90.18
Gender	   F
Job        Pathologist
City Pop   151785
lat        36.522  
lon        -87.349
mer lat    37.179198  
mer lon    -87.48538



Fraud:
Merchant: fraud_merchant_6
Category: entertainment
amount: 320.02
gender: F
job: Job_21
city pop: 377528
latitude: 36.64508982420638
longitude: -97.44168729994205
merchant Latitude: 36.85395341921114
merchant longitude: -99.40135742382182




AI Chatbot Inputs:
Why was this transaction flagged as fraud?
Show me top 10 merchants with highest fraud risk today.
What patterns are common in flagged transactions?
How many fraud cases were detected in the last 24 hours?
What is the average fraud amount compared to legitimate transactions?
Explain how RandomForest works in fraud detection.
Why is distance between merchant and customer important?
Should we block this card immediately?
Do you want to retrain the model with new data?