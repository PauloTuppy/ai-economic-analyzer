#!/usr/bin/env python3
"""
Bank of Anthos Style - AI Economic Advisor
Start all banking microservices
"""

import subprocess
import sys
import time
import os

def start_service(service_name, port, script_path):
    """Start a microservice"""
    print(f"🚀 Starting {service_name} on port {port}...")
    
    env = os.environ.copy()
    env['FLASK_ENV'] = 'development'
    env['FLASK_DEBUG'] = '1'
    
    process = subprocess.Popen([
        sys.executable, script_path
    ], env=env, cwd=os.path.dirname(script_path))
    
    return process

def main():
    print("🏦 AI Economic Advisor - Banking Services")
    print("=" * 50)
    
    services = [
        ("User Service", 5001, "userservice/app.py"),
        ("Balance Service", 5002, "balanceservice/app.py"), 
        ("Transaction Service", 5003, "transactionservice/app.py")
    ]
    
    processes = []
    
    try:
        for service_name, port, script_path in services:
            process = start_service(service_name, port, script_path)
            processes.append((service_name, process))
            time.sleep(2)  # Wait between service starts
        
        print("\n✅ All services started successfully!")
        print("\n📊 Service URLs:")
        print("• User Service:        http://localhost:5001")
        print("• Balance Service:     http://localhost:5002") 
        print("• Transaction Service: http://localhost:5003")
        print("• Frontend:            http://localhost:3002")
        
        print("\n🔑 Default Login Credentials:")
        print("• Admin:    admin / admin123     (Balance: R$ 50,000)")
        print("• Investor: investor / investor123 (Balance: R$ 25,000)")
        print("• Trader:   trader / trader123   (Balance: R$ 15,000)")
        
        print("\n⚡ API Endpoints:")
        print("• POST /login - User authentication")
        print("• GET  /balance/<account> - Get account balance")
        print("• POST /withdraw - Withdraw funds for investments")
        print("• POST /buy - Buy investment assets")
        print("• POST /sell - Sell investment assets")
        print("• GET  /portfolio/<account> - Get portfolio holdings")
        
        print("\n🛑 Press Ctrl+C to stop all services")
        
        # Keep running until interrupted
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Stopping all services...")
        for service_name, process in processes:
            print(f"Stopping {service_name}...")
            process.terminate()
            process.wait()
        print("✅ All services stopped.")

if __name__ == "__main__":
    main()