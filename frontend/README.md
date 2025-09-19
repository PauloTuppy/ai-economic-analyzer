# AI Economic Advisor - Frontend

Uma plataforma profissional de análise econômica e gestão de portfólio com IA.

## 🚀 Como Executar

### Opção 1: Node.js (Recomendado)
```bash
cd frontend
npm start
```

### Opção 2: Servidor HTTP Simples
```bash
cd frontend
node server.js
```

### Opção 3: Python (alternativo)
```bash
cd frontend
python -m http.server 3000
```

## 📊 Funcionalidades

- **Dashboard Interativo**: Visão geral do portfólio com métricas em tempo real
- **Gestão de Portfólio**: Análise detalhada de holdings e alocação de ativos
- **Análise Econômica**: Indicadores econômicos e tendências globais
- **Avaliação de Risco**: Métricas de risco avançadas (VaR, Sharpe, Beta)
- **Chat com IA**: Assistente inteligente para recomendações de investimento
- **Configurações**: Personalização de tolerância ao risco e notificações

## 🎨 Design System

- **Tema Claro/Escuro**: Alternância automática baseada na preferência do sistema
- **Responsivo**: Otimizado para desktop, tablet e mobile
- **Acessibilidade**: Suporte completo a leitores de tela e navegação por teclado
- **Performance**: Carregamento otimizado e animações suaves

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Design system com variáveis CSS e gradientes
- **JavaScript ES6+**: Funcionalidade interativa e gestão de estado
- **Chart.js**: Visualizações de dados profissionais
- **Node.js**: Servidor HTTP otimizado

## 📱 Páginas Disponíveis

1. **Dashboard** (`/` ou `#dashboard`)
   - Resumo do portfólio
   - Indicadores econômicos
   - Insights da IA
   - Dados de mercado em tempo real

2. **Portfolio** (`#portfolio`)
   - Holdings detalhados
   - Gráfico de alocação
   - Controles de otimização

3. **Economic Analysis** (`#economic`)
   - Tendências econômicas globais
   - Calendário econômico
   - Análise de indicadores

4. **Risk Assessment** (`#risk`)
   - Métricas de risco
   - Matriz de correlação
   - Análise de drawdown

5. **AI Chat** (`#chat`)
   - Assistente de IA
   - Perguntas rápidas
   - Recomendações personalizadas

6. **Settings** (`#settings`)
   - Configuração de risco
   - Preferências de notificação
   - Personalização da interface

## 🔧 Configuração

### Variáveis de Ambiente
```bash
PORT=3000  # Porta do servidor (padrão: 3000)
```

### Personalização de Cores
Edite as variáveis CSS em `style.css`:
```css
:root {
  --color-primary: #1FB8CD;
  --color-background: #FCFCF9;
  /* ... outras variáveis */
}
```

## 📈 Dados de Exemplo

O frontend inclui dados simulados para demonstração:
- Portfólio com ações brasileiras (PETR4, ITUB3, etc.)
- Indicadores econômicos do Brasil
- Métricas de risco calculadas
- Dados de mercado em tempo real simulados

## 🌐 Navegadores Suportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto, abra uma issue no repositório.