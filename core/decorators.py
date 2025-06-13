from functools import wraps

def required_role(role):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if hasattr(request, "_request"):
                request._request.required_role = role
            else:
                request.required_role = role
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator