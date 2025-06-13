from datetime import datetime, timedelta
from rest_framework.decorators import api_view, parser_classes
from rest_framework import status
from django.db.models import Sum
from PIL import Image
import io
from rest_framework.parsers import MultiPartParser, FormParser
import cv2
from django.utils import timezone
from rest_framework.response import Response
from django.db.models.functions import ExtractMonth
from PIL import Image
import numpy as np
from django.shortcuts import render
from django.utils.dateparse import parse_date
from .models import Supplier,SalesOrder,PurchaseInvoiceDetail,SalesInvoiceDetail,RawMaterial,Client,ProductionOrderDetail,PurchaseOrder,Product,RatioOfProduct,ProductionOrder,Employee
from .serializers import SupplierSerializer,SalesInvoiceDetailSerializer,SalesOrderSerializer,ClientSerializer, EmployeeSerializer,ProductionOrderSerializer,RatioOfProductSerializer,RawMaterialSerializer,ProductSerializer,PurchaseOrderSerializer,PurchaseOrderListSerializer
from django.db.models import F, ExpressionWrapper, DecimalField, Sum
from django.db.models import Sum, Count, Min, Max ,Avg,Count
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from .decorators import required_role
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import CustomTokenObtainPairSerializer
import logging
from .permissions import RolePermission, IsSales, IsPurchase, IsProduction, IsCEO
logger = logging.getLogger(__name__)

# core/views.py

