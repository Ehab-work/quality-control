from django.urls import path 
from . import views
from .views import analyze_uploaded_image
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView
from .views import add_client
from .views import CustomTokenObtainPairView


urlpatterns = [
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('employees/', views.list_employees, name='list_employees'),
    #################################################
    #purchasing
    path('add-supplier/', views.add_supplier, name='add_supplier'),
    path('suppliers/', views.list_suppliers, name='list_suppliers'),
    path('suppliers/<int:supplier_id>/update/', views.update_supplier),
    path('suppliers/<int:supplier_id>/delete/', views.delete_supplier),
    path('add-raw-material/', views.add_raw_material, name='add_raw_material'),
    path('raw-materials/', views.list_raw_materials, name='list_raw_materials'),
    path('raw-materials/<int:material_id>/update/', views.update_raw_material),
    path('raw-materials/<int:material_id>/delete/', views.delete_raw_material),
    path('add-purchase-order/', views.create_purchase_order, name='create_purchase_order'),
    path('list_purchase_orders/', views.list_purchase_orders, name='list_purchase_orders'),
    path('purchase-orders/<int:order_id>/update/', views.update_purchase_order),
    path('purchase-orders/<int:order_id>/delete/', views.delete_purchase_order),
    ##################################################################################
    #production
    path('analyze-image/', analyze_uploaded_image, name='analyze_uploaded_image'),
    path('add-product/', views.add_product, name='add_product'),
    path('products/', views.list_products, name='list_products'),
    path('products/<int:product_id>/update/', views.update_product),
    path('products/<int:product_id>/delete/', views.delete_product),

    path('add-ratio/', views.add_ratio, name='add_ratio'),
    path('product-ratios/', views.list_ratios, name='list_ratios'),
    path('ratios/<int:ratio_id>/update/', views.update_ratio, name='update_ratio'),
    path('ratios/<int:ratio_id>/delete/', views.delete_ratio, name='delete_ratio'),

    path('create-production-order/', views.create_production_order, name='create_production_order'),
    path('production-orders/', views.list_production_orders, name='list_production_orders'),
    path('production-orders/incomplete/', views.list_incomplete_production_orders),
    path('production-orders/<int:order_id>/update-status/', views.update_production_order_status,name='update_production_order_status'),
    path('production-orders/details/<int:detail_id>/update-status/', views.update_order_detail_status,name='update_order_detail_status'),



##########################################################################################################
#salse
    path('add-client/', views.add_client, name='add_client'),
    path('clients/', views.list_clients, name='list_clients'),
    path('clients/<int:client_id>/update/', views.update_client),
    path('clients/<int:client_id>/delete/', views.delete_client),

    path('sales-orders/create/', views.create_sales_order),
    path('sales-orders/', views.list_sales_orders),
    path('sales-orders/confirmed-incomplete/', views.list_confirmed_sales_orders_with_pending_production, name='confirmed_incomplete_sales_orders'),
    path('sales-orders/unconfirmed/', views.list_unconfirmed_sales_orders, name='unconfirmed_sales_orders'),
    path('sales-orders/confirmed-incomplete/', views.list_confirmed_sales_orders_with_pending_production, name='confirmed_incomplete_sales_orders'),
    path('sales-orders/<int:order_id>/update/', views.update_sales_order),
    path('sales-orders/<int:order_id>/delete/', views.delete_sales_order),
    path('sales-orders/ready-to-archive/', views.list_sales_orders_ready_to_archive),  
    path('sales-orders/<int:order_id>/mark-delivered/', views.mark_sales_order_as_delivered, name='mark_sales_order_as_delivered'),
    path('sales-orders/<int:order_id>/details/add/', views.add_invoice_detail),
    path('sales-orders/<int:order_id>/update-all/', views.update_sales_order_with_details),
    path('sales-orders/details/<int:detail_id>/delete/', views.delete_invoice_detail),
    path('sales-orders/details/<int:detail_id>/update/', views.update_invoice_detail),
    path('sales-orders/<int:order_id>/client-confirm/', views.update_client_status),
    path('sales-orders/<int:order_id>/', views.get_sales_order_by_id, name='get_sales_order_by_id'),
    path('sales-orders/confirmed/', views.list_confirmed_sales_orders, name='list_confirmed_sales_orders'),
    path('sales-orders/by-client/<int:client_id>/', views.sales_orders_by_client),
    path('sales-orders/by-date/', views.sales_orders_by_date, name='sales_orders_by_date'),
    path('sales-summary-by-date/', views.sales_summary_by_date, name='sales_summary_by_date'),

###########################################################################################################
    #analsis
################################################################################################################
    path('analytics/client-sales-share/', views.client_sales_share, name='client_sales_share'),

    
################################################################################################3
    path('analytics/production/incomplete/', views.list_incomplete_production_orders),
    path('analytics/raw-material-usage/', views.raw_material_usage_by_product),
    path('analytics/client-products/<int:client_id>/', views.product_summary_by_client, name='product_summary_by_client'),
    path('clients/<int:client_id>/top-products/', views.top_products_by_client),
    
    path('analytics/client/<int:client_id>/average-order/', views.average_order_price_for_client),
    path('analytics/client-order-distribution/', views.client_order_distribution_by_quarter),
    path('analytics/client-order-summary/', views.client_order_summary, name='client_order_summary'),
    path('analytics/production-total-per-product/', views.total_production_by_product),
    path('analytics/raw-material-costs/', views.raw_material_costs),
    path('analytics/raw-material-stock-pie/', views.raw_material_stock_pie),
    path('analytics/raw-material-cost-pie/', views.raw_material_cost_pie),
    path('analytics/top-selling-products/', views.top_selling_products),
    path('analytics/product-profit-analysis/', views.product_profit_analysis, name='product_profit_analysis'),
    path('sales-summary/', views.sales_summary, name='sales_summary'),
    
]

    



