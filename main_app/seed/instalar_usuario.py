# EJECUTAR EN EL SHELL DE DJANGO
# python manage.py shell

from django.db import transaction
from django.contrib.auth.models import User
from ..models import Perfil, Usuario  

usuario_campos = {
    'username': 'admin',
    'password': 'admin123',
    'rol': 'especialista_principal'
    }

def crear_primer_usuario(username, password, rol):
   
    try:
        with transaction.atomic():
            perfil = Perfil.objects.create(
                rol=rol,
                username=username
            )
            
            usuario = Usuario.objects.create_user(
                username=username,
                password=password,
                perfil=perfil,
            )
            
            print(f"✅ Usuario {username} creado exitosamente")
            print(f"✅ Perfil {rol} asociado correctamente")
            return usuario, perfil
            
    except Exception as e:
        print(f"❌ Error al crear usuario: {e}")
        return None, None

crear_primer_usuario(
    username=usuario_campos['username'],password=usuario_campos['password'],rol=usuario_campos['rol'])