from django.urls import path ,include
from . import views

urlpatterns = [
    path('employees/', views.list_employees, name='list_employees'),
    path('add-supplier/', views.add_supplier, name='add_supplier'),
    path('suppliers/', views.list_suppliers, name='list_suppliers'),
    path('add-raw-material/', views.add_raw_material, name='add_raw_material'),
    path('raw-materials/', views.list_raw_materials, name='list_raw_materials'),
    path('products/', views.list_products, name='list_products'),
    path('add-product/', views.add_product, name='add_product'),
    path('add-purchase-order/', views.create_purchase_order, name='create_purchase_order'),
    path('list_purchase_orders/', views.list_purchase_orders, name='list_purchase_orders'),
    path('product-ratios/', views.list_ratios, name='list_ratios'),
    path('add-ratio/', views.add_ratio, name='add_ratio'),
    path('production-orders/', views.list_production_orders, name='list_production_orders'),
    path('create-production-order/', views.create_production_order, name='create_production_order'),
    path('production-orders/', views.list_production_orders, name='list_production_orders'),
    path('create-production-order/', views.create_production_order, name='create_production_order'),
    path('production-orders/<int:order_id>/update-status/', views.update_production_order_status,name='update_production_order_status'),
    path('production-orders/details/<int:detail_id>/update-status/', views.update_order_detail_status,name='update_order_detail_status'),
    path('clients/', views.list_clients, name='list_clients'),
    path('add-client/', views.add_client, name='add_client'),
    path('sales-orders/', views.list_sales_orders, name='sales-orders' ),
    path('create-sales-order/', views.create_sales_order, name='create-sales-order' ),
    path('analysis_page/', views.analysis_page, name='analysis_page'),
    path('analysis/', views.analysis_page, name='analysis'),
    path('django_plotly_dash/', include('django_plotly_dash.urls')),

]
