
from django.urls import path
from .api import auth,user_repository,procedimiento_repository
from . import views

urlpatterns = [
       path('',views.inicio_sesion,name='inicio_sesion'),
       path('especialista_page', views.especialista_page, name='especialista_page'),
       path('especialista_principal_page', views.especialista_principal_page, name='especialista_principal_page'),
       path('iniciar_sesion', auth.api_login, name='iniciar_sesion'),
       path("crear_usuario",user_repository.crear_usuario,name="crear_usuario"),
       path("eliminar_usuario",user_repository.eliminar_usuario,name="eliminar_usuario"),
       path("actualizar_usuario",user_repository.actualizar_usuario,name="actualizar_usuario"),
       path("obtener_usuarios",user_repository.obtener_usuarios,name="crear_usuario"),
       path("crear_procedimiento",procedimiento_repository.crear_procedimiento,name="crear_procedimiento"),
       path("eliminar_procedimiento",procedimiento_repository.eliminar_procedimiento,name="eliminar_procedimiento"),
       path("actualizar_procedimiento",procedimiento_repository.actualizar_procedimiento,name="actualizar_procedimiento"),
       path("obtener_procedimientos",procedimiento_repository.obtener_procedimientos,name="obtener_procedimientos"),


]