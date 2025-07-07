
from django.urls import path
from .api import auth
from . import views

urlpatterns = [
     path('',views.inicio_sesion),
       path('especialista_principal_page', views.especialista_principal_page, name='especialista_principal_page'),
       path('iniciar_sesion', auth.api_login, name='iniciar_sesion'),
]