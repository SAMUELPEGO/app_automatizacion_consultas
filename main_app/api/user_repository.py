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
                perfil=perfil
            )
        return JsonResponse({'success': True, 'message': "usuario creado correctamente"})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def actualizar_usuario(request, usuario_id):
    try:
        usuario = Usuario.objects.get(id=usuario_id)
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        rol = request.POST.get('rol')
        nombre_perfil = request.POST.get('nombre_perfil')
        descripcion = request.POST.get('descripcion')

        if username:
            usuario.username = username
        if email:
            usuario.email = email
        if password:
            usuario.set_password(password)
        usuario.save()

        if usuario.perfil:
            if rol:
                usuario.perfil.rol = rol
            if nombre_perfil:
                usuario.perfil.nombre = nombre_perfil
            if descripcion is not None:
                usuario.perfil.descripcion = descripcion
            usuario.perfil.save()

        return JsonResponse({'success': True})
    except Usuario.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Usuario no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def eliminar_usuario(request, usuario_id):
    try:
        usuario = Usuario.objects.get(id=usuario_id)
        if usuario.perfil:
            usuario.perfil.delete()
        usuario.delete()
        return JsonResponse({'success': True})
    except Usuario.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Usuario no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)