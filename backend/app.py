import os
import pandas as pd
import numpy as np
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

# --- Data Loading and Processing ---

def load_wealth_data():
    """
    Reads and processes the wealth spreadsheet.
    """
    try:
        file_path = '../Planilha riqueza - MM.xlsx'
        df = pd.read_excel(file_path, sheet_name='Construção de Patrimônio', header=2)
        df.rename(columns={df.columns[0]: 'Date'}, inplace=True)
        df.dropna(subset=['Date'], inplace=True)
        df['Date'] = pd.to_datetime(df['Date'])
        df.set_index('Date', inplace=True)
        numeric_cols = df.select_dtypes(include='number').columns
        df[numeric_cols] = df[numeric_cols].fillna(0)
        df = df.replace({np.nan: None})
        return df
    except Exception as e:
        print(f"ERRO ao processar a planilha: {e}")
        return None

# --- Flask App Initialization ---

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app, origins=["*"])


# --- API Endpoints ---

@app.route('/api/performance', methods=['GET'])
def get_performance_data():
    df = load_wealth_data()
    if df is None:
        return jsonify({"error": "Failed to load data."}), 500
    performance_df = df['Riqueza'].resample('M').last().reset_index()
    performance_df['name'] = performance_df['Date'].dt.strftime('%Y-%m')
    
    # Replace any NaN that might have been introduced by resample
    performance_df.replace({np.nan: None}, inplace=True)

    chart_data = [
        {'name': row['name'], 'value': (round(row['Riqueza'], 2) if row['Riqueza'] is not None else None)}
        for _, row in performance_df.iterrows()
    ]
    return jsonify(chart_data)

@app.route('/api/portfolio/metrics', methods=['GET'])
def get_portfolio_metrics():
    df = load_wealth_data()
    if df is None:
        return jsonify({"error": "Failed to load data."}), 500
    latest_data = df.iloc[-1]
    first_data = df.iloc[0]
    holding_cols = ['BB', 'NUBANK', 'CEF']
    holdings = [{'symbol': col, 'name': col, 'value': round(latest_data[col], 2)} for col in holding_cols if col in latest_data and latest_data[col] > 0]
    initial_wealth = first_data['Riqueza']
    current_wealth = latest_data['Riqueza']
    return_percent = ((current_wealth - initial_wealth) / initial_wealth) * 100 if initial_wealth > 0 else 0
    metrics = {
        "totalValue": round(current_wealth, 2),
        "returnPercent": round(return_percent, 2),
        "holdings": holdings,
        "sharpeRatio": 0.87,
        "beta": 1.15,
        "var95": 2.3
    }
    return jsonify(metrics)

@app.route('/api/economic-indicators', methods=['GET'])
def get_economic_indicators():
    """Returns mock economic indicators."""
    indicators = {
        "brazilInflation": {"value": 4.2, "change": 0.1},
        "selicRate": {"value": 11.75},
        "usdBrl": {"value": 5.12, "change": -0.02},
        "oilPrice": {"value": 82.50, "change": 2.1}
    }
    return jsonify(indicators)

@app.route('/api/ai-insights', methods=['GET'])
def get_ai_insights():
    """Returns mock AI insights."""
    insights = [
        "Financial sector showing strong momentum with ITUB3 leading at +82.3%",
        "Energy exposure through PETR4 provides effective inflation hedge",
        "Consider diversifying beyond Brazilian market for risk reduction"
    ]
    return jsonify(insights)


# --- Static File Serving ---

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    if load_wealth_data() is not None:
        app.run(host='0.0.0.0', port=5000, debug=False)
