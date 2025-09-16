#!/usr/bin/env python3
"""
Enhanced AI Economic Advisor - Main Application
Version: 2.0
Author: AI Economic Advisor Team
"""

import os
import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import redis
import numpy as np
import pandas as pd
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, 
           static_folder='../frontend', 
           template_folder='../frontend')

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.getenv('FLASK_ENV') == 'development'

# Initialize SocketIO
socketio = SocketIO(
    app, 
    cors_allowed_origins="*", 
    async_mode='eventlet',
    logger=True,
    engineio_logger=True
)

# Enable CORS
CORS(app, origins=os.getenv('CORS_ORIGINS', '*').split(','))

# Redis connection
def init_redis():
    try:
        redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=0,
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True
        )
        redis_client.ping()
        logger.info("✅ Redis conectado com sucesso")
        return redis_client
    except Exception as e:
        logger.warning(f"⚠️ Redis não disponível: {e}")
        return None

redis_client = init_redis()

# Import services
try:
    from services.gemini_service import GeminiService
    from services.market_data import MarketDataService
    from services.cache_service import CacheService
    from models.portfolio import PortfolioAnalyzer
    from models.risk_metrics import RiskCalculator
    from models.economic_data import EconomicDataManager
    
    # Initialize services
    gemini_service = GeminiService()
    market_service = MarketDataService()
    cache_service = CacheService(redis_client)
    portfolio_analyzer = PortfolioAnalyzer()
    risk_calculator = RiskCalculator()
    economic_manager = EconomicDataManager()
    
    logger.info("✅ Todos os serviços inicializados com sucesso")
    
except ImportError as e:
    logger.error(f"❌ Erro ao importar serviços: {e}")
    # Initialize with None for graceful degradation
    gemini_service = None
    market_service = None
    cache_service = None
    portfolio_analyzer = None
    risk_calculator = None
    economic_manager = None

# Routes
@app.route('/')
def index():
    """Serve main application page"""
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('../frontend', filename)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    health_status = {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0',
        'services': {
            'redis': redis_client is not None,
            'gemini': gemini_service.is_available() if gemini_service else False,
            'market_data': market_service.is_available() if market_service else False,
            'portfolio_analyzer': portfolio_analyzer is not None,
            'risk_calculator': risk_calculator is not None
        },
        'environment': os.getenv('FLASK_ENV', 'production')
    }
    
    # Check if critical services are down
    critical_services = ['gemini', 'market_data']
    if not any(health_status['services'][service] for service in critical_services):
        health_status['status'] = 'degraded'
        return jsonify(health_status), 503
    
    return jsonify(health_status)

@app.route('/api/portfolio/metrics', methods=['GET'])
def get_portfolio_metrics():
    """Get comprehensive portfolio metrics"""
    try:
        # Check cache first
        cache_key = 'portfolio_metrics'
        if cache_service:
            cached_data = cache_service.get(cache_key)
            if cached_data:
                return jsonify(cached_data)
        
        # Sample portfolio data (in production, this would come from database)
        portfolio_data = {
            'total_value': 300910.6,
            'total_return': 0.1887,
            'total_return_brl': 56720.6,
            'last_updated': datetime.now().isoformat(),
            'holdings': [
                {
                    'symbol': 'PETR4',
                    'name': 'Petrobras PN',
                    'quantity': 3600,
                    'current_price': 19.8,
                    'value': 71280,
                    'return': 0.213,
                    'return_brl': 13480,
                    'weight': 0.237,
                    'sector': 'Energy'
                },
                {
                    'symbol': 'ITUB3',
                    'name': 'Itaú Unibanco',
                    'quantity': 1100,
                    'current_price': 80.0,
                    'value': 88000,
                    'return': 0.823,
                    'return_brl': 39600,
                    'weight': 0.292,
                    'sector': 'Financial'
                },
                {
                    'symbol': 'BIDI4',
                    'name': 'Banco Inter',
                    'quantity': 800,
                    'current_price': 45.2,
                    'value': 36160,
                    'return': 0.156,
                    'return_brl': 4880,
                    'weight': 0.120,
                    'sector': 'Financial'
                },
                {
                    'symbol': 'KNRI11',
                    'name': 'Kinea Renda Imobiliária',
                    'quantity': 500,
                    'current_price': 95.5,
                    'value': 47750,
                    'return': 0.089,
                    'return_brl': 3900,
                    'weight': 0.159,
                    'sector': 'Real Estate'
                },
                {
                    'symbol': 'CASH',
                    'name': 'Caixa/Renda Fixa',
                    'quantity': 1,
                    'current_price': 57720.6,
                    'value': 57720.6,
                    'return': 0.051,
                    'return_brl': 2800,
                    'weight': 0.192,
                    'sector': 'Cash'
                }
            ]
        }
        
        # Calculate risk metrics if service available
        if risk_calculator:
            risk_metrics = risk_calculator.calculate_portfolio_risk(portfolio_data)
            portfolio_data.update(risk_metrics)
        else:
            # Fallback risk metrics
            portfolio_data.update({
                'var_95': -0.023,
                'var_99': -0.041,
                'beta': 1.15,
                'volatility': 0.185,
                'sharpe_ratio': 0.87,
                'max_drawdown': -0.089
            })
        
        # Cache the result
        if cache_service:
            cache_service.set(cache_key, portfolio_data, ttl=300)  # 5 minutes
        
        return jsonify(portfolio_data)
        
    except Exception as e:
        logger.error(f"❌ Erro ao calcular métricas do portfólio: {e}")
        return jsonify({
            'error': 'Erro interno do servidor',
            'message': str(e)
        }), 500

