from rest_framework.permissions import BasePermission

class RolePermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True

        required_role = getattr(view, 'required_role', None) or getattr(request._request, 'required_role', None)

        if not required_role:
            return False

        # ✅ دعم قائمة من الأدوار مع case-insensitive comparison
        if isinstance(required_role, list):
            user_role = getattr(request.user.employee, 'role', '').lower() if hasattr(request.user, 'employee') else ''
            return user_role in [role.lower() for role in required_role]
        
        user_role = getattr(request.user.employee, 'role', '').lower() if hasattr(request.user, 'employee') else ''
        return user_role == required_role.lower()

# OPTIONAL: صلاحيات فردية لو احتجت تخصص Permissions دقيقة في بعض الحالات
class IsCEO(RolePermission):
    def has_permission(self, request, view):
        view.required_role = 'ceo'
        return super().has_permission(request, view)

class IsSales(RolePermission):
    def has_permission(self, request, view):
        view.required_role = 'Sales'
        return super().has_permission(request, view)

class IsPurchase(RolePermission):
    def has_permission(self, request, view):
        view.required_role = 'Purchase'
        return super().has_permission(request, view)

class IsProduction(RolePermission):
    def has_permission(self, request, view):
        view.required_role = 'Production'
        return super().has_permission(request, view)