from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from functools import partial

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        if hasattr(user, 'employee'):
            token['role'] = user.employee.role.lower()
        else:
            token['role'] = 'unknown'
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        if hasattr(self.user, 'employee'):
            data['role'] = self.user.employee.role.lower()
        else:
            data['role'] = 'unknown'
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@required_role(['ceo', 'sales'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def product_profit_analysis(request):
    profit_data = (
        SalesInvoiceDetail.objects
        .annotate(
            profit=ExpressionWrapper(
                (F('unit_price') - F('product__worst_price')) * F('quantity'),
                output_field=DecimalField()
            )
        )
        .values('product__name')
        .annotate(total_profit=Sum('profit'))
        .order_by('-total_profit')
    )

    total_profit = sum(item['total_profit'] for item in profit_data)
    for item in profit_data:
        item['profit_share'] = round((item['total_profit'] / total_profit) * 100, 2) if total_profit else 0

    return Response(profit_data)


@required_role(['ceo', 'sales'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def top_selling_products(request):
    data = (
        SalesInvoiceDetail.objects
        .values('product__name')
        .annotate(total_sold=Sum('quantity'))
        .order_by('-total_sold')[:10]
    )
    return Response(data)

@required_role(['ceo', 'purchase'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def raw_material_stock_pie(request):
    data = list(RawMaterial.objects.values('name', 'quantity'))
    return Response(data)

@required_role(['ceo', 'purchase'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def raw_material_cost_pie(request):
    data = (
        PurchaseInvoiceDetail.objects
        .values(name=F('raw_material__name'))
        .annotate(total_cost=Sum(ExpressionWrapper(F('quantity') * F('unit_price'), output_field=DecimalField())))
    )
    return Response(data)

@required_role(['ceo', 'purchase'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def raw_material_costs(request):
    total_expr = ExpressionWrapper(F('unit_price') * F('quantity'), output_field=DecimalField())
    
    data = (
        PurchaseInvoiceDetail.objects
        .values('raw_material__name')
        .annotate(total_spent=Sum(total_expr))
        .order_by('-total_spent')
    )
    return Response(data)

@required_role(['ceo', 'production'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def raw_material_usage_by_product(request):
    data = (
        RatioOfProduct.objects
        .values('raw_material__name', 'product__name')
        .annotate(total_used=Sum('ratio'))
        .order_by('raw_material__name')
    )

    formatted = {}
    for entry in data:
        product = entry['product__name']
        material = entry['raw_material__name']
        amount = entry['total_used']

        if material not in formatted:
            formatted[material] = {}
        formatted[material][product] = amount

    return Response(formatted)

@required_role(['ceo', 'production'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def total_production_by_product(request):
    data = (
        ProductionOrderDetail.objects
        .values('product__name')
        .annotate(total_produced=Sum('quantity'))
        .order_by('-total_produced')
    )
    return Response(data)

@required_role(['ceo', 'sales'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def client_order_summary(request):
    data = (
        SalesOrder.objects
        .values('client__name')
        .annotate(
            total_orders=Count('id'),
            total_revenue=Sum('total_amount')
        )
        .order_by('-total_revenue')
    )
    return Response(data)

# دالة لتحويل الشهر إلى ربع سنة
def get_quarter(month):
    if 1 <= month <= 3:
        return 'Q1'
    elif 4 <= month <= 6:
        return 'Q2'
    elif 7 <= month <= 9:
        return 'Q3'
    elif 10 <= month <= 12:
        return 'Q4'

@required_role(['ceo', 'sales'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def client_order_distribution_by_quarter(request):
    orders = SalesOrder.objects.annotate(
        month=ExtractMonth('sale_date')
    ).values(
        'client__name',
        'month'
    ).annotate(
        total_orders=Count('id')
    )

    heatmap_data = {}
    for entry in orders:
        client = entry['client__name']
        quarter = get_quarter(entry['month'])

        if client not in heatmap_data:
            heatmap_data[client] = {'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0}

        heatmap_data[client][quarter] += entry['total_orders']

    result = []
    for client, quarters in heatmap_data.items():
        result.append({
            'client': client,
            'Q1': quarters['Q1'],
            'Q2': quarters['Q2'],
            'Q3': quarters['Q3'],
            'Q4': quarters['Q4'],
        })

    return Response(result)

@required_role(['ceo', 'sales'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def average_order_price_for_client(request, client_id):
    orders = SalesOrder.objects.filter(client_id=client_id)
    if not orders.exists():
        return Response({'message': 'لا توجد فواتير لهذا العميل', 'average': 0})
    
    total = orders.aggregate(avg_total=Avg('total_amount'))['avg_total']
    return Response({'client_id': client_id, 'average_order_total': total})

@required_role(['ceo', 'sales'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def client_sales_share(request):
    sales_data = (
        SalesInvoiceDetail.objects
        .values('sale__client__name')
        .annotate(total_sales=Sum('total_price'))
        .order_by('-total_sales')
    )
    return Response(sales_data)

@required_role(['ceo', 'sales'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def product_summary_by_client(request, client_id):
    details = (
        SalesInvoiceDetail.objects
        .filter(sale__client_id=client_id)
        .values('product__name')
        .annotate(total_quantity=Sum('quantity'))
        .order_by('-total_quantity')
    )
    return Response(details)

@required_role(['ceo', 'sales'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def top_products_by_client(request, client_id):
    get_object_or_404(Client, pk=client_id)

    data = (
        SalesInvoiceDetail.objects
        .filter(sale__client_id=client_id)
        .values('product__name')
        .annotate(total=Sum('quantity'))
        .order_by('-total')[:5]
    )
    return Response(data)


@required_role(['sales', 'production','purchase', 'ceo'])  # ← تحديد الأدوار المطلوبة
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_employees(request):
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)
#############################################################################################################################
#purchasing

@required_role(['purchase', 'ceo'])  
@api_view(['POST'])
@permission_classes([IsAuthenticated, RolePermission])
def add_supplier(request):
    serializer = SupplierSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#

@required_role(['purchase', 'ceo'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_suppliers(request):
    suppliers = Supplier.objects.all()
    serializer = SupplierSerializer(suppliers, many=True)
    return Response(serializer.data)

#

@required_role(['purchase', 'ceo'])  # ← الصلاحيات المطلوبة
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_supplier(request, supplier_id):
    try:
        supplier = Supplier.objects.get(id=supplier_id)
    except Supplier.DoesNotExist:
        return Response({'error': 'Supplier not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SupplierSerializer(supplier, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@required_role(['purchase', 'ceo'])
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, RolePermission])
def delete_supplier(request, supplier_id):
    try:
        supplier = Supplier.objects.get(id=supplier_id)
        supplier.delete()
        return Response({'message': 'Supplier deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Supplier.DoesNotExist:
        return Response({'error': 'Supplier not found'}, status=status.HTTP_404_NOT_FOUND)



@required_role(['purchase', 'ceo', 'production'])
@api_view(['POST'])
@permission_classes([IsAuthenticated, RolePermission])
def add_raw_material(request):
    serializer = RawMaterialSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#

@required_role(['purchase', 'ceo', 'production'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_raw_materials(request):
    materials = RawMaterial.objects.all()
    serializer = RawMaterialSerializer(materials, many=True)
    return Response(serializer.data)
#

@required_role(['purchase', 'ceo'])
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_raw_material(request, material_id):
    try:
        material = RawMaterial.objects.get(id=material_id)
    except RawMaterial.DoesNotExist:
        return Response({'error': 'Raw material not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RawMaterialSerializer(material, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@required_role(['purchase', 'ceo'])
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, RolePermission])
def delete_raw_material(request, material_id):
    try:
        material = RawMaterial.objects.get(id=material_id)
        material.delete()
        return Response({'message': 'Raw material deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except RawMaterial.DoesNotExist:
        return Response({'error': 'Raw material not found'}, status=status.HTTP_404_NOT_FOUND)


@required_role(['purchase', 'ceo'])
@api_view(['POST'])
@permission_classes([IsAuthenticated, RolePermission])
def create_purchase_order(request):
    serializer = PurchaseOrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@required_role(['purchase', 'ceo'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_purchase_orders(request):
    orders = PurchaseOrder.objects.all().order_by('-id')
    serializer = PurchaseOrderListSerializer(orders, many=True)
    return Response(serializer.data)


@required_role(['purchase', 'ceo'])
@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated, RolePermission])
def update_purchase_order(request, order_id):
    try:
        order = PurchaseOrder.objects.get(id=order_id)
    except PurchaseOrder.DoesNotExist:
        return Response({'error': 'Purchase order not found'}, status=status.HTTP_404_NOT_FOUND)

    details_data = request.data.pop('details', None)

    serializer = PurchaseOrderSerializer(order, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()

        if details_data is not None:
            order.details.all().delete()
            total = 0
            for item in details_data:
                # تحويل raw_material ID إلى instance
                raw_material_id = item.pop('raw_material')
                item['raw_material'] = RawMaterial.objects.get(id=raw_material_id)

                sub_total = float(item['quantity']) * float(item['unit_price'])
                total += sub_total

                item['order'] = order
                PurchaseInvoiceDetail.objects.create(**item)

            order.total_amount = total
            order.save()

        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@required_role(['purchase', 'ceo'])
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, RolePermission])
def delete_purchase_order(request, order_id):
    try:
        order = PurchaseOrder.objects.get(id=order_id)
        order.delete()
        return Response({'message': 'Purchase order deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except PurchaseOrder.DoesNotExist:
        return Response({'error': 'Purchase order not found'}, status=status.HTTP_404_NOT_FOUND)
################################################################################################################################################


# production

@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['POST'])
@permission_classes([IsAuthenticated, RolePermission])
def analyze_uploaded_image(request):
    image_file = request.FILES.get('image')
    if not image_file:
        return Response({'error': 'No image uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        image_bytes = image_file.read()
        image_np = np.array(Image.open(io.BytesIO(image_bytes)))
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        black_ratio = np.sum(gray < 120) / gray.size

        return Response({'black_ratio': round(black_ratio, 4)}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f'Failed to analyze image: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['POST'])
@permission_classes([IsAuthenticated, RolePermission])
def add_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#

@required_role(['production', 'sales', 'ceo']) 
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_products(request):
    products = Product.objects.all().order_by('-id')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@required_role(['production', 'ceo'])  
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, RolePermission])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response({'message': 'product deleted done '}, status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({'error': 'An error no product'}, status=status.HTTP_404_NOT_FOUND)

@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['POST'])
@permission_classes([IsAuthenticated, RolePermission])
def add_ratio(request):
    serializer = RatioOfProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_ratios(request):
    ratios = RatioOfProduct.objects.all()
    serializer = RatioOfProductSerializer(ratios, many=True)
    return Response(serializer.data)

@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_ratio(request, ratio_id):
    try:
        ratio = RatioOfProduct.objects.get(pk=ratio_id)
    except RatioOfProduct.DoesNotExist:
        return Response({'error': 'Ratio not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RatioOfProductSerializer(ratio, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, RolePermission])
def delete_ratio(request, ratio_id):
    try:
        ratio = RatioOfProduct.objects.get(pk=ratio_id)
    except RatioOfProduct.DoesNotExist:
        return Response({'error': 'Ratio not found'}, status=status.HTTP_404_NOT_FOUND)

    ratio.delete()
    return Response({'message': 'Ratio deleted'}, status=status.HTTP_204_NO_CONTENT)

@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['POST'])    
@permission_classes([IsAuthenticated, RolePermission])    
def create_production_order(request):    
    serializer = ProductionOrderSerializer(data=request.data)    
    if serializer.is_valid():    
        serializer.save()    
        return Response(serializer.data, status=status.HTTP_201_CREATED)    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_production_orders(request):
    orders = ProductionOrder.objects.prefetch_related('details').all()
    serializer = ProductionOrderSerializer(orders, many=True)
    return Response(serializer.data)


@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_incomplete_production_orders(request):
    orders = ProductionOrder.objects.exclude(status='completed').prefetch_related('details')
    serializer = ProductionOrderSerializer(orders, many=True)
    return Response(serializer.data)

@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_production_order_status(request, order_id):
    try:
        order = ProductionOrder.objects.select_related('sales_order').prefetch_related('details__product').get(pk=order_id)
    except ProductionOrder.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    valid_statuses = ['pending', 'in_progress', 'completed']

    if new_status not in valid_statuses:
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    if new_status == 'completed' and order.status != 'completed':
        if order.sales_order_id:
            sales_order = order.sales_order
            sales_order.status = 'completed'
            sales_order.save()
        else:
            for detail in order.details.all():
                product = detail.product
                product.stock_quantity += detail.quantity
                product.save()

        order.actual_end_date = datetime.now().date()

    order.status = new_status
    order.save()

    return Response({'message': 'Production order and related sales order updated successfully.'})


@required_role(['production', 'ceo'])  # ← تحديد الدور
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_order_detail_status(request, detail_id):
    try:
        detail = ProductionOrderDetail.objects.get(pk=detail_id)
    except ProductionOrderDetail.DoesNotExist:
        return Response({'error': 'Detail not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    valid_statuses = ['planned', 'in_progress', 'completed']
    if new_status not in valid_statuses:
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    detail.status = new_status
    detail.save()
    return Response({'message': 'Product status updated'})








###################################################################################################################3
#salse


@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['POST'])
@permission_classes([IsAuthenticated, RolePermission])
def add_client(request):
    serializer = ClientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_clients(request):
    clients = Client.objects.all()
    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data)



@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_client(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
    except Client.DoesNotExist:
        return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ClientSerializer(client, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, RolePermission])
def delete_client(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
        client.delete()
        return Response({'message': 'Client deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Client.DoesNotExist:
        return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
    

@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['POST'])
@permission_classes([IsAuthenticated, RolePermission])
def create_sales_order(request):
    serializer = SalesOrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_sales_orders(request):
    queryset = SalesOrder.objects.all()
    serializer = SalesOrderSerializer(queryset, many=True)
    return Response(serializer.data)

@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_unconfirmed_sales_orders(request):
    orders = SalesOrder.objects.exclude(client_status='confirmed').prefetch_related('details')
    serializer = SalesOrderSerializer(orders, many=True)
    return Response(serializer.data)


@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_confirmed_sales_orders_with_pending_production(request):
    orders = SalesOrder.objects.filter(
        client_status='confirmed',
        status__in=['pending', 'in_progress']
    ).prefetch_related('details')
    
    serializer = SalesOrderSerializer(orders, many=True)
    return Response(serializer.data)

@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_sales_order(request, order_id):
    try:
        order = SalesOrder.objects.get(pk=order_id)
    except SalesOrder.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data

    # تحديث الحقول المسموح بها فقط
    for field in ['status', 'client_status', 'delivery_deadline', 'notes']:
        if field in data:
            setattr(order, field, data[field])

    order.save()  # auto_now سيقوم بتحديث modified_at تلقائيًا

    return Response({
        'message': 'Order updated',
        'modified_at': order.modified_at
    })

@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, RolePermission])
def delete_sales_order(request, order_id):
    try:
        order = SalesOrder.objects.get(pk=order_id)
        order.delete()
        return Response({'message': 'Sales order deleted successfully.'}, status=status.HTTP_200_OK)
    except SalesOrder.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

@required_role(['sales', 'ceo'])  
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_sales_orders_ready_to_archive(request):
    orders = SalesOrder.objects.filter(
        client_status='confirmed',
        status='completed'
    ).prefetch_related('details')

    serializer = SalesOrderSerializer(orders, many=True)
    return Response(serializer.data)

@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def mark_sales_order_as_delivered(request, order_id):
    try:
        order = SalesOrder.objects.get(pk=order_id)
    except SalesOrder.DoesNotExist:
        return Response({'error': 'Sales order not found'}, status=status.HTTP_404_NOT_FOUND)

    if order.status != 'completed':
        return Response({'error': 'Order must be completed before marking as delivered'}, status=status.HTTP_400_BAD_REQUEST)

    order.status = 'Received'
    order.save()
    return Response({'message': f'Sales order {order.id} marked as delivered (Received).'})

@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['POST'])
@permission_classes([IsAuthenticated, RolePermission])
def add_invoice_detail(request, order_id):
    try:
        order = SalesOrder.objects.get(pk=order_id)
    except SalesOrder.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SalesInvoiceDetailSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        quantity = data['quantity']
        unit_price = data['unit_price']
        taxes = data.get('taxes', 0)
        total_price = quantity * unit_price + taxes

        detail = SalesInvoiceDetail.objects.create(
            sale=order,
            product=data['product'],
            quantity=quantity,
            unit_price=unit_price,
            taxes=taxes,
            total_price=total_price
        )

        # تحديث إجمالي الطلب
        order.total_amount += total_price
        order.save()

        return Response(SalesInvoiceDetailSerializer(detail).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@required_role(['sales', 'ceo'])
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_sales_order_with_details(request, order_id):
    try:
        order = SalesOrder.objects.get(pk=order_id)
    except SalesOrder.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    updated_fields = ['status', 'client_status', 'delivery_deadline', 'notes']
    
    for field in updated_fields:
        if field in data:
            setattr(order, field, data[field])

    updated_detail_ids = []
    
    if 'details' in data:
        existing_details = SalesInvoiceDetail.objects.filter(sale=order)
        detail_map = {d.id: d for d in existing_details}

        for detail_data in data['details']:
            detail_id = detail_data.get('id')
            if detail_id in detail_map:
                serializer = SalesInvoiceDetailSerializer(detail_map[detail_id], data=detail_data, partial=True)
                if serializer.is_valid():
                    # حساب total_price إذا تم تعديل الكمية أو السعر أو الضرائب
                    validated = serializer.validated_data
                    quantity = validated.get('quantity', detail_map[detail_id].quantity)
                    unit_price = validated.get('unit_price', detail_map[detail_id].unit_price)
                    taxes = validated.get('taxes', detail_map[detail_id].taxes)
                    total_price = quantity * unit_price + taxes

                    serializer.save(total_price=total_price)
                    updated_detail_ids.append(detail_id)
                else:
                    return Response({'error': f'Detail #{detail_id} invalid', 'detail_errors': serializer.errors},
                                    status=status.HTTP_400_BAD_REQUEST)

    order.modified_at = timezone.now()
    order.save()

    return Response({
        'message': 'Order and details updated',
        'order_modified_at': order.modified_at,
        'updated_details': updated_detail_ids
    }, status=status.HTTP_200_OK)


@required_role(['sales', 'ceo'])
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_invoice_detail(request, detail_id):
    try:
        detail = SalesInvoiceDetail.objects.get(pk=detail_id)
    except SalesInvoiceDetail.DoesNotExist:
        return Response({'error': 'Detail not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SalesInvoiceDetailSerializer(detail, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()

        # تحديث تاريخ التعديل في الطلب المرتبط
        order = detail.sale
        order.modified_at = timezone.now()
        order.save()

        return Response({
            'message': 'Invoice detail updated successfully.',
            'order_modified_at': order.modified_at
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, RolePermission])
def delete_invoice_detail(request, detail_id):
    try:
        detail = SalesInvoiceDetail.objects.get(pk=detail_id)
    except SalesInvoiceDetail.DoesNotExist:
        return Response({'error': 'Detail not found'}, status=status.HTTP_404_NOT_FOUND)

    order = detail.sale
    order.total_amount -= detail.total_price
    order.save()
    
    detail.delete()

    return Response({'message': 'Detail deleted'}, status=status.HTTP_204_NO_CONTENT)


@required_role(['sales', 'ceo'])
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RolePermission])
def update_client_status(request, order_id):
    
    try:
        order = SalesOrder.objects.get(pk=order_id)
    except SalesOrder.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

    new_status = request.data.get('client_status')
    if new_status not in ['pending', 'confirmed', 'rejected']:
        return Response({'error': 'Invalid status'}, status=400)

    order.client_status = new_status
    order.save()

    if new_status == 'confirmed':
        # إنشاء أمر تصنيع جديد
        production_order = ProductionOrder.objects.create(
            employee=order.employee,
            sales_order=order,
            start_date=timezone.now().date(),
            expected_end_date=timezone.now().date() + timedelta(days=14),
            notes=f'طلب تصنيع بناء على تأكيد فاتورة بيع #{order.id}'
        )

        # جلب تفاصيل الفاتورة وربطها بأمر التصنيع
        details = SalesInvoiceDetail.objects.filter(sale=order)
        for item in details:
            ProductionOrderDetail.objects.create(
                production_order=production_order,
                product=item.product,
                quantity=item.quantity,
                status='planned'
            )

    return Response({'message': 'Status updated and production order created with product details (if confirmed).'})


@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def get_sales_order_by_id(request, order_id):
    try:
        order = SalesOrder.objects.get(id=order_id)
        serializer = SalesOrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except SalesOrder.DoesNotExist:
        return Response({'error': 'Sales order not found'}, status=status.HTTP_404_NOT_FOUND)


@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def list_confirmed_sales_orders(request):
    confirmed_orders = SalesOrder.objects.filter(status='confirmed')
    serializer = SalesOrderSerializer(confirmed_orders, many=True)
    return Response(serializer.data)


@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def sales_orders_by_client(request, client_id):
    orders = SalesOrder.objects.filter(client_id=client_id)
    serializer = SalesOrderSerializer(orders, many=True)
    return Response(serializer.data)

@required_role(['sales', 'ceo'])  # ← تحديد الدور
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def sales_summary_by_date(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    queryset = SalesInvoiceDetail.objects.all()

    if start_date and end_date:
        queryset = queryset.filter(salesale_daterange=[parse_date(start_date), parse_date(end_date)])

    summary = queryset.values('product__name').annotate(total_quantity=Sum('quantity'))

    return Response(summary)



@required_role(['sales', 'ceo'])
@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def sales_orders_by_date(request):
    
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return Response({'error': 'يجب تحديد تاريخ البداية والنهاية'}, status=400)

    orders = SalesOrder.objects.filter(sale_date__range=[start_date, end_date])
    serializer = SalesOrderSerializer(orders, many=True)
    return Response(serializer.data)



















@api_view(['GET'])
@permission_classes([IsAuthenticated, RolePermission])
def sales_summary(request):
    request._request.required_role = ['sales', 'ceo']
    product_name = request.GET.get('product_name')

    queryset = SalesInvoiceDetail.objects.values('product__name').annotate(total_quantity=Sum('quantity'))

    if product_name:
        queryset = queryset.filter(product__name=product_name)

    return Response(queryset)




