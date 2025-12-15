import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

def generate_data(num_records=5000):
    np.random.seed(42)
    random.seed(42)
    
    # Categories and Merchants
    categories = ['grocery_pos', 'entertainment', 'shopping_pos', 'misc_pos', 'shopping_net', 'gas_transport', 'personal_care', 'health_fitness', 'travel', 'kids_pets', 'grocery_net', 'food_dining', 'home']
    merchants = [f'fraud_merchant_{i}' for i in range(50)] + [f'merchant_{i}' for i in range(500)]
    
    # Generate Base Data
    data = []
    start_date = datetime(2024, 1, 1)
    
    print(f"Generating {num_records} records with new schema...")
    
    for i in range(num_records):
        is_fraud = 1 if i < num_records * 0.005 else 0 # 0.5% fraud rate
        
        # Date & Time
        trans_time = start_date + timedelta(seconds=np.random.randint(0, 31536000)) # Within 1 year
        trans_date_trans_time = trans_time.strftime("%Y-%m-%d %H:%M:%S")
        unix_time = int(trans_time.timestamp())
        
        # Transaction Info
        category = random.choice(categories)
        merchant = random.choice(merchants if is_fraud == 0 else merchants[:10]) # Frauds tend to cluster in some merchants
        amt = round(np.random.exponential(50) + (200 if is_fraud else 0), 2) # Higher amount for fraud
        
        # Card Info
        cc_num = f"{random.randint(1000,9999)}********{random.randint(1000,9999)}"
        
        # User Info
        first = f"User{i}"
        last = f"Name{i}"
        gender = random.choice(['M', 'F'])
        job = f"Job_{random.randint(1, 100)}"
        dob = (datetime(1960, 1, 1) + timedelta(days=random.randint(0, 15000))).strftime("%Y-%m-%d")
        
        # Location (simulate distance for fraud)
        lat = 35.0 + np.random.normal(0, 2)
        long = -95.0 + np.random.normal(0, 2)
        city_pop = random.randint(5000, 1000000)
        
        merch_lat = lat + (np.random.normal(0, 0.02) if not is_fraud else np.random.normal(0, 1.0)) # Fraud is further away
        merch_lon = long + (np.random.normal(0, 0.02) if not is_fraud else np.random.normal(0, 1.0))
        
        state = random.choice(['TX', 'NY', 'CA', 'FL', 'IL'])
        city = f"City_{random.randint(1,100)}"
        zip_code = random.randint(10000, 99999)
        street = f"{random.randint(1,999)} Main St"
        
        trans_num = f"txn_{unix_time}_{i}"
        
        data.append([
            trans_date_trans_time, cc_num, merchant, category, amt, first, last, gender, 
            street, city, state, zip_code, lat, long, city_pop, job, dob, trans_num, 
            unix_time, merch_lat, merch_lon, is_fraud
        ])
        
    cols = [
        'trans_date_trans_time', 'cc_num', 'merchant', 'category', 'amt', 'first', 'last', 'gender', 
        'street', 'city', 'state', 'zip', 'lat', 'long', 'city_pop', 'job', 'dob', 'trans_num', 
        'unix_time', 'merch_lat', 'merch_lon', 'is_fraud'
    ]
    
    df = pd.DataFrame(data, columns=cols)
    df.to_csv('data/dataset.csv', index=False)
    print("New dataset saved to data/dataset.csv")

if __name__ == "__main__":
    generate_data(5000)
