# User Service - Bank of Anthos Style
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import bcrypt
import sqlite3
import datetime
import os

app = Flask(__name__)
CORS(app)

# JWT Secret Key
JWT_SECRET = os.getenv('JWT_SECRET', 'ai-economic-advisor-secret-key')

# Database initialization
def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            account_number TEXT UNIQUE NOT NULL,
            balance REAL DEFAULT 10000.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create default users
    default_users = [
        {
            'username': 'admin',
            'email': 'admin@aieconomic.com',
            'password': 'admin123',
            'full_name': 'Administrator',
            'account_number': 'ACC001',
            'balance': 50000.00
        },
        {
            'username': 'investor',
            'email': 'investor@aieconomic.com', 
            'password': 'investor123',
            'full_name': 'João Silva',
            'account_number': 'ACC002',
            'balance': 25000.00
        },
        {
            'username': 'trader',
            'email': 'trader@aieconomic.com',
            'password': 'trader123', 
            'full_name': 'Maria Santos',
            'account_number': 'ACC003',
            'balance': 15000.00
        }
    ]
    
    for user in default_users:
        password_hash = bcrypt.hashpw(user['password'].encode('utf-8'), bcrypt.gensalt())
        cursor.execute('''
            INSERT OR IGNORE INTO users 
            (username, email, password_hash, full_name, account_number, balance)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user['username'], user['email'], password_hash, 
              user['full_name'], user['account_number'], user['balance']))
    
    conn.commit()
    conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'userservice'})

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user[3]):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate JWT token
        payload = {
            'user_id': user[0],
            'username': user[1],
            'account_number': user[5],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'full_name': user[4],
                'account_number': user[5],
                'balance': user[6]
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/user/<account_number>', methods=['GET'])
def get_user(account_number):
    try:
        # Verify JWT token
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token required'}), 401
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE account_number = ?', (account_number,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'full_name': user[4],
            'account_number': user[5],
            'balance': user[6],
            'created_at': user[7]
        })
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5001, debug=True)