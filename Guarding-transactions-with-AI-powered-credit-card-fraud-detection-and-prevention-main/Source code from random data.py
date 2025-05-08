import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Step 1: Load sample dataset (using synthetic data here for demo)
def generate_sample_data(n_samples=10000):
    np.random.seed(42)
    data = {
        'amount': np.random.exponential(scale=100, size=n_samples),
        'transaction_type': np.random.choice([0, 1], size=n_samples), # 0 = online, 1 = physical
        'location_difference': np.random.choice([0, 1], size=n_samples), # 1 if sudden far-away location
        'previous_fraud': np.random.choice([0, 1], size=n_samples, p=[0.95, 0.05]),
        'is_fraud': np.random.choice([0, 1], size=n_samples, p=[0.98, 0.02])
    }
    return pd.DataFrame(data)

# Step 2: Train a simple fraud detection model
def train_fraud_model(df):
    X = df.drop('is_fraud', axis=1)
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    print("Fraud Detection Model Evaluation:")
    print(classification_report(y_test, preds))
    
    return model

# Step 3: Guard transactions
class TransactionGuard:
    def __init__(self, model):
        self.model = model
        
    def assess_transaction(self, transaction):
        transaction_df = pd.DataFrame([transaction])
        prediction = self.model.predict(transaction_df)[0]
        
        if prediction == 1:
            print("🚨 Fraud detected! Transaction BLOCKED.")
            return False
        else:
            print("✅ Transaction allowed.")
            return True

# Step 4: Simulate a transaction
def simulate_transaction():
    transaction = {
        'amount': np.random.exponential(scale=100),
        'transaction_type': np.random.choice([0, 1]),
        'location_difference': np.random.choice([0, 1]),
        'previous_fraud': np.random.choice([0, 1]),
    }
    print(f"Processing transaction: {transaction}")
    return transaction

# Step 5: Main flow
if __name__ == "__main__":
    # Generate data and train model
    df = generate_sample_data()
    fraud_model = train_fraud_model(df)
    
    # Create the transaction guard
    guard = TransactionGuard(fraud_model)
    
    # Simulate and assess transactions
    for _ in range(5):
        tx = simulate_transaction()
        guard.assess_transaction(tx)
