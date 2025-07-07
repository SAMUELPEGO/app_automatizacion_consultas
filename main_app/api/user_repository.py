from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from main_app.models import Usuario, Perfil
from django.db import transaction

@require_http_methods(["GET"])
def obtener_usuarios(request):
    usuarios = Usuario.objects.all()
    data = []
    for usuario in usuarios:
        data.append({
            "id":usuario.id,
            'username': usuario.username,
            'rol': usuario.perfil.rol if usuario.perfil else None,
        })
    return JsonResponse({'success': True, 'usuarios': data})

@csrf_exempt
@require_http_methods(["POST"])
def crear_usuario(request):
    try:
        username = request.POST.get('username')
        password = request.POST.get('password')
        rol = request.POST.get('rol')

        if not all([username, password, rol]):
            return JsonResponse({'success': False, 'error': 'Faltan datos obligatorios.'}, status=400)

        with transaction.atomic():
            perfil = Perfil.objects.create(rol=rol)
            usuario = Usuario.objects.create_user(
                username=username,
                password=password,
                perfil=perfil,

            )
        return JsonResponse({'success': True, 'message': "usuario creado correctamente"})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def actualizar_usuario(request):
    try:
        usuario_id = request.POST.get('usuario_id')
        if not usuario_id:
            return JsonResponse({'success': False, 'error': 'ID de usuario es requerido.'}, status=400)
        usuario = Usuario.objects.get(id=usuario_id)
        username = request.POST.get('username')
        password = request.POST.get('password')
        rol = request.POST.get('rol')
        if username:
            usuario.username = username
        if password:
            usuario.set_password(password)
        if rol:
            if usuario.perfil:
                usuario.perfil.rol = rol
                usuario.perfil.save()
            else:
                usuario.perfil = Perfil.objects.create(rol=rol)
        usuario.save()

        return JsonResponse({'success': True})
    except Usuario.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Usuario no encontrado.'}, status=404)
    except Exception as e:
        if str(e) == 'UNIQUE constraint failed: main_app_usuario.username':
            return JsonResponse({'success': False, 'error': 'El nombre de usuario ya existe.'}, status=400)
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def eliminar_usuario(request):
    try:
        usuario_id = request.POST.get('usuario_id')
        if not usuario_id:
            return JsonResponse({'success': False, 'error': 'ID de usuario es requerido.'}, status=400)
        usuario = Usuario.objects.get(id=usuario_id)
        if usuario.perfil:
            usuario.perfil.delete()
        usuario.delete()
        return JsonResponse({'success': True})
    except Usuario.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Usuario no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)