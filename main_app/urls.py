
from django.urls import path
from .api import auth,user_repository
from . import views

urlpatterns = [
     path('',views.inicio_sesion),
       path('especialista_principal_page', views.especialista_principal_page, name='especialista_principal_page'),
       path('iniciar_sesion', auth.api_login, name='iniciar_sesion'),
       path("crear_usuario",user_repository.crear_usuario,name="crear_usuario"),
       path("eliminar_usuario",user_repository.crear_usuario,name="eliminar_usuario"),
       path("actualizar_usuario",user_repository.crear_usuario,name="actualizar_usuario"),
       path("obtener_usuarios",user_repository.crear_usuario,name="crear_usuario")

]