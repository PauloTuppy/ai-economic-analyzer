import plotly.express as px
import pandas as pd

# Create the data for portfolio allocation with clearer labels (within 15 char limit)
data = [
    {"asset": "Govt Bonds", "percentage": 25},
    {"asset": "Cash/MM", "percentage": 20},
    {"asset": "Defense Stocks", "percentage": 20},
    {"asset": "Gold/Metals", "percentage": 15},
    {"asset": "Emerging Mkts", "percentage": 10},
    {"asset": "Alternatives", "percentage": 10}
]

df = pd.DataFrame(data)

# Create pie chart with improved brand colors for better distinction
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C', '#964325']

fig = px.pie(df, 
             values='percentage', 
             names='asset',
             title='2025 Portfolio Allocation',
             color_discrete_sequence=colors)

# Update layout for pie chart specific formatting
fig.update_layout(uniformtext_minsize=16, uniformtext_mode='hide')

# Update traces with better text formatting (removed cliponaxis as it's not valid for pie charts)
fig.update_traces(
    textposition='inside', 
    textinfo='percent+label',
    textfont_size=16,
    textfont_weight='bold'
)

# Save as both PNG and SVG
fig.write_image("chart.png")
fig.write_image("chart.svg", format="svg")

fig.show()