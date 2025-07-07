
from django.urls import path, include
from .api import get
from . import views

urlpatterns = [
     path('',views.Home),
       path('api/perfiles', get.api_perfiles_list, name='api_perfiles_list'),
]