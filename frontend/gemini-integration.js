// Gemini AI Integration for Economic Advisor
class GeminiAIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.marketData = null;
        this.portfolioData = null;
    }

    async generateContent(prompt, context = {}) {
        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: this.buildPrompt(prompt, context)
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini AI Error:', error);
            return this.getFallbackResponse(prompt);
        }
    }

    buildPrompt(userPrompt, context) {
        const systemContext = `
Você é um consultor econômico especializado em mercado brasileiro e internacional.
Contexto do portfólio atual:
- Valor total: R$ ${context.portfolioValue || '300.910,60'}
- Retorno: ${context.portfolioReturn || '+18.87%'}
- Holdings principais: PETR4, ITUB3, BIDI4, KNRI11, HGLG11
- Métricas de risco: Sharpe 0.87, Beta 1.15, VaR 2.3%

Indicadores econômicos atuais:
- Inflação Brasil: 4.2%
- Taxa Selic: 11.75%
- USD/BRL: 5.12
- Preço do petróleo: $82.50

Responda de forma profissional, concisa e em português brasileiro.
`;

        return `${systemContext}\n\nPergunta do usuário: ${userPrompt}`;
    }

    getFallbackResponse(prompt) {
        const fallbacks = {
            'brasil': 'O mercado brasileiro apresenta oportunidades interessantes com a taxa Selic em 11.75%. Recomendo manter exposição em bancos e energia, mas considere diversificação internacional.',
            'inflação': 'Com inflação em 4.2%, ativos reais como PETR4 e REITs oferecem proteção. Considere também títulos indexados ao IPCA.',
            'risco': 'Seu portfólio tem VaR de 2.3% e Sharpe de 0.87, indicadores sólidos. Considere reduzir concentração em ações brasileiras.',
            'otimizar': 'Recomendo: 1) Reduzir ITUB3 para 20%, 2) Adicionar exposição internacional, 3) Aumentar posição em cash para oportunidades.'
        };

        const lowerPrompt = prompt.toLowerCase();
        for (const [key, response] of Object.entries(fallbacks)) {
            if (lowerPrompt.includes(key)) {
                return response;
            }
        }

        return 'Baseado na análise do seu portfólio, recomendo manter a diversificação atual e considerar oportunidades de rebalanceamento. Posso ajudar com análises mais específicas se desejar.';
    }

    async analyzePortfolio(portfolioData) {
        const prompt = `
Analise este portfólio e forneça insights sobre:
1. Diversificação
2. Exposição a riscos
3. Recomendações de otimização

Dados: ${JSON.stringify(portfolioData, null, 2)}
`;

        return await this.generateContent(prompt, { portfolioData });
    }

    async getMarketInsights() {
        const prompt = `
Forneça 3 insights atuais sobre o mercado brasileiro considerando:
- Taxa Selic em 11.75%
- Inflação em 4.2%
- Cenário político e econômico atual
- Oportunidades de investimento

Formato: Lista com ícones e texto conciso.
`;

        return await this.generateContent(prompt);
    }

    async generateInvestmentStrategy(riskProfile, timeHorizon, amount) {
        const prompt = `
Crie uma estratégia de investimento para:
- Perfil de risco: ${riskProfile}
- Horizonte: ${timeHorizon}
- Valor: R$ ${amount}

Inclua alocação percentual e justificativas.
`;

        return await this.generateContent(prompt, { riskProfile, timeHorizon, amount });
    }
}

// Export for use in main app
window.GeminiAIService = GeminiAIService;