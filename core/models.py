from django.db import models
from django.core.validators import RegexValidator
from django.core.validators import MinValueValidator

# جدول الموظفين

phone_validator = RegexValidator(
    regex=r'^01[0-9]{9}$',
    message='Phone number must be exactly 11 digits and start with 01'
)

class Employee(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    age = models.SmallIntegerField()
    job_title = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=11, validators=[phone_validator])
    national_id = models.CharField(max_length=14)

    def __str__(self):
        return self.name
    
class Supplier(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=11, validators=[phone_validator])
    notes = models.TextField(blank=True)
    added_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name
# جدول المواد الخام
class RawMaterial(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=20)
    avg_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

# جدول المنتجات
class Product(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    worst_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    stock_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])

    def __str__(self):
        return self.name
# جدول العملاء

class Client(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone_number = models.CharField(
        max_length=11,
        validators=[RegexValidator(regex=r'^\d{11}$', message='Phone number must be 11 digits')]
    )
    email = models.EmailField()

    def str(self):
        return self.name
# جدول أوامر الشراء

class PurchaseOrder(models.Model):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    supplier = models.ForeignKey('Supplier', on_delete=models.CASCADE)
    order_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Purchase Order #{self.id}"
    

class PurchaseInvoiceDetail(models.Model):
    order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='details')
    raw_material = models.ForeignKey('RawMaterial', on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def str(self):
        return f"{self.quantity} x {self.raw_material.name}"

# جدول أوامر البيع

class SalesOrder(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    sale_date = models.DateField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default='pending')
    delivery_deadline = models.DateField()
    notes = models.TextField(blank=True)
# تفاصيل فاتورة البيع


class SalesInvoiceDetail(models.Model):
    sale = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='details')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    taxes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

# جدول نسب المواد الخام في كل منتج

class RatioOfProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    raw_material = models.ForeignKey(RawMaterial, on_delete=models.CASCADE)
    ratio = models.DecimalField(max_digits=10, decimal_places=4, validators=[MinValueValidator(0)])

class ProductionOrder(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    start_date = models.DateField()
    expected_end_date = models.DateField()
    actual_end_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('planned', 'Planned'), ('in_progress', 'In Progress'), ('completed', 'Completed')],
        default='planned'
    )
    notes = models.TextField(blank=True)

    def str(self):
        return f"Order #{self.id}"
# تفاصيل أوامر الإنتاج (المنتجات المطلوبة)

class ProductionOrderDetail(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    production_order = models.ForeignKey(ProductionOrder, on_delete=models.CASCADE,related_name='details')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='planned'
    )

    def str(self):
        return f"{self.quantity} of {self.product.name} for Order #{self.production_order.id}"
# استهلاك المواد الخام أثناء الإنتاج
class ProductionConsumption(models.Model):
    production_order = models.ForeignKey(ProductionOrder, on_delete=models.CASCADE)
    raw_material = models.ForeignKey(RawMaterial, on_delete=models.CASCADE)
    quantity_used = models.DecimalField(max_digits=10, decimal_places=2)
    handled_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)  # الموظف المسؤول عن الإخراج