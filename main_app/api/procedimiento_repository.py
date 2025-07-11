from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from main_app.models import Procedimiento, Perfil, Consulta
from django.db import transaction
from django.conf import settings
import os
from django.db import transaction

@login_required
@require_http_methods(["GET"])
def obtener_procedimientos(request):
    procedimientos = Procedimiento.objects.all()
    data = []
    for procedimiento in procedimientos:
        data.append({
            "id": procedimiento.id,
            'nombre': procedimiento.nombre,
            'descripcion': procedimiento.descripcion,
            'archivo': procedimiento.archivo.url if procedimiento.archivo else None,
            'perfil_username': procedimiento.perfil.username if procedimiento.perfil else None,
        })
    return JsonResponse({'success': True, 'procedimientos': data})

@login_required
@require_http_methods(["GET"])
def obtener_procedimientos_por_especialista(request):
    especialista = request.user.username
    procedimientos = Procedimiento.objects.filter(perfil__usuario__username=especialista)
    data = []
    for procedimiento in procedimientos:
        data.append({
            "id": procedimiento.id,
            'nombre': procedimiento.nombre,
            'descripcion': procedimiento.descripcion,
            'archivo': procedimiento.archivo.url if procedimiento.archivo else None,
            'perfil_username': procedimiento.perfil.username if procedimiento.perfil else None,
        })
    return JsonResponse({'success': True, 'procedimientos': data})

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def crear_procedimiento(request):
    try:
        nombre = request.POST.get('username')
        descripcion = request.POST.get('descripcion', '')
        rol = request.POST.get('rol')
        archivo = request.FILES.get('archivo')

        if not all([nombre, rol, descripcion, archivo]):
            return JsonResponse({'success': False, 'error': 'Faltan datos y todos son obligatorios'}, status=400)

        with transaction.atomic():
            
            perfil = request.user.perfil
            print(perfil)
            procedimiento = Procedimiento.objects.create(
                nombre=nombre,
                descripcion=descripcion,
                archivo=archivo,
                perfil=perfil,
            )
        
        return JsonResponse({'success': True, 'message': "Procedimiento creado correctamente"})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@login_required
@csrf_exempt
@require_http_methods(["POST"])
@login_required
@csrf_exempt
@require_http_methods(["POST"])
def actualizar_procedimiento(request):
    try:
        procedimiento_id = request.POST.get('procedimiento_id')
        if not procedimiento_id:
            return JsonResponse({'success': False, 'error': 'ID de procedimiento es requerido.'}, status=400)
        
        procedimiento = Procedimiento.objects.get(id=procedimiento_id)
        procedimiento_nombre = request.POST.get('username')
        descripcion = request.POST.get('descripcion')
        rol = request.POST.get('rol')
        archivo = request.FILES.get('archivo')
        
        with transaction.atomic():
            if procedimiento_nombre:
                procedimiento.nombre = procedimiento_nombre
            
            if descripcion is not None:
                procedimiento.descripcion = descripcion
            
            if rol:
                if procedimiento.perfil:
                    procedimiento.perfil.rol = rol
                    procedimiento.perfil.save()
                else:
                    procedimiento.perfil = Perfil.objects.create(rol=rol)
            
            if archivo:
                if procedimiento.archivo:
                    archivo_anterior_path = procedimiento.archivo.path
                    if os.path.exists(archivo_anterior_path):
                        os.remove(archivo_anterior_path)
                procedimiento.archivo = archivo
            
            procedimiento.save()
            
            if procedimiento_nombre:
                consultas_con_procedimiento = Consulta.objects.filter(
                    procedimiento_id=procedimiento_id
                )
                consultas_con_procedimiento.update(procedimiento_nombre=procedimiento_nombre)
        
        return JsonResponse({'success': True, 'message': "Procedimiento actualizado correctamente"})
    
    except Procedimiento.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Procedimiento no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def eliminar_procedimiento(request):
    try:
        procedimiento_id = request.POST.get('procedimiento_id')
        if not procedimiento_id:
            return JsonResponse({'success': False, 'error': 'ID de procedimiento es requerido.'}, status=400)
        
        with transaction.atomic():
            procedimiento = Procedimiento.objects.get(id=procedimiento_id)
            
            if procedimiento.archivo:
                archivo_path = procedimiento.archivo.path
                if os.path.exists(archivo_path):
                    os.remove(archivo_path)
            
            Consulta.objects.filter(procedimiento_id=procedimiento_id).delete()
            
            procedimiento.delete()
        
        return JsonResponse({'success': True, 'message': "Procedimiento eliminado correctamente"})
    except Procedimiento.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Procedimiento no encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)