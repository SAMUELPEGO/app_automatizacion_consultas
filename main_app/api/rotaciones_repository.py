# views.py

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import datetime
from django.utils import timezone
from ..models import Rotaciones

@login_required
@require_http_methods(["GET"])
def obtener_rotaciones_por_fecha(request):
    fecha = request.GET.get("fecha")
    if not fecha:
        return JsonResponse({"success": False, "error": "Fecha requerida"})
    
    try:
        rotaciones = Rotaciones.objects.filter(fecha_entrada=fecha)
        data = [
            {
                "id": r.id,
                "username": r.username,
                "fecha_entrada": r.fecha_entrada,
                "entrada": r.entrada,
                "fecha_salida": r.fecha_salida,
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
        fecha_entrada = request.POST.get("fecha_entrada")
        entrada = request.POST.get("entrada")  # formato "HH:MM AM/PM"
        fecha_salida = request.POST.get("fecha_salida")
        salida = request.POST.get("salida")     # formato "HH:MM AM/PM"

        if not all([username, fecha_entrada, entrada, fecha_salida, salida]):
            return JsonResponse({
                "success": False,
                "error": "Todos los campos son obligatorios."
            })

        try:
            dt_entrada = datetime.datetime.strptime(f"{fecha_entrada} {entrada}", "%Y-%m-%d %I:%M %p")
            dt_salida = datetime.datetime.strptime(f"{fecha_salida} {salida}", "%Y-%m-%d %I:%M %p")
        except ValueError as ve:
            return JsonResponse({
                "success": False,
                "error": "Formato de hora o fecha inválido. Use fechas en formato YYYY-MM-DD y horas en AM/PM."
            })

        if dt_salida <= dt_entrada:
            return JsonResponse({
                "success": False,
                "error": "La hora de salida debe ser mayor a la de entrada."
            })

        if (dt_salida - dt_entrada).total_seconds() > 86400:  # Más de 24 horas
            return JsonResponse({
                "success": False,
                "error": "La rotación no puede durar más de 24 horas."
            })

        # Validar solapamiento con **TODAS LAS ROTACIONES EXISTENTES**, sin importar el usuario
        conflictos = Rotaciones.objects.all()

        for r in conflictos:
            try:
                r_dt_entrada = datetime.datetime.strptime(
                    f"{r.fecha_entrada} {r.entrada}", "%Y-%m-%d %I:%M %p"
                )
                r_dt_salida = datetime.datetime.strptime(
                    f"{r.fecha_salida} {r.salida}", "%Y-%m-%d %I:%M %p"
                )
            except ValueError:
                continue  # Saltar registros corruptos

            # Condición general de solapamiento
            if dt_entrada < r_dt_salida and dt_salida > r_dt_entrada:
                return JsonResponse({
                    "success": False,
                    "error": f"Ya existe una rotación programada entre "
                             f"{r.fecha_entrada} {r.entrada} y {r.fecha_salida} {r.salida}. "
                             f"No pueden solaparse con otras rotaciones."
                })

        # Crear rotación si pasa todas las validaciones
        rotacion = Rotaciones.objects.create(
            username=username,
            fecha_entrada=fecha_entrada,
            entrada=entrada,
            fecha_salida=fecha_salida,
            salida=salida
        )

        return JsonResponse({
            "success": True,
            "rotacion": {
                "id": rotacion.id,
                "username": rotacion.username,
                "fecha_entrada": rotacion.fecha_entrada,
                "entrada": rotacion.entrada,
                "fecha_salida": rotacion.fecha_salida,
                "salida": rotacion.salida
            }
        })

    except Exception as e:
        print(str(e))
        return JsonResponse({"success": False, "error": str(e)}, status=500)