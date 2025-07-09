from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Perfil, Procedimiento, Consulta

@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('rol', 'username')
    list_filter = ('rol',)
    search_fields = ('rol', 'username')

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
    search_fields = UserAdmin.search_fields + ('perfil__rol',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('perfil')

@admin.register(Procedimiento)
class ProcedimientoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'perfil', 'archivo', 'creado_en')
    list_filter = ('perfil', 'creado_en')
    search_fields = ('nombre', 'descripcion', 'perfil__rol')
    readonly_fields = ('creado_en',)
    ordering = ('-creado_en',)

@admin.register(Consulta)
class ConsultaAdmin(admin.ModelAdmin):
    list_display = ('emisor', 'receptor', 'contenido_truncado', 'procedimiento_id', 'creado_en')
    list_filter = ('emisor', 'receptor', 'creado_en')
    search_fields = ('emisor', 'receptor', 'contenido')
    readonly_fields = ('creado_en',)
    ordering = ('-creado_en',)
    
    def contenido_truncado(self, obj):
        return obj.contenido[:50] + '...' if len(obj.contenido) > 50 else obj.contenido
    contenido_truncado.short_description = 'Contenido'