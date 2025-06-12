from rest_framework import serializers
from .models import Supplier,ProductionOrder,SalesOrder,SalesInvoiceDetail,Client, Employee, ProductionOrderDetail,RawMaterial,PurchaseOrder,ProductionOrder, PurchaseInvoiceDetail,Product,RatioOfProduct
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'address', 'age', 'job_title', 'phone_number', 'national_id']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class RawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = '__all__'
        
class PurchaseInvoiceDetailSerializer(serializers.ModelSerializer):
    raw_material_name = serializers.CharField(source='raw_material.name', read_only=True)

    class Meta:
        model = PurchaseInvoiceDetail
        fields = ['raw_material', 'raw_material_name', 'quantity', 'unit_price']


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
    id = serializers.IntegerField(read_only=True) 
    class Meta:
        model = ProductionOrderDetail
        fields = ['id','product', 'quantity','status'] 

class ProductionOrderSerializer(serializers.ModelSerializer):
    details = ProductionOrderDetailSerializer(many=True, read_only=True)
    input_details = ProductionOrderDetailSerializer(many=True, write_only=True)

    class Meta:
        model = ProductionOrder
        fields = ['id', 'employee', 'start_date', 'expected_end_date', 'actual_end_date', 'status', 'notes', 'details','input_details']

    def create(self, validated_data):
        details_data = validated_data.pop('input_details', []) 
        order = ProductionOrder.objects.create(**validated_data)
        for detail in details_data:
            ProductionOrderDetail.objects.create(production_order=order, **detail)
        return order

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['details'] = ProductionOrderDetailSerializer(instance.details.all(), many=True).data
        return rep
# core/serializers.py

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class SalesInvoiceDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = SalesInvoiceDetail
        fields = ['id', 'product', 'quantity', 'unit_price', 'taxes', 'total_price']


class SalesOrderSerializer(serializers.ModelSerializer):
    details = SalesInvoiceDetailSerializer(many=True)

    class Meta:
        model = SalesOrder
        fields = [
            'id', 'employee', 'client', 'sale_date', 'modified_at',
            'total_amount', 'status', 'client_status', 'delivery_deadline',
            'notes', 'details'
        ]

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        order = SalesOrder.objects.create(**validated_data)

        total_amount = 0
        for det in details_data:
            qty   = det['quantity']
            price = det['unit_price']
            tax   = det.get('taxes', 0)
            line_total = qty * price + tax

            SalesInvoiceDetail.objects.create(
                sale=order,
                product=det['product'],
                quantity=qty,
                unit_price=price,
                taxes=tax,
                total_price=line_total
            )
            total_amount += line_total

        order.total_amount = total_amount
        order.save()
        return order


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.employee.role if hasattr(user, 'employee') else 'unknown'
        token['is_superuser'] = user.is_superuser  # هذا السطر مهم
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['role'] = self.user.employee.role if hasattr(self.user, 'employee') else 'unknown'
        data['is_superuser'] = self.user.is_superuser  # وهذا السطر مهم
        return data



