#from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import (
    Employee, Supplier, RawMaterial, Product, Client,
    PurchaseOrder, PurchaseInvoiceDetail,
    SalesOrder, SalesInvoiceDetail,
    RatioOfProduct, ProductionOrder, ProductionConsumption,ProductionOrderDetail
)



admin.site.register(Employee)
admin.site.register(Supplier)
admin.site.register(RawMaterial)
admin.site.register(Product)
admin.site.register(Client)
admin.site.register(PurchaseOrder)
admin.site.register(PurchaseInvoiceDetail)
admin.site.register(SalesOrder)
admin.site.register(SalesInvoiceDetail)
admin.site.register(RatioOfProduct)
admin.site.register(ProductionOrder)
admin.site.register(ProductionConsumption)
admin.site.register(ProductionOrderDetail)