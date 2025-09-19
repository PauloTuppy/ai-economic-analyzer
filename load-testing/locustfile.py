#!/usr/bin/env python3
"""
Load Testing for AI Economic Advisor - Bank of Anthos Style
Simulates realistic banking and investment operations
"""

from locust import HttpUser, task, between
import json
import random
import time

class BankingUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        """Login when user starts"""
        self.login()
    
    def login(self):
        """Authenticate user"""
        users = [
            {"username": "admin", "password": "admin123"},
            {"username": "investor", "password": "investor123"},
            {"username": "trader", "password": "trader123"}
        ]
        
        user_creds = random.choice(users)
        
        response = self.client.post("/login", json=user_creds, 
                                  headers={"Content-Type": "application/json"})
        
        if response.status_code == 200:
            data = response.json()
            self.token = data.get("token")
            self.user_data = data.get("user")
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            self.token = None
            self.headers = {}
    
    @task(3)
    def view_dashboard(self):
        """View main dashboard"""
        self.client.get("/", name="dashboard")
    
    @task(2)
    def check_balance(self):
        """Check account balance"""
        if not self.token:
            return
            
        account_number = self.user_data.get("account_number")
        self.client.get(f"/balance/{account_number}", 
                       headers=self.headers, name="check_balance")
    
    @task(2)
    def view_portfolio(self):
        """View investment portfolio"""
        if not self.token:
            return
            
        account_number = self.user_data.get("account_number")
        self.client.get(f"/portfolio/{account_number}", 
                       headers=self.headers, name="view_portfolio")
    
    @task(1)
    def buy_stock(self):
        """Buy stock simulation"""
        if not self.token:
            return
        
        stocks = ["PETR4", "ITUB3", "BIDI4", "KNRI11", "HGLG11"]
        stock = random.choice(stocks)
        quantity = random.randint(10, 100)
        price = round(random.uniform(15.0, 25.0), 2)
        
        order_data = {
            "account_number": self.user_data.get("account_number"),
            "symbol": stock,
            "quantity": quantity,
            "price": price
        }
        
        self.client.post("/buy", json=order_data, 
                        headers=self.headers, name="buy_stock")
    
    @task(1)
    def sell_stock(self):
        """Sell stock simulation"""
        if not self.token:
            return
        
        stocks = ["PETR4", "ITUB3", "BIDI4"]
        stock = random.choice(stocks)
        quantity = random.randint(5, 50)
        price = round(random.uniform(18.0, 28.0), 2)
        
        order_data = {
            "account_number": self.user_data.get("account_number"),
            "symbol": stock,
            "quantity": quantity,
            "price": price
        }
        
        self.client.post("/sell", json=order_data, 
                        headers=self.headers, name="sell_stock")
    
    @task(1)
    def view_transaction_history(self):
        """View transaction history"""
        if not self.token:
            return
            
        account_number = self.user_data.get("account_number")
        self.client.get(f"/orders/{account_number}?limit=20", 
                       headers=self.headers, name="transaction_history")
    
    @task(1)
    def ai_chat(self):
        """Simulate AI chat interaction"""
        questions = [
            "Qual é a melhor estratégia de investimento?",
            "Como está o mercado hoje?",
            "Devo comprar mais PETR4?",
            "Qual o risco do meu portfolio?",
            "Recomende uma diversificação"
        ]
        
        question = random.choice(questions)
        chat_data = {"message": question}
        
        self.client.post("/ai/chat", json=chat_data, 
                        headers=self.headers, name="ai_chat")
    
    @task(1)
    def health_check(self):
        """Health check for services"""
        services = [
            ("userservice", 5001),
            ("balanceservice", 5002),
            ("transactionservice", 5003)
        ]
        
        service_name, port = random.choice(services)
        self.client.get(f"http://localhost:{port}/health", 
                       name=f"health_{service_name}")

class HighVolumeTrader(HttpUser):
    """Simulates high-frequency trading user"""
    wait_time = between(0.1, 0.5)
    weight = 1
    
    def on_start(self):
        self.login_trader()
    
    def login_trader(self):
        """Login as trader"""
        response = self.client.post("/login", 
                                  json={"username": "trader", "password": "trader123"})
        if response.status_code == 200:
            data = response.json()
            self.token = data.get("token")
            self.user_data = data.get("user")
            self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(5)
    def rapid_trading(self):
        """Rapid buy/sell operations"""
        if not self.token:
            return
        
        # Quick buy
        stock = random.choice(["PETR4", "ITUB3"])
        quantity = random.randint(1, 10)
        price = round(random.uniform(19.0, 21.0), 2)
        
        buy_data = {
            "account_number": self.user_data.get("account_number"),
            "symbol": stock,
            "quantity": quantity,
            "price": price
        }
        
        self.client.post("/buy", json=buy_data, headers=self.headers)
        
        # Quick sell (simulate day trading)
        time.sleep(0.1)
        sell_price = price + random.uniform(-0.5, 0.5)
        
        sell_data = {
            "account_number": self.user_data.get("account_number"),
            "symbol": stock,
            "quantity": quantity,
            "price": round(sell_price, 2)
        }
        
        self.client.post("/sell", json=sell_data, headers=self.headers)

class AIAnalysisUser(HttpUser):
    """Simulates users heavily using AI features"""
    wait_time = between(2, 5)
    weight = 1
    
    def on_start(self):
        self.login_investor()
    
    def login_investor(self):
        """Login as investor"""
        response = self.client.post("/login", 
                                  json={"username": "investor", "password": "investor123"})
        if response.status_code == 200:
            data = response.json()
            self.token = data.get("token")
            self.user_data = data.get("user")
            self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(3)
    def ai_portfolio_optimization(self):
        """Request AI portfolio optimization"""
        if not self.token:
            return
        
        self.client.post("/ai/optimize", 
                        json={"account_number": self.user_data.get("account_number")},
                        headers=self.headers, name="ai_optimize")
    
    @task(2)
    def market_predictions(self):
        """Get market predictions"""
        stocks = ["PETR4", "ITUB3", "BIDI4"]
        stock = random.choice(stocks)
        
        self.client.get(f"/ai/predict/{stock}", 
                       headers=self.headers, name="market_predictions")
    
    @task(2)
    def risk_analysis(self):
        """Get risk analysis"""
        self.client.get(f"/ai/risk/{self.user_data.get('account_number')}", 
                       headers=self.headers, name="risk_analysis")

# Load test scenarios
class LoadTestScenarios:
    """Different load test scenarios"""
    
    @staticmethod
    def normal_load():
        """Normal business hours load"""
        return {
            "BankingUser": 70,
            "HighVolumeTrader": 20,
            "AIAnalysisUser": 10
        }
    
    @staticmethod
    def peak_load():
        """Peak trading hours load"""
        return {
            "BankingUser": 50,
            "HighVolumeTrader": 40,
            "AIAnalysisUser": 10
        }
    
    @staticmethod
    def stress_test():
        """Stress test scenario"""
        return {
            "BankingUser": 40,
            "HighVolumeTrader": 50,
            "AIAnalysisUser": 10
        }

if __name__ == "__main__":
    print("🚀 AI Economic Advisor Load Testing")
    print("===================================")
    print("Available user types:")
    print("- BankingUser: Normal banking operations")
    print("- HighVolumeTrader: High-frequency trading")
    print("- AIAnalysisUser: AI-heavy operations")
    print("")
    print("Run with: locust -f locustfile.py --host=http://localhost:3002")