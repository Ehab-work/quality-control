from rest_framework import serializers
from .models import Supplier,ProductionOrder,SalesOrder,SalesInvoiceDetail,Client, Employee, ProductionOrderDetail,RawMaterial,PurchaseOrder,ProductionOrder, PurchaseInvoiceDetail,Product,RatioOfProduct

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'address', 'age', 'job_title', 'phone_number', 'national_id']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class RawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = '__all__'

class PurchaseInvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseInvoiceDetail
        fields = ['raw_material', 'quantity', 'unit_price']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    details = PurchaseInvoiceDetailSerializer(many=True)

    class Meta:
        model = PurchaseOrder
        fields = ['id', 'employee', 'supplier', 'order_date', 'total_amount', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        order = PurchaseOrder.objects.create(**validated_data)
        for item in details_data:
            PurchaseInvoiceDetail.objects.create(order=order, **item)
        return order
    
class PurchaseInvoiceDetailSerializer(serializers.ModelSerializer):
    raw_material_name = serializers.CharField(source='raw_material.name', read_only=True)

    class Meta:
        model = PurchaseInvoiceDetail
        fields = ['raw_material_name', 'quantity', 'unit_price']

class PurchaseOrderListSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    details = PurchaseInvoiceDetailSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = ['id', 'supplier_name', 'employee_name', 'order_date', 'total_amount', 'details']    

class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'

class RatioOfProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    raw_material_name = serializers.CharField(source='raw_material.name', read_only=True)

    class Meta:
        model = RatioOfProduct
        fields = ['id', 'product', 'product_name', 'raw_material', 'raw_material_name', 'ratio']

class ProductionOrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionOrderDetail
        fields = ['product', 'quantity','status']  # احذف production_order من هنا

class ProductionOrderSerializer(serializers.ModelSerializer):
    details = ProductionOrderDetailSerializer(many=True)

    class Meta:
        model = ProductionOrder
        fields = ['id', 'employee', 'start_date', 'expected_end_date', 'actual_end_date', 'status', 'notes', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        order = ProductionOrder.objects.create(**validated_data)
        for detail in details_data:
            ProductionOrderDetail.objects.create(production_order=order, **detail)
        return order

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['details'] = ProductionOrderDetailSerializer(instance.details.all(), many=True).data
        return rep
    
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class SalesInvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesInvoiceDetail
        fields = ['product', 'quantity', 'unit_price', 'taxes', 'total_price']

class SalesOrderSerializer(serializers.ModelSerializer):
    details = SalesInvoiceDetailSerializer(many=True)

    class Meta:
        model = SalesOrder
        fields = ['id','employee', 'client', 'sale_date', 'total_amount', 'status', 'delivery_deadline', 'notes', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        total = 0
        order = SalesOrder.objects.create(**validated_data)

        for detail in details_data:
            quantity = detail['quantity']
            unit_price = detail['unit_price']
            taxes = detail.get('taxes', 0)
            total_price = (quantity * unit_price) + taxes
            total += total_price

            SalesInvoiceDetail.objects.create(
                sale=order,
                product=detail['product'],
                quantity=quantity,
                unit_price=unit_price,
                taxes=taxes,
                total_price=total_price
            )

        order.total_amount = total
        order.save()

        return order
