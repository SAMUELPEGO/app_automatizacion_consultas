

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from ..models import Perfil

@require_http_methods(["GET"])
def api_perfiles_list(request):
    """Esta función se ejecuta cuando hacen GET a /api/perfiles/"""
    try:
        perfiles = Perfil.objects.all()
        data = []
        for perfil in perfiles:
            data.append({
                # 'id': perfil.id,
                'nombre': perfil.nombre,
                # 'descripcion': perfil.descripcion,
                'activo': perfil.activo,
                'usuarios_count': perfil.usuarios.count()
            })
        
        return JsonResponse({
            'success': True,
            'data': data,
            'total': len(data)
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)