from django_plotly_dash import DjangoDash
from dash import html, dcc
import plotly.express as px
import pandas as pd

app = DjangoDash('SalesDashboard')

df = pd.DataFrame({
    "المنتج": ["A", "B", "C"],
    "الكمية": [10, 20, 15]
})

fig = px.bar(df, x="المنتج", y="الكمية", title="مبيعات حسب المنتج")

app.layout = html.Div([
    html.H2("تحليل المبيعات"),
    dcc.Graph(figure=fig)
])