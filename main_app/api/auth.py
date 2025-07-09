from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate,login,logout
from django.shortcuts import redirect
from django.urls import reverse



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
            if user.perfil.rol == 'especialista_principal':
               redirect_url = reverse('especialista_principal_page')
            elif user.perfil.rol == 'especialista':
               redirect_url = reverse('especialista_page')
            elif user.perfil.rol == 'guardia':
               redirect_url = reverse('guardia_page')
            return JsonResponse({
                'success': True,
                'message': 'Login exitoso',
                'usuario': user.username,
                'redirect_url': redirect_url
            })
        
        else:
            return JsonResponse({
                'success': False,
                'error': 'Credenciales inválidas.'
            })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
    

@require_http_methods(["GET"])
def api_logOut(request):
    logout(request)
    return redirect("inicio_sesion")