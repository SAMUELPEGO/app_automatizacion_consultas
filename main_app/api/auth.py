from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate,login


@require_http_methods(["POST"])
def api_login(request):
    try:
        username = request.POST.get('usuario')
        password = request.POST.get('contrasena')

        if not username or not password:
            return JsonResponse({
                'success': False,
                'error': 'Usuario y contraseña son requeridos.'
            }, status=400)

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({
                'success': True,
                'message': 'Login exitoso',
                'usuario': user.username
            })
        else:
            return JsonResponse({
                'success': False,
                'error': 'Credenciales inválidas.'
            }, status=401)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)