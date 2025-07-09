from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from main_app.models import Consulta
from django.db import transaction

@login_required
@require_http_methods(["GET"])
def obtener_consultas(request):
    consultas = Consulta.objects.all()
    data = []
    for consulta in consultas:
        data.append({
            "id": consulta.id,
            'emisor': consulta.emisor,
            'receptor': consulta.receptor,
        })
    return JsonResponse({'success': True, 'consultas': data})

@login_required
@require_http_methods(["GET"])
def obtener_consultas_por_emisor(request):
    emisor = request.user.username
    consultas = Consulta.objects.filter(emisor=emisor)
    data = []
    for consulta in consultas:
        data.append({
            "id": consulta.id,
            'emisor': consulta.emisor,
            'receptor': consulta.receptor,
            "contenido": consulta.contenido,
            "respuesta":consulta.respuesta,
            "estado":consulta.estado,
            'creada_en':consulta.creado_en,
            "procedimiento_id":consulta.procedimiento_id,
            "procedimiento_nombre": consulta.procedimiento_nombre
        })
    return JsonResponse({'success': True, 'consultas': data})
# ------------------------------------------------------------

@login_required
@require_http_methods(["GET"])
def obtener_consultas_por_receptor(request):
    receptor = request.user.username
    consultas = Consulta.objects.filter(receptor=receptor)
    data = []
    for consulta in consultas:
        data.append({
            "id": consulta.id,
            'emisor': consulta.emisor,
            'receptor': consulta.receptor,
            "contenido": consulta.contenido,
            "respuesta":consulta.respuesta,
            "estado":consulta.estado,
            'creada_en':consulta.creado_en,
            "procedimiento_id":consulta.procedimiento_id,
            "procedimiento_nombre": consulta.procedimiento_nombre
        })
    return JsonResponse({'success': True, 'consultas': data})
@login_required
@csrf_exempt
@require_http_methods(["POST"])
def eliminar_consulta(request):
    try:
        consulta_id = request.POST.get('consulta_id')
        if not consulta_id:
            return JsonResponse({'success': False, 'error': 'ID de consulta es requerido.'})
        
        consulta = Consulta.objects.get(id=consulta_id)
        
        if consulta.emisor != request.user.username:
            return JsonResponse({'success': False, 'error': 'No tienes permisos para eliminar esta consulta.'})
        
        consulta.delete()
        
        return JsonResponse({'success': True, 'message': "Consulta eliminada correctamente"})
    except Consulta.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Consulta no encontrada.'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
# @login_required
# @require_http_methods(["GET"])
# def obtener_consultas_por_receptor(request):
#     """Obtiene consultas filtradas por receptor (usuario actual)"""
#     receptor = request.user.username
#     consultas = Consulta.objects.filter(receptor=receptor)
#     data = []
#     for consulta in consultas:
#         data.append({
#             "id": consulta.id,
#             'emisor': consulta.emisor,
#             'receptor': consulta.receptor,
#         })
#     return JsonResponse({'success': True, 'consultas': data})

# @login_required
# @require_http_methods(["GET"])
# def obtener_consultas_por_parametro(request):
#     """Obtiene consultas filtradas por parámetros específicos"""
#     emisor = request.GET.get('emisor')
#     receptor = request.GET.get('receptor')
    
#     consultas = Consulta.objects.all()
    
#     if emisor:
#         consultas = consultas.filter(emisor=emisor)
#     if receptor:
#         consultas = consultas.filter(receptor=receptor)
    
#     data = []
#     for consulta in consultas:
#         data.append({
#             "id": consulta.id,
#             'emisor': consulta.emisor,
#             'receptor': consulta.receptor,
#         })
#     return JsonResponse({'success': True, 'consultas': data})

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def crear_consulta(request):
    try:
        receptor = request.POST.get('receptor')
        procedimiento_id = request.POST.get('procedimiento_id')
        procedimiento_nombre = request.POST.get('procedimiento_nombre')
        contenido = request.POST.get('contenido')
        
        if not procedimiento_id:
            return JsonResponse({'success': False, 'error': 'El ID del procedimiento es obligatorio.'})
        if not receptor:
            return JsonResponse({'success': False, 'error': 'El receptor es obligatorio.'})
        
        emisor = request.user.username

        if emisor == receptor:
            return JsonResponse({'success': False, 'error': 'El emisor y receptor no pueden ser el mismo.'})

        with transaction.atomic():
            consulta = Consulta.objects.create(
                emisor=emisor,
                receptor=receptor,
                procedimiento_id=procedimiento_id,
                procedimiento_nombre=procedimiento_nombre,
                contenido=contenido
            )
        
        return JsonResponse({
            'success': True, 
            'message': "Consulta creada correctamente",
            'consulta': {
                'id': consulta.id,
                'emisor': consulta.emisor,
                'receptor': consulta.receptor,
                'procedimiento_id': consulta.procedimiento_id,
                'procedimiento_nombre': consulta.procedimiento_nombre,
            }
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def actualizar_consulta(request):
    try:
        consulta_id = request.POST.get('consulta_id')
        if not consulta_id:
            return JsonResponse({'success': False, 'error': 'ID de consulta es requerido.'})
        
        consulta = Consulta.objects.get(id=consulta_id)
        
        if consulta.receptor != request.user.username:
            return JsonResponse({'success': False, 'error': 'No tienes permisos para actualizar esta consulta.'})
        
        respuesta = request.POST.get('respuesta')
        consulta.respuesta = respuesta
        consulta.estado = "respondida"

        # Validar que el emisor y receptor no sean el mismo
        if consulta.emisor == consulta.receptor:
            return JsonResponse({'success': False, 'error': 'El emisor y receptor no pueden ser el mismo.'})

        consulta.save()
        
        return JsonResponse({
            'success': True, 
            'message': "Consulta actualizada correctamente",
            'consulta': {
                'id': consulta.id,
                'emisor': consulta.emisor,
                'receptor': consulta.receptor,
            }
        })
    except Consulta.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Consulta no encontrada.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)



# @login_required
# @require_http_methods(["GET"])
# def obtener_consulta_por_id(request, consulta_id):
#     """Obtiene una consulta específica por ID"""
#     try:
#         consulta = Consulta.objects.get(id=consulta_id)
        
#         # Verificar que el usuario actual sea emisor o receptor de la consulta
#         if consulta.emisor != request.user.username and consulta.receptor != request.user.username:
#             return JsonResponse({'success': False, 'error': 'No tienes permisos para ver esta consulta.'}, status=403)
        
#         data = {
#             "id": consulta.id,
#             'emisor': consulta.emisor,
#             'receptor': consulta.receptor,
#         }
        
#         return JsonResponse({'success': True, 'consulta': data})
#     except Consulta.DoesNotExist:
#         return JsonResponse({'success': False, 'error': 'Consulta no encontrada.'}, status=404)
#     except Exception as e:
#         return JsonResponse({'success': False, 'error': str(e)}, status=500)