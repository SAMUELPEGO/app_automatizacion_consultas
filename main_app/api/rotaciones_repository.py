# views.py

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from ..models import Rotaciones

@login_required
@require_http_methods(["GET"])
def obtener_rotaciones_por_fecha(request):
    fecha = request.GET.get("fecha")
    if not fecha:
        return JsonResponse({"success": False, "error": "Fecha requerida"})
    
    try:
        rotaciones = Rotaciones.objects.filter(fecha=fecha)
        data = [
            {
                "id": r.id,
                "username": r.username,
                "fecha": r.fecha,
                "entrada": r.entrada,
                "salida": r.salida
            }
            for r in rotaciones
        ]
        return JsonResponse({"success": True, "rotaciones": data})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})
    

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def eliminar_rotacion_usuario(request):
    from django.utils.datastructures import MultiValueDictKeyError
    try:
        id_rotacion = request.POST["id"]
        rotacion = Rotaciones.objects.get(id=id_rotacion)
        rotacion.delete()
        return JsonResponse({"success": True})
    except MultiValueDictKeyError:
        return JsonResponse({"success": False, "error": "ID no proporcionado"}, status=400)
    except Rotaciones.DoesNotExist:
        return JsonResponse({"success": False, "error": "Rotación no encontrada"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
    

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def anadir_rotacion_usuario(request):
    try:
        username = request.POST.get("nombre")
        fecha = request.POST.get("fecha")
        entrada = request.POST.get("entrada")
        salida = request.POST.get("salida")

        if not all([username, fecha, entrada, salida]):
            return JsonResponse({"success": False, "error": "Todos los campos son obligatorios"})

        rotacion = Rotaciones.objects.create(
            username=username,
            fecha=fecha,
            entrada=entrada,
            salida=salida
        )
        return JsonResponse({
            "success": True,
            "rotacion": {
                "id": rotacion.id,
                "username": rotacion.username,
                "fecha": rotacion.fecha,
                "entrada": rotacion.entrada,
                "salida": rotacion.salida
            }
        })
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)