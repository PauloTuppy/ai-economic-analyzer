# AI Economic Advisor - Professional Investment Platform

An advanced AI-powered economic analysis and portfolio management platform with real-time market predictions and intelligent investment recommendations.

## 🚀 Quick Start

### Option 1: Node.js Server (Recommended)
```bash
cd frontend
npm start
```

### Option 2: Simple HTTP Server
```bash
cd frontend
node server.js
```

### Option 3: Python Alternative
```bash
cd frontend
python -m http.server 3002
```

## 📊 Features

### 🎯 Core Functionality
- **Interactive Dashboard**: Real-time portfolio overview with live metrics
- **Portfolio Management**: Detailed holdings analysis and asset allocation
- **Economic Analysis**: Global economic indicators and market trends
- **Risk Assessment**: Advanced risk metrics (VaR, Sharpe, Beta, Sortino)
- **AI Chat Assistant**: Intelligent investment recommendations and market insights
- **Market Predictions**: Advanced ML-based market forecasting
- **Real-time Data**: Live market data with automatic updates

### 🤖 AI-Powered Features
- **Gemini AI Integration**: Real AI responses for investment advice
- **Hull Tactical Strategy**: Advanced market prediction algorithms
- **Portfolio Optimization**: AI-driven portfolio rebalancing
- **Risk Analysis**: Intelligent risk assessment and recommendations
- **Market Sentiment**: Real-time sentiment analysis integration

### 🌐 Multi-language Support
- **English**: Full English interface (`index-en.html`)
- **Portuguese**: Complete Portuguese version (`index.html`)
- **Currency Support**: USD and BRL display options
- **Localization**: Date, number, and currency formatting

## 🎨 Design System

### Theme Support
- **Light/Dark Mode**: Automatic theme switching based on system preference
- **Manual Toggle**: User-controlled theme switching
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessibility**: Full screen reader and keyboard navigation support

### Visual Features
- **Modern UI**: Clean, professional interface design
- **Interactive Charts**: Real-time Chart.js visualizations
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Glass Morphism**: Modern backdrop blur effects
- **Gradient Accents**: Beautiful color gradients throughout

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic modern structure
- **CSS3**: Advanced design system with CSS variables
- **JavaScript ES6+**: Modern interactive functionality
- **Chart.js**: Professional data visualizations
- **Internationalization**: Multi-language support system

### Backend Integration
- **Node.js**: Optimized HTTP server
- **Gemini AI**: Real AI-powered responses
- **Market APIs**: Real-time financial data integration
- **WebSocket**: Live data streaming capabilities

## 📱 Available Pages

### 1. Dashboard (`/` or `#dashboard`)
- Portfolio summary with real-time values
- Key economic indicators
- AI market insights
- Live market data charts

### 2. Portfolio (`#portfolio`)
- Detailed holdings breakdown
- Asset allocation visualization
- AI optimization tools
- Performance analytics

### 3. Economic Analysis (`#economic`)
- Global economic trends
- Economic calendar events
- Market correlation analysis
- Sector performance metrics

### 4. Risk Assessment (`#risk`)
- Advanced risk metrics
- Correlation matrix visualization
- Drawdown analysis
- Risk-adjusted returns

### 5. AI Chat (`#chat`)
- Intelligent AI assistant
- Quick question templates
- Personalized recommendations
- Market analysis requests

### 6. Settings (`#settings`)
- Risk tolerance configuration
- Notification preferences
- Language and currency settings
- Theme customization

## 🔧 Configuration

### Environment Variables
```bash
PORT=3002                    # Server port (default: 3002)
GEMINI_API_KEY=your_key     # Gemini AI API key
LANGUAGE=en                 # Default language (en/pt)
CURRENCY=USD                # Default currency (USD/BRL)
```

### Customization Options

#### Color Themes
Edit CSS variables in `style.css`:
```css
:root {
  --color-primary: #1FB8CD;
  --color-background: #FCFCF9;
  --color-text: #134252;
  /* ... other variables */
}
```

#### Language Settings
Modify translations in `i18n.js`:
```javascript
translations: {
  en: {
    'nav.dashboard': 'Dashboard',
    // ... other translations
  }
}
```

## 📈 Sample Data

