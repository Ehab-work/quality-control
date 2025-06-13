from rest_framework.permissions import BasePermission

class RolePermission(BasePermission):
    message = "You do not have the required role to perform this action."

    def has_permission(self, request, view):
        # 1. احضر required_role من view أو request._request
        required_role = getattr(view, 'required_role', None)
        if required_role is None and hasattr(request, "_request"):
            required_role = getattr(request._request, 'required_role', None)

        if not required_role:
            return False  # لم يتم تحديد أي صلاحية

        if not request.user or not request.user.is_authenticated:
            return False

        # 2. تأكد أن المستخدم مربوط بـ Employee
        try:
            employee = request.user.employee
        except:
            return False

        user_role = employee.role.lower()

        # 3. دعم string أو list
        if isinstance(required_role, list):
            return user_role in [r.lower() for r in required_role]
        return user_role == required_role.lower()
    

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