@app.route('/api/ai/query', methods=['POST'])
def ai_query():
    """Process AI queries"""
    try:
        data = request.json
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'error': 'Query é obrigatória'}), 400
        
        if len(query) > 1000:
            return jsonify({'error': 'Query muito longa (máximo 1000 caracteres)'}), 400
        
        # Get context for AI
        context = {
            'portfolio': get_portfolio_context(),
            'economic_data': get_economic_context(),
            'risk_metrics': get_risk_context(),
            'timestamp': datetime.now().isoformat()
        }
        
        # Process with Gemini AI
        if gemini_service and gemini_service.is_available():
            response = gemini_service.get_analysis(query, context)
        else:
            response = get_fallback_ai_response(query)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat(),
            'model': 'gemini-2.5-pro' if gemini_service else 'fallback'
        })
        
    except Exception as e:
        logger.error(f"❌ Erro na consulta AI: {e}")
        return jsonify({
            'error': 'Erro ao processar consulta',
            'message': str(e)
        }), 500

@app.route('/api/market/data', methods=['GET'])
def get_market_data():
    """Get real-time market data"""
    try:
        if market_service:
            market_data = market_service.get_real_time_data()
        else:
            market_data = get_fallback_market_data()
        
        return jsonify(market_data)
        
    except Exception as e:
        logger.error(f"❌ Erro ao obter dados de mercado: {e}")
        return jsonify({
            'error': 'Erro ao obter dados de mercado',
            'message': str(e)
        }), 500

@app.route('/api/economic/indicators', methods=['GET'])
def get_economic_indicators():
    """Get economic indicators"""
    try:
        if economic_manager:
            indicators = economic_manager.get_indicators()
        else:
            indicators = get_fallback_economic_data()
        
        return jsonify(indicators)
        
    except Exception as e:
        logger.error(f"❌ Erro ao obter indicadores econômicos: {e}")
        return jsonify({
            'error': 'Erro ao obter indicadores',
            'message': str(e)
        }), 500

@app.route('/api/portfolio/optimize', methods=['POST'])
def optimize_portfolio():
    """Optimize portfolio allocation"""
    try:
        data = request.json
        risk_tolerance = data.get('risk_tolerance', 5)
        investment_horizon = data.get('investment_horizon', 'medium')
        optimization_goal = data.get('optimization_goal', 'sharpe')
        
        if portfolio_analyzer:
            optimization_result = portfolio_analyzer.optimize(
                risk_tolerance=risk_tolerance,
                horizon=investment_horizon,
                goal=optimization_goal
            )
        else:
            optimization_result = get_fallback_optimization()
        
        return jsonify(optimization_result)
        
    except Exception as e:
        logger.error(f"❌ Erro na otimização do portfólio: {e}")
        return jsonify({
            'error': 'Erro na otimização',
            'message': str(e)
        }), 500