The platform includes realistic sample data for demonstration:

### Portfolio Holdings
- **PETR4**: Brazilian energy sector (Petrobras)
- **ITUB3**: Brazilian banking sector (Itaú)
- **BIDI4**: Brazilian retail sector (Banco Inter)
- **KNRI11**: Real Estate Investment Trust
- **HGLG11**: Real Estate Investment Trust
- **SNSL3**: Brazilian retail sector
- **BCFF11**: Real Estate Investment Trust

### Economic Indicators
- Brazil inflation rate: 4.2%
- Selic interest rate: 11.75%
- USD/BRL exchange rate: 5.12
- Oil price: $82.50
- Market indices: IBOVESPA, S&P 500

### Risk Metrics
- Value at Risk (95%): 2.3%
- Sharpe Ratio: 0.87
- Beta: 1.15
- Sortino Ratio: 1.23
- Maximum Drawdown: -8.9%

## 🔮 Market Predictions

### Prediction Models
1. **Technical Analysis**: RSI, MACD, Moving Averages
2. **Sentiment Analysis**: News and social media sentiment
3. **Economic Indicators**: Macro-economic factor analysis
4. **Machine Learning**: Advanced pattern recognition

### Prediction Outputs
- **Direction**: Bullish/Bearish/Neutral signals
- **Confidence**: Statistical confidence levels
- **Target Prices**: Predicted price targets
- **Risk Levels**: Associated risk assessments
- **Recommendations**: Buy/Hold/Sell suggestions

## 🌐 Browser Support

### Minimum Requirements
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Recommended
- **Chrome**: Latest version
- **Hardware Acceleration**: Enabled for smooth animations
- **JavaScript**: Enabled (required for functionality)

## 🔒 Security Features

### Data Protection
- **Client-side Processing**: No sensitive data sent to servers
- **API Key Management**: Secure API key handling
- **HTTPS Ready**: SSL/TLS encryption support
- **CORS Protection**: Cross-origin request security

### Privacy
- **Local Storage**: User preferences stored locally
- **No Tracking**: No user behavior tracking
- **Anonymous Usage**: No personal data collection

## 🚀 Performance Optimization

### Loading Performance
- **Lazy Loading**: Charts loaded on demand
- **Code Splitting**: Modular JavaScript architecture
- **Asset Optimization**: Compressed and optimized assets
- **Caching**: Intelligent browser caching strategies

### Runtime Performance
- **Efficient Updates**: Minimal DOM manipulation
- **Memory Management**: Proper cleanup and garbage collection
- **Smooth Animations**: Hardware-accelerated transitions
- **Responsive Charts**: Optimized chart rendering

## 📊 API Integration

### Market Data Sources
- **HG Brasil Finance API**: Brazilian market data
- **Exchange Rate API**: Currency conversion rates
- **Economic Indicators API**: Macro-economic data
- **Fallback System**: Simulated data when APIs unavailable

### AI Services
- **Gemini AI**: Natural language processing
- **Custom ML Models**: Market prediction algorithms
- **Sentiment Analysis**: News and social sentiment
- **Technical Analysis**: Automated technical indicators

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **ES6+ JavaScript**: Modern JavaScript features
- **CSS Variables**: Consistent design system
- **Semantic HTML**: Accessible markup
- **JSDoc Comments**: Documented functions

### Testing
- **Manual Testing**: Cross-browser compatibility
- **Performance Testing**: Load time optimization
- **Accessibility Testing**: Screen reader compatibility
- **Mobile Testing**: Responsive design validation

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

For technical support or questions:
- **Issues**: Open a GitHub issue
- **Documentation**: Check the README files
- **Community**: Join our discussions

## 🎯 Roadmap

### Upcoming Features
- **Real-time Notifications**: Push notifications for market events
- **Advanced Charting**: More technical indicators
- **Social Trading**: Community features
- **Mobile App**: Native mobile applications
- **API Access**: Public API for developers

### Performance Improvements
- **WebSocket Integration**: Real-time data streaming
- **Service Workers**: Offline functionality
- **Progressive Web App**: PWA capabilities
- **Advanced Caching**: Intelligent data caching

---

**Built with ❤️ for investors and traders worldwide**