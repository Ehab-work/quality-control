from rest_framework.permissions import BasePermission

class RolePermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True

        # جلب الدور المطلوب من view أو من request (كما هو مستخدم في views.py)
        required_role = getattr(view, 'required_role', None) or getattr(request._request, 'required_role', None)

        if not required_role:
            return False

        # قراءة دور المستخدم وتحويله إلى lowercase
        user_role = getattr(request.user.employee, 'role', '').lower() if hasattr(request.user, 'employee') else ''

        # دعم multiple roles و lowercase
        if isinstance(required_role, list):
            return user_role in [r.lower() for r in required_role]

        return user_role == required_role.lower()


# ✅ صلاحيات مفصلة (اختيارية، حسب الحاجة)

class IsCEO(RolePermission):
    def has_permission(self, request, view):
        view.required_role = 'ceo'
        return super().has_permission(request, view)

class IsSales(RolePermission):
    def has_permission(self, request, view):
        view.required_role = 'sales'
        return super().has_permission(request, view)

class IsPurchase(RolePermission):
    def has_permission(self, request, view):
        view.required_role = 'purchase'
        return super().has_permission(request, view)

class IsProduction(RolePermission):
    def has_permission(self, request, view):
        view.required_role = 'production'
        return super().has_permission(request, view)