# WebSocket Events
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info(f"🔌 Cliente conectado: {request.sid}")
    emit('connected', {
        'status': 'Conectado ao AI Economic Advisor v2.0',
        'timestamp': datetime.now().isoformat(),
        'session_id': request.sid
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info(f"🔌 Cliente desconectado: {request.sid}")

@socketio.on('request_real_time_data')
def handle_real_time_request():
    """Start real-time data stream"""
    logger.info(f"📡 Iniciando stream de dados para: {request.sid}")
    
    def send_updates():
        """Send periodic updates to the client. This will run until the client disconnects."""
        while True:
            try:
                # Get updated market data
                if market_service:
                    market_data = market_service.get_real_time_data() # type: ignore
                else:
                    market_data = get_fallback_market_data()
                
                # Emit to specific client
                socketio.emit('market_update', market_data, room=request.sid)
                
                socketio.sleep(5)  # Use socketio.sleep for cooperative yielding with eventlet
                
            except Exception as e:
                logger.error(f"❌ Erro no stream de dados: {e}")
                break
    
    # Use socketio's background task manager which is compatible with eventlet/gevent
    socketio.start_background_task(target=send_updates)

@socketio.on('ai_query_stream')
def handle_ai_query_stream(data):
    """Handle streaming AI queries"""
    try:
        query = data.get('query', '').strip()
        if not query:
            emit('ai_error', {'error': 'Query vazia'})
            return
        
        # Get context
        context = {
            'portfolio': get_portfolio_context(),
            'economic_data': get_economic_context(),
            'timestamp': datetime.now().isoformat()
        }
        
        # Process with streaming if available
        if gemini_service and gemini_service.is_available():
            # Use the streaming interface from the Gemini service
            # This assumes gemini_service.get_analysis can accept a `stream=True` flag
            # and return a generator.
            try:
                response_stream = gemini_service.get_analysis(query, context, stream=True)
                for chunk in response_stream:
                    emit('ai_response_chunk', {'chunk': chunk, 'is_final': False})
                    socketio.sleep(0.01) # Small sleep to prevent blocking, allows other clients to be served
                
                # Signal the end of the stream
                emit('ai_response_chunk', {
                    'chunk': '',
                    'is_final': True
                })
            except Exception as stream_error:
                logger.error(f"❌ Erro durante o stream da AI: {stream_error}")
                emit('ai_error', {'error': 'Falha ao gerar resposta em tempo real.'})
        else:
            emit('ai_response_chunk', {
                'chunk': get_fallback_ai_response(query),
                'is_final': True
            })
            
    except Exception as e:
        logger.error(f"❌ Erro no stream AI: {e}")
        emit('ai_error', {'error': str(e)})

# Helper functions
def get_portfolio_context() -> Dict[str, Any]:
    """Get portfolio context for AI"""
    return {
        'total_value': 300910.6,
        'total_return': 18.87,
        'top_holdings': ['ITUB3', 'PETR4', 'KNRI11'],
        'risk_level': 'Moderado',
        'diversification_score': 0.75,
        'sectors': ['Financial', 'Energy', 'Real Estate', 'Cash']
    }

def get_economic_context() -> Dict[str, Any]:
    """Get economic context for AI"""
    return {
        'brazil_selic': 11.75,
        'brazil_inflation': 4.2,
        'usa_fed_rate': 5.25,
        'global_growth': 3.0,
        'market_sentiment': 'Cautious'
    }

def get_risk_context() -> Dict[str, Any]:
    """Get risk context for AI"""
    return {
        'var_95': -2.3,
        'beta': 1.15,
        'volatility': 18.5,
        'sharpe_ratio': 0.87
    }

def get_fallback_ai_response(query: str) -> str:
    """Fallback AI response when Gemini is unavailable"""
    return f"""
    **Análise Financeira - Modo Offline**
    
    Sua consulta: "{query[:100]}..."
    
    **Status do Sistema:**
    • Gemini AI temporariamente indisponível
    • Usando análise baseada em regras
    • Dados de portfólio atualizados
    
    **Recomendação Geral:**
    Com base no seu portfólio atual (R$ 300.910,60, +18,87% retorno), 
    mantenha a diversificação entre setores e monitore a concentração 
    em ativos financeiros (ITUB3: 29,2%).
    
    **Próximos Passos:**
    1. Aguarde reconexão com Gemini AI para análise completa
    2. Monitore indicadores econômicos
    3. Considere rebalanceamento trimestral
    
    *Sistema será restaurado automaticamente quando Gemini estiver disponível.*
    """

def get_fallback_market_data() -> Dict[str, Any]:
    """Fallback market data"""
    return {
        'timestamp': datetime.now().isoformat(),
        'status': 'fallback',
        'indices': {
            'IBOV': 118000,
            'SP500': 4500,
            'NASDAQ': 14000
        },
        'currencies': {
            'USDBRL': 5.20,
            'EURBRL': 5.65
        },
        'message': 'Dados simulados - serviço de mercado indisponível'
    }

def get_fallback_economic_data() -> Dict[str, Any]:
    """Fallback economic data"""
    return {
        'brazil': {
            'selic_rate': 11.75,
            'ipca_12m': 4.2,
            'gdp_growth': 2.8
        },
        'usa': {
            'fed_rate': 5.25,
            'cpi_12m': 3.1,
            'gdp_growth': 2.1
        },
        'global': {
            'world_gdp_growth': 3.0,
            'global_inflation': 2.9
        },
        'status': 'fallback'
    }

def get_fallback_optimization() -> Dict[str, Any]:
    """Fallback portfolio optimization"""
    return {
        'recommended_allocation': {
            'PETR4': 0.20,
            'ITUB3': 0.25,
            'BIDI4': 0.15,
            'KNRI11': 0.15,
            'CASH': 0.25
        },
        'expected_return': 0.12,
        'expected_risk': 0.16,
        'sharpe_ratio': 0.75,
        'status': 'fallback',
        'message': 'Otimização básica - serviço completo indisponível'
    }

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"❌ Erro interno: {error}")
    return jsonify({'error': 'Erro interno do servidor'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"❌ Exceção não tratada: {e}")
    return jsonify({'error': 'Erro inesperado'}), 500

# Application startup
def create_app():
    """Application factory"""
    return app

if __name__ == "__main__":
    port = int(os.getenv('PORT', 5000))
    debug = app.config['DEBUG']
    
    logger.info(f"🚀 Iniciando servidor em http://0.0.0.0:{port}")
    
    # Use socketio.run to start the webserver with WebSocket support
    socketio.run(app, host='0.0.0.0', port=port, debug=debug)
