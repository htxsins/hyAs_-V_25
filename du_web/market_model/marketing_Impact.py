from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import plotly.express as px
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import io

app = Flask(__name__)
CORS(app)

def analyze_data(df):
    summary = df.groupby(['Campaign_Type', 'Channel']).agg(
        total_spend=('Ad_Spend', 'sum'),
        total_enrollments=('Enrollments', 'sum'),
        total_leads=('Leads', 'sum')
    ).reset_index()

    summary['roi'] = summary['total_enrollments'] / summary['total_spend']
    summary['conversion_rate'] = summary['total_enrollments'] / summary['total_leads']

    X = df[['Ad_Spend', 'Impressions', 'Clicks', 'Leads', 'Applications']]
    y = df['Enrollments']
    model = LinearRegression()
    model.fit(X, y)
    r2 = r2_score(y, model.predict(X))

    suggestions = []
    if summary['conversion_rate'].mean() < 0.2:
        suggestions.append("Improve landing pages and lead nurturing.")
    if summary['roi'].mean() < 0.1:
        suggestions.append("Reallocate budget to high-performing campaigns.")
    if r2 < 0.75:
        suggestions.append("Collect more data or improve model features.")

    return summary.to_dict(orient='records'), suggestions, r2

@app.route('/api/marketing-insights', methods=['GET'])
def marketing_insights():
    df = pd.read_csv('indian_college_marketing_impact.csv')
    summary, suggestions, r2 = analyze_data(df)
    return jsonify({
        "summary": summary,
        "suggestions": suggestions,
        "r2": round(r2, 2)
    })

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Read the uploaded CSV file
        df = pd.read_csv(io.StringIO(file.read().decode('utf-8')))
        # Analyze the data
        summary, suggestions, r2 = analyze_data(df)
        return jsonify({
            "summary": summary,
            "suggestions": suggestions,
            "r2": round(r2, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)