
from django.urls import path
from .api import auth,user_repository,procedimiento_repository,consultas_repository
from . import views

urlpatterns = [
       path('',views.inicio_sesion,name='inicio_sesion'),
       path('guardia_page', views.guardia_page, name='guardia_page'),
       path('guardia_consultas_page', views.guardia_consultas_page, name='guardia_consultas_page'),
       path('especialista_page', views.especialista_page, name='especialista_page'),
       path('especialista_consultas_page', views.especialista_consultas_page, name='especialista_consultas_page'),
       path('especialista_principal_page', views.especialista_principal_page, name='especialista_principal_page'),
       path('especialista_principal_rotaciones_page', views.especialista_principal_rotaciones_page, name='especialista_principal_rotaciones_page'),
       path('iniciar_sesion', auth.api_login, name='iniciar_sesion'),
       path("crear_usuario",user_repository.crear_usuario,name="crear_usuario"),
       path("eliminar_usuario",user_repository.eliminar_usuario,name="eliminar_usuario"),
       path("actualizar_usuario",user_repository.actualizar_usuario,name="actualizar_usuario"),
       path("obtener_usuarios",user_repository.obtener_usuarios,name="crear_usuario"),
       path("crear_procedimiento",procedimiento_repository.crear_procedimiento,name="crear_procedimiento"),
       path("eliminar_procedimiento",procedimiento_repository.eliminar_procedimiento,name="eliminar_procedimiento"),
       path("actualizar_procedimiento",procedimiento_repository.actualizar_procedimiento,name="actualizar_procedimiento"),
       path("obtener_procedimientos",procedimiento_repository.obtener_procedimientos,name="obtener_procedimientos"),
       path("obtener_procedimientos_por_especialista",procedimiento_repository.obtener_procedimientos_por_especialista,name="obtener_procedimientos_por_especialista"),
       path("crear_consulta",consultas_repository.crear_consulta,name="crear_consulta"),
       path("obtener_consultas_por_emisor",consultas_repository.obtener_consultas_por_emisor,name="obtener_consultas_por_emisor"),
       path("obtener_consultas_por_receptor",consultas_repository.obtener_consultas_por_receptor,name="obtener_consultas_por_receptor"),
       path("actualizar_consulta",consultas_repository.actualizar_consulta,name="actualizar_consulta"),
       path("eliminar_consulta",consultas_repository.eliminar_consulta,name="eliminar_consulta"),



]