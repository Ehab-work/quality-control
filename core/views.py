from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import Supplier,SalesOrder,RawMaterial,Client,ProductionOrderDetail,PurchaseOrder,Product,RatioOfProduct,ProductionOrder,Employee
from .serializers import SupplierSerializer,SalesOrderSerializer,ClientSerializer, EmployeeSerializer,ProductionOrderSerializer,RatioOfProductSerializer,RawMaterialSerializer,ProductSerializer,PurchaseOrderSerializer,PurchaseOrderListSerializer

@api_view(['GET'])
def list_employees(request):
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_supplier(request):
    serializer = SupplierSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_suppliers(request):
    suppliers = Supplier.objects.all()
    serializer = SupplierSerializer(suppliers, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_raw_material(request):
    serializer = RawMaterialSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_raw_materials(request):
    materials = RawMaterial.objects.all()
    serializer = RawMaterialSerializer(materials, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_purchase_order(request):
    serializer = PurchaseOrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_purchase_orders(request):
    orders = PurchaseOrder.objects.all().order_by('-id')
    serializer = PurchaseOrderListSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_products(request):
    products = Product.objects.all().order_by('-id')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def list_ratios(request):
    ratios = RatioOfProduct.objects.all()
    serializer = RatioOfProductSerializer(ratios, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_ratio(request):
    serializer = RatioOfProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def create_production_order(request):
    serializer = ProductionOrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_production_orders(request):
    orders = ProductionOrder.objects.all()
    serializer = ProductionOrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
def update_production_order_status(request, order_id):
    try:
        order = ProductionOrder.objects.get(pk=order_id)
    except ProductionOrder.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

    new_status = request.data.get('status')
    if new_status not in ['planned', 'in_progress', 'completed']:
        return Response({'error': 'Invalid status'}, status=400)

    # لو الحالة الجديدة هي completed وكان الطلب مش مكتمل قبل كده
    if new_status == 'completed' and order.status != 'completed':
        for detail in order.details.all():
            product = detail.product
            product.stock_quantity += detail.quantity
            product.save()

    order.status = new_status
    order.save()
    return Response({'message': 'Order status updated and stock updated (if completed).'})

@api_view(['PATCH'])
def update_order_detail_status(request, detail_id):

    try:
        detail = ProductionOrderDetail.objects.get(pk=detail_id)
    except ProductionOrderDetail.DoesNotExist:
        return Response({'error': 'Detail not found'}, status=404)

    new_status = request.data.get('status')
    if new_status not in ['planned', 'in_progress', 'completed']:
        return Response({'error': 'Invalid status'}, status=400)

    detail.status = new_status
    detail.save()
    return Response({'message': 'Product status updated'})

@api_view(['POST'])
def add_client(request):
    serializer = ClientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def list_clients(request):
    clients = Client.objects.all()
    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_sales_order(request):
    serializer = SalesOrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def list_sales_orders(request):
    orders = SalesOrder.objects.all()
    serializer = SalesOrderSerializer(orders, many=True)
    return Response(serializer.data)

def analysis_page(request):
    return render(request, 'analysis.html')  # اسم الصفحة اللي هنعرض فيها Dash





