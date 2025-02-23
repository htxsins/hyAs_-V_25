from flask import Flask, request, send_file, render_template_string
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)

# Load and prepare data
with open('final_synthetic_trend_data.json', 'r') as file:
    data = json.load(file)

records = []
for entry in data:
    for branch, categories in entry['branches'].items():
        for category, students in categories.items():
            records.append({'Year': entry['year'], 'Branch': branch, 'Category': category, 'Students': students})

df = pd.DataFrame(records)
X = pd.get_dummies(df.drop(columns=['Students']))
y = df['Students']

# Train model
model = RandomForestRegressor(random_state=42)
model.fit(X, y)

# Generate predictions for future years
predictions = []
for year in [2025, 2026]:
    for branch in df['Branch'].unique():
        for category in df['Category'].unique():
            future_entry = pd.DataFrame([{**{col: 0 for col in X.columns}, 'Year': year, f'Branch_{branch}': 1, f'Category_{category}': 1}])
            prediction = model.predict(future_entry)[0]
            predictions.append({
                'Year': year,
                'Branch': branch,
                'Category': category,
                'Prediction': round(prediction)
            })

predictions_df = pd.DataFrame(predictions)
predictions_csv = 'predictions_2025_2026.csv'
predictions_df.to_csv(predictions_csv, index=False)

def create_actual_vs_predicted_plot():
    # Get predictions for training data
    y_pred = model.predict(X)
    
    # Create the scatter plot
    plt.figure(figsize=(10, 6))
    plt.scatter(y, y_pred, alpha=0.5)
    
    # Add perfect prediction line
    min_val = min(min(y), min(y_pred))
    max_val = max(max(y), max(y_pred))
    plt.plot([min_val, max_val], [min_val, max_val], 'r--', label='Perfect Prediction')
    
    plt.xlabel('Actual Values')
    plt.ylabel('Predicted Values')
    plt.title('Actual vs Predicted Values')
    
    # Add R² score and RMSE
    r2 = r2_score(y, y_pred)
    rmse = np.sqrt(mean_squared_error(y, y_pred))
    plt.text(0.05, 0.95, f'R² Score: {r2:.3f}\nRMSE: {rmse:.2f}', 
             transform=plt.gca().transAxes, 
             bbox=dict(facecolor='white', alpha=0.8))
    
    # Save plot to base64 string
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    plt.close()
    return base64.b64encode(buf.getvalue()).decode('utf-8')

html_template = """
<!DOCTYPE html>
<html>
<head>
    <title>Predictions for 2025 and 2026</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 8px; text-align: left; }
        .container { max-width: 1200px; margin: 0 auto; }
        .plot-container { margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Predictions for 2025 and 2026 by Category and Branch</h1>
        <a href="/download" class="download-btn">Download Predictions CSV</a>
        
        <div class="plot-container">
            <h2>Model Performance: Actual vs Predicted Values</h2>
            <img src="data:image/png;base64,{{ plot_data }}" alt="Actual vs Predicted Plot">
        </div>

        <h2>Predictions:</h2>
        <table border="1">
            <tr><th>Year</th><th>Branch</th><th>Category</th><th>Prediction</th></tr>
            {% for row in predictions %}
            <tr><td>{{ row.Year }}</td><td>{{ row.Branch }}</td><td>{{ row.Category }}</td><td>{{ row.Prediction }}</td></tr>
            {% endfor %}
        </table>
    </div>
</body>
</html>
"""

@app.route('/', methods=['GET'])
def home():
    plot_data = create_actual_vs_predicted_plot()
    return render_template_string(html_template, predictions=predictions, plot_data=plot_data)

@app.route('/download', methods=['GET'])
def download():
    return send_file(predictions_csv, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)