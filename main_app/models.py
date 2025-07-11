from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

ROL_CHOICES = [
    ('guardia', 'Guardia'),
    ('especialista', 'Especialista'),
    ('especialista_principal', 'Especialista Principal'),
]

class Perfil(models.Model):
    rol = models.CharField(
        max_length=22,
        choices=ROL_CHOICES,
        default='guardia'
    )
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)

    def __str__(self):
        return self.rol

class Usuario(AbstractUser):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True,primary_key=True)
    perfil = models.OneToOneField(
        Perfil,
        on_delete=models.CASCADE,
        related_name='usuario',
        null=True,
        blank=True
    )

    def __str__(self):
        return self.username

class Procedimiento(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    archivo = models.FileField(upload_to='procedimientos/', blank=True, null=True)
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='procedimientos')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre
    
   

class Consulta(models.Model):
   
    emisor = models.CharField(blank=False)
    receptor = models.CharField(blank=False)
    contenido = models.TextField(blank=False)
    respuesta = models.TextField(blank=True, null=True)
    procedimiento_id = models.IntegerField(blank=False, null=False)
    procedimiento_nombre = models.CharField(blank=False, null=False)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('pendiente', 'Pendiente'),
            ('respondida', 'Respondida'),
        ],
        default='pendiente'
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consulta de {self.emisor} a {self.receptor}"

class Rotaciones(models.Model):
    username = models.CharField(max_length=150)
    fecha_entrada = models.DateField()
    entrada = models.CharField(max_length=10)
    fecha_salida = models.DateField()
    salida = models.CharField(max_length=10)  

    def __str__(self):
        return f"{self.username} - {self.fecha_entrada} {self.entrada} a {self.fecha_salida} {self.salida}"