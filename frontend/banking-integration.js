// Banking Integration - Bank of Anthos Style
class BankingService {
    constructor() {
        this.baseUrl = 'http://localhost';
        this.userServicePort = 5001;
        this.balanceServicePort = 5002;
        this.transactionServicePort = 5003;
        this.token = localStorage.getItem('banking_token');
        this.currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
    }

    // Authentication
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseUrl}:${this.userServicePort}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            this.token = data.token;
            this.currentUser = data.user;
            
            localStorage.setItem('banking_token', this.token);
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('banking_token');
        localStorage.removeItem('current_user');
    }

    isAuthenticated() {
        return !!this.token && !!this.currentUser;
    }

    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    // Balance Operations
    async getBalance(accountNumber = null) {
        try {
            const account = accountNumber || this.currentUser?.account_number;
            if (!account) throw new Error('No account number available');

            const response = await fetch(`${this.baseUrl}:${this.balanceServicePort}/balance/${account}`, {
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch balance');
            }

            return await response.json();
        } catch (error) {
            console.error('Balance fetch error:', error);
            throw error;
        }
    }

    async withdraw(amount, description = 'Investment withdrawal') {
        try {
            const response = await fetch(`${this.baseUrl}:${this.balanceServicePort}/withdraw`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    account_number: this.currentUser.account_number,
                    amount: amount,
                    description: description
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Withdrawal failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Withdrawal error:', error);
            throw error;
        }
    }

    // Investment Operations
    async buyAsset(symbol, quantity, price) {
        try {
            const response = await fetch(`${this.baseUrl}:${this.transactionServicePort}/buy`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    account_number: this.currentUser.account_number,
                    symbol: symbol,
                    quantity: quantity,
                    price: price
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Purchase failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Buy asset error:', error);
            throw error;
        }
    }

    async sellAsset(symbol, quantity, price) {
        try {
            const response = await fetch(`${this.baseUrl}:${this.transactionServicePort}/sell`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    account_number: this.currentUser.account_number,
                    symbol: symbol,
                    quantity: quantity,
                    price: price
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Sale failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Sell asset error:', error);
            throw error;
        }
    }

    async getPortfolio(accountNumber = null) {
        try {
            const account = accountNumber || this.currentUser?.account_number;
            if (!account) throw new Error('No account number available');

            const response = await fetch(`${this.baseUrl}:${this.transactionServicePort}/portfolio/${account}`, {
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch portfolio');
            }

            return await response.json();
        } catch (error) {
            console.error('Portfolio fetch error:', error);
            throw error;
        }
    }

    async getTransactionHistory(accountNumber = null, limit = 20) {
        try {
            const account = accountNumber || this.currentUser?.account_number;
            if (!account) throw new Error('No account number available');

            const response = await fetch(`${this.baseUrl}:${this.transactionServicePort}/orders/${account}?limit=${limit}`, {
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transaction history');
            }

            return await response.json();
        } catch (error) {
            console.error('Transaction history error:', error);
            throw error;
        }
    }

    // Utility Methods
    formatCurrency(amount, currency = 'BRL') {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('pt-BR');
    }

    // Investment Recommendations Integration
    async executeAIRecommendation(recommendation) {
        try {
            const { symbol, action, quantity, price, reasoning } = recommendation;
            
            if (action === 'buy') {
                const result = await this.buyAsset(symbol, quantity, price);
                return {
                    success: true,
                    message: `✅ Compra executada: ${quantity} ações de ${symbol} por ${this.formatCurrency(price * quantity)}`,
                    transaction: result,
                    reasoning: reasoning
                };
            } else if (action === 'sell') {
                const result = await this.sellAsset(symbol, quantity, price);
                return {
                    success: true,
                    message: `✅ Venda executada: ${quantity} ações de ${symbol} por ${this.formatCurrency(price * quantity)}`,
                    transaction: result,
                    reasoning: reasoning
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `❌ Erro na execução: ${error.message}`,
                error: error
            };
        }
    }

    // Health Check
    async checkServicesHealth() {
        const services = [
            { name: 'User Service', port: this.userServicePort },
            { name: 'Balance Service', port: this.balanceServicePort },
            { name: 'Transaction Service', port: this.transactionServicePort }
        ];

        const results = {};

        for (const service of services) {
            try {
                const response = await fetch(`${this.baseUrl}:${service.port}/health`);
                results[service.name] = {
                    status: response.ok ? 'healthy' : 'unhealthy',
                    port: service.port
                };
            } catch (error) {
                results[service.name] = {
                    status: 'offline',
                    port: service.port,
                    error: error.message
                };
            }
        }

        return results;
    }
}

// Global banking service instance
window.BankingService = BankingService;