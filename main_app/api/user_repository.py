from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from main_app.models import Usuario, Perfil, Procedimiento, Consulta
from django.db import transaction

@login_required
@require_http_methods(["GET"])
def obtener_usuarios(request):
    query = request.GET.get('especialista_principal', '').strip().lower()
    
    if query == 'true':
        usuarios = Usuario.objects.all()
    else:
        usuarios = Usuario.objects.exclude(perfil__rol='especialista_principal')
    data = []
    for usuario in usuarios:
        data.append({
            "id":usuario.id,
            'username': usuario.username,
            'rol': usuario.perfil.rol if usuario.perfil else None,
        })
    return JsonResponse({'success': True, 'usuarios': data})

@login_required
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
            perfil = Perfil.objects.create(rol=rol,username=username)
            usuario = Usuario.objects.create_user(
                username=username,
                password=password,
                perfil=perfil,

            )
        return JsonResponse({'success': True, 'message': "usuario creado correctamente"})
    except Exception as e:
         if 'UNIQUE constraint failed' in str(e):
            return JsonResponse({'success': False, 'error': 'El nombre de usuario ya existe.'}, status=400)
        
         return JsonResponse({'success': False, 'error': str(e)}, status=500)

@login_required
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
        
       
        username_anterior = usuario.perfil.username if usuario.perfil else None
        
        with transaction.atomic():
            if username:
                usuario.username = username
            if password:
                usuario.set_password(password)
            
            if usuario.perfil:
                if username:
                    usuario.perfil.username = username
                usuario.perfil.save()
            
            usuario.save()
            
            if username and username_anterior != username:
                procedimientos_a_actualizar = Procedimiento.objects.filter(
                    perfil__username=username_anterior
                )
                
                for procedimiento in procedimientos_a_actualizar:
                    if procedimiento.perfil:
                        procedimiento.perfil.username = username
                        procedimiento.perfil.save()
                
                consultas_emisor = Consulta.objects.filter(
                    emisor=username_anterior
                )
                consultas_emisor.update(emisor=username)
                
                consultas_receptor = Consulta.objects.filter(
                    receptor=username_anterior
                )
                consultas_receptor.update(receptor=username)
        return JsonResponse({'success': True})
        
    except Usuario.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Usuario no encontrado.'}, status=404)
    except Exception as e:
        if 'UNIQUE constraint failed' in str(e):
            return JsonResponse({'success': False, 'error': 'El nombre de usuario ya existe.'}, status=400)
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@login_required
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