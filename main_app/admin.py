from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Perfil, Procedimiento, Consulta

@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'activo', 'rol')
    list_filter = ('activo', 'rol')
    search_fields = ('nombre',)

@admin.register(Usuario)
class UsuarioPersonalizadoAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('perfil',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información Adicional', {'fields': ('perfil',)}),
    )
    list_display = UserAdmin.list_display + ('perfil',)
    list_filter = UserAdmin.list_filter + ('perfil',)
    search_fields = UserAdmin.search_fields + ('perfil__nombre',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('perfil')

@admin.register(Procedimiento)
class ProcedimientoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'perfil')
    list_filter = ('perfil',)
    search_fields = ('nombre', 'perfil__nombre')

@admin.register(Consulta)
class ConsultaAdmin(admin.ModelAdmin):
    list_display = ('perfil', 'emisor', 'receptor')
    list_filter = ('perfil', 'emisor', 'receptor')
    search_fields = ('perfil__nombre', 'emisor__username', 'receptor__username')