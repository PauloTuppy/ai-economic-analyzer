import pandas as pd
import requests

# Download S&P 500 price data
url = "https://perplexity.ai/rest/finance/history/SPY/csv?start_date=2024-09-15&end_date=2025-09-15"
spy_data = pd.read_csv(url)

print("S&P 500 ETF (SPY) Price Data - Last 12 Months")
print("=" * 50)
print(f"Data Shape: {spy_data.shape}")
print(f"Date Range: {spy_data['date'].min()} to {spy_data['date'].max()}")
print(f"Current Price: ${spy_data['close'].iloc[-1]:.2f}")
print(f"12-Month Return: {((spy_data['close'].iloc[-1] / spy_data['close'].iloc[0]) - 1) * 100:.2f}%")
print("\nRecent Data:")
print(spy_data.tail())

# Calculate some key metrics
spy_data['daily_return'] = spy_data['close'].pct_change()
volatility = spy_data['daily_return'].std() * (252**0.5) * 100  # Annualized volatility

print(f"\nKey Metrics:")
print(f"Annualized Volatility: {volatility:.2f}%")
print(f"Max Price (12M): ${spy_data['high'].max():.2f}")
print(f"Min Price (12M): ${spy_data['low'].min():.2f}")