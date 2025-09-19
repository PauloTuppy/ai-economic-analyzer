# Transaction Service - Investment Orders
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import sqlite3
import datetime
import requests
import os
import uuid

app = Flask(__name__)
CORS(app)

JWT_SECRET = os.getenv('JWT_SECRET', 'ai-economic-advisor-secret-key')
BALANCE_SERVICE_URL = os.getenv('BALANCE_SERVICE_URL', 'http://localhost:5002')

def init_db():
    conn = sqlite3.connect('transactions.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS investment_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT UNIQUE NOT NULL,
            account_number TEXT NOT NULL,
            symbol TEXT NOT NULL,
            order_type TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            executed_at TIMESTAMP,
            notes TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS portfolio_holdings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_number TEXT NOT NULL,
            symbol TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            average_price REAL NOT NULL,
            total_invested REAL NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(account_number, symbol)
        )
    ''')
    
    conn.commit()
    conn.close()

def verify_token():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except:
        return None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'transactionservice'})

@app.route('/buy', methods=['POST'])
def buy_asset():
    try:
        payload = verify_token()
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        data = request.get_json()
        account_number = data.get('account_number')
        symbol = data.get('symbol')
        quantity = int(data.get('quantity', 0))
        price = float(data.get('price', 0))
        
        if quantity <= 0 or price <= 0:
            return jsonify({'error': 'Invalid quantity or price'}), 400
        
        total_amount = quantity * price
        order_id = str(uuid.uuid4())
        
        # Check balance via Balance Service
        headers = {'Authorization': request.headers.get('Authorization')}
        balance_response = requests.get(f'{BALANCE_SERVICE_URL}/balance/{account_number}', headers=headers)
        
        if balance_response.status_code != 200:
            return jsonify({'error': 'Could not verify balance'}), 400
        
        balance_data = balance_response.json()
        if balance_data['available_balance'] < total_amount:
            return jsonify({'error': 'Insufficient funds'}), 400
        
        # Create order
        conn = sqlite3.connect('transactions.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO investment_orders 
            (order_id, account_number, symbol, order_type, quantity, price, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (order_id, account_number, symbol, 'buy', quantity, price, total_amount, 'pending'))
        
        # Withdraw from balance
        withdraw_data = {
            'account_number': account_number,
            'amount': total_amount,
            'description': f'Purchase of {quantity} shares of {symbol}'
        }
        
        withdraw_response = requests.post(f'{BALANCE_SERVICE_URL}/withdraw', 
                                        json=withdraw_data, headers=headers)
        
        if withdraw_response.status_code != 200:
            conn.rollback()
            conn.close()
            return jsonify({'error': 'Transaction failed'}), 400
        
        # Update portfolio holdings
        cursor.execute('''
            SELECT quantity, average_price, total_invested FROM portfolio_holdings 
            WHERE account_number = ? AND symbol = ?
        ''', (account_number, symbol))
        
        existing = cursor.fetchone()
        
        if existing:
            # Update existing holding
            old_quantity, old_avg_price, old_total = existing
            new_quantity = old_quantity + quantity
            new_total = old_total + total_amount
            new_avg_price = new_total / new_quantity
            
            cursor.execute('''
                UPDATE portfolio_holdings 
                SET quantity = ?, average_price = ?, total_invested = ?, last_updated = CURRENT_TIMESTAMP
                WHERE account_number = ? AND symbol = ?
            ''', (new_quantity, new_avg_price, new_total, account_number, symbol))
        else:
            # Create new holding
            cursor.execute('''
                INSERT INTO portfolio_holdings 
                (account_number, symbol, quantity, average_price, total_invested)
                VALUES (?, ?, ?, ?, ?)
            ''', (account_number, symbol, quantity, price, total_amount))
        
        # Mark order as executed
        cursor.execute('''
            UPDATE investment_orders 
            SET status = 'executed', executed_at = CURRENT_TIMESTAMP
            WHERE order_id = ?
        ''', (order_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'order_id': order_id,
            'status': 'executed',
            'symbol': symbol,
            'quantity': quantity,
            'price': price,
            'total_amount': total_amount,
            'message': f'Successfully purchased {quantity} shares of {symbol}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/sell', methods=['POST'])
def sell_asset():
    try:
        payload = verify_token()
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        data = request.get_json()
        account_number = data.get('account_number')
        symbol = data.get('symbol')
        quantity = int(data.get('quantity', 0))
        price = float(data.get('price', 0))
        
        if quantity <= 0 or price <= 0:
            return jsonify({'error': 'Invalid quantity or price'}), 400
        
        total_amount = quantity * price
        order_id = str(uuid.uuid4())
        
        conn = sqlite3.connect('transactions.db')
        cursor = conn.cursor()
        
        # Check if user has enough shares
        cursor.execute('''
            SELECT quantity FROM portfolio_holdings 
            WHERE account_number = ? AND symbol = ?
        ''', (account_number, symbol))
        
        holding = cursor.fetchone()
        if not holding or holding[0] < quantity:
            conn.close()
            return jsonify({'error': 'Insufficient shares'}), 400
        
        # Create sell order
        cursor.execute('''
            INSERT INTO investment_orders 
            (order_id, account_number, symbol, order_type, quantity, price, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (order_id, account_number, symbol, 'sell', quantity, price, total_amount, 'pending'))
        
        # Update portfolio holdings
        new_quantity = holding[0] - quantity
        
        if new_quantity == 0:
            cursor.execute('''
                DELETE FROM portfolio_holdings 
                WHERE account_number = ? AND symbol = ?
            ''', (account_number, symbol))
        else:
            cursor.execute('''
                UPDATE portfolio_holdings 
                SET quantity = ?, last_updated = CURRENT_TIMESTAMP
                WHERE account_number = ? AND symbol = ?
            ''', (new_quantity, account_number, symbol))
        
        # Deposit to balance
        headers = {'Authorization': request.headers.get('Authorization')}
        deposit_data = {
            'account_number': account_number,
            'amount': total_amount,
            'description': f'Sale of {quantity} shares of {symbol}'
        }
        
        deposit_response = requests.post(f'{BALANCE_SERVICE_URL}/deposit', 
                                       json=deposit_data, headers=headers)
        
        if deposit_response.status_code != 200:
            conn.rollback()
            conn.close()
            return jsonify({'error': 'Transaction failed'}), 400
        
        # Mark order as executed
        cursor.execute('''
            UPDATE investment_orders 
            SET status = 'executed', executed_at = CURRENT_TIMESTAMP
            WHERE order_id = ?
        ''', (order_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'order_id': order_id,
            'status': 'executed',
            'symbol': symbol,
            'quantity': quantity,
            'price': price,
            'total_amount': total_amount,
            'message': f'Successfully sold {quantity} shares of {symbol}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/portfolio/<account_number>', methods=['GET'])
def get_portfolio(account_number):
    try:
        payload = verify_token()
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        conn = sqlite3.connect('transactions.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT symbol, quantity, average_price, total_invested, last_updated
            FROM portfolio_holdings 
            WHERE account_number = ?
        ''', (account_number,))
        
        holdings = cursor.fetchall()
        conn.close()
        
        portfolio = []
        for holding in holdings:
            portfolio.append({
                'symbol': holding[0],
                'quantity': holding[1],
                'average_price': holding[2],
                'total_invested': holding[3],
                'last_updated': holding[4]
            })
        
        return jsonify({'portfolio': portfolio})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/orders/<account_number>', methods=['GET'])
def get_orders(account_number):
    try:
        payload = verify_token()
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        limit = request.args.get('limit', 20, type=int)
        
        conn = sqlite3.connect('transactions.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM investment_orders 
            WHERE account_number = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        ''', (account_number, limit))
        
        orders = cursor.fetchall()
        conn.close()
        
        result = []
        for order in orders:
            result.append({
                'order_id': order[1],
                'symbol': order[3],
                'order_type': order[4],
                'quantity': order[5],
                'price': order[6],
                'total_amount': order[7],
                'status': order[8],
                'created_at': order[9],
                'executed_at': order[10],
                'notes': order[11]
            })
        
        return jsonify({'orders': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5003, debug=True)