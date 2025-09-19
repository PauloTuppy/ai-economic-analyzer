# Balance Service - Bank of Anthos Style
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import sqlite3
import datetime
import os

app = Flask(__name__)
CORS(app)

JWT_SECRET = os.getenv('JWT_SECRET', 'ai-economic-advisor-secret-key')

def init_db():
    conn = sqlite3.connect('balances.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS account_balances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_number TEXT UNIQUE NOT NULL,
            balance REAL NOT NULL DEFAULT 0.00,
            available_balance REAL NOT NULL DEFAULT 0.00,
            currency TEXT DEFAULT 'BRL',
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_number TEXT NOT NULL,
            transaction_type TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            reference_id TEXT,
            status TEXT DEFAULT 'completed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Initialize default balances
    default_balances = [
        {'account_number': 'ACC001', 'balance': 50000.00, 'available_balance': 50000.00},
        {'account_number': 'ACC002', 'balance': 25000.00, 'available_balance': 25000.00},
        {'account_number': 'ACC003', 'balance': 15000.00, 'available_balance': 15000.00}
    ]
    
    for balance in default_balances:
        cursor.execute('''
            INSERT OR IGNORE INTO account_balances 
            (account_number, balance, available_balance)
            VALUES (?, ?, ?)
        ''', (balance['account_number'], balance['balance'], balance['available_balance']))
    
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
    return jsonify({'status': 'healthy', 'service': 'balanceservice'})

@app.route('/balance/<account_number>', methods=['GET'])
def get_balance(account_number):
    try:
        payload = verify_token()
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        conn = sqlite3.connect('balances.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM account_balances WHERE account_number = ?', (account_number,))
        balance = cursor.fetchone()
        conn.close()
        
        if not balance:
            return jsonify({'error': 'Account not found'}), 404
        
        return jsonify({
            'account_number': balance[1],
            'balance': balance[2],
            'available_balance': balance[3],
            'currency': balance[4],
            'last_updated': balance[5]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/withdraw', methods=['POST'])
def withdraw():
    try:
        payload = verify_token()
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        data = request.get_json()
        account_number = data.get('account_number')
        amount = float(data.get('amount', 0))
        description = data.get('description', 'Investment withdrawal')
        
        if amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400
        
        conn = sqlite3.connect('balances.db')
        cursor = conn.cursor()
        
        # Check current balance
        cursor.execute('SELECT balance, available_balance FROM account_balances WHERE account_number = ?', 
                      (account_number,))
        balance_data = cursor.fetchone()
        
        if not balance_data:
            conn.close()
            return jsonify({'error': 'Account not found'}), 404
        
        current_balance, available_balance = balance_data
        
        if available_balance < amount:
            conn.close()
            return jsonify({'error': 'Insufficient funds'}), 400
        
        # Update balance
        new_balance = current_balance - amount
        new_available = available_balance - amount
        
        cursor.execute('''
            UPDATE account_balances 
            SET balance = ?, available_balance = ?, last_updated = CURRENT_TIMESTAMP
            WHERE account_number = ?
        ''', (new_balance, new_available, account_number))
        
        # Record transaction
        cursor.execute('''
            INSERT INTO transactions 
            (account_number, transaction_type, amount, description, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (account_number, 'withdrawal', amount, description, 'completed'))
        
        transaction_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'transaction_id': transaction_id,
            'account_number': account_number,
            'amount': amount,
            'new_balance': new_balance,
            'status': 'completed',
            'description': description
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/deposit', methods=['POST'])
def deposit():
    try:
        payload = verify_token()
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        data = request.get_json()
        account_number = data.get('account_number')
        amount = float(data.get('amount', 0))
        description = data.get('description', 'Investment return')
        
        if amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400
        
        conn = sqlite3.connect('balances.db')
        cursor = conn.cursor()
        
        # Check if account exists
        cursor.execute('SELECT balance, available_balance FROM account_balances WHERE account_number = ?', 
                      (account_number,))
        balance_data = cursor.fetchone()
        
        if not balance_data:
            conn.close()
            return jsonify({'error': 'Account not found'}), 404
        
        current_balance, available_balance = balance_data
        
        # Update balance
        new_balance = current_balance + amount
        new_available = available_balance + amount
        
        cursor.execute('''
            UPDATE account_balances 
            SET balance = ?, available_balance = ?, last_updated = CURRENT_TIMESTAMP
            WHERE account_number = ?
        ''', (new_balance, new_available, account_number))
        
        # Record transaction
        cursor.execute('''
            INSERT INTO transactions 
            (account_number, transaction_type, amount, description, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (account_number, 'deposit', amount, description, 'completed'))
        
        transaction_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'transaction_id': transaction_id,
            'account_number': account_number,
            'amount': amount,
            'new_balance': new_balance,
            'status': 'completed',
            'description': description
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transactions/<account_number>', methods=['GET'])
def get_transactions(account_number):
    try:
        payload = verify_token()
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        limit = request.args.get('limit', 10, type=int)
        
        conn = sqlite3.connect('balances.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM transactions 
            WHERE account_number = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        ''', (account_number, limit))
        
        transactions = cursor.fetchall()
        conn.close()
        
        result = []
        for tx in transactions:
            result.append({
                'id': tx[0],
                'account_number': tx[1],
                'transaction_type': tx[2],
                'amount': tx[3],
                'description': tx[4],
                'reference_id': tx[5],
                'status': tx[6],
                'created_at': tx[7]
            })
        
        return jsonify({'transactions': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5002, debug=True)