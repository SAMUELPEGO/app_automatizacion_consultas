

# INSTRUCCIONES INICIALES DE INSTALACION QUE CORRESPONDEN A LAS MIGRACIONES INICIALES Y A LA CREACION DEL PRIMER USUARIO 

# asegurate de estar en el entorno virtual de tu proyecto
# python -m venv env

# instala las dependencias
# pip install -r requirements.txt

# Ejecuta los siguientes comandos en la terminal:
# python manage.py makemigrations main_app
# python manage.py migrate
# python manage.py shell

# copia el siguiente codigo en la shell de django para crear el primer usuario

from django.db import transaction
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