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

    def __str__(self):
        return self.nombre

class Consulta(models.Model):
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='consultas')
    emisor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='consultas_enviadas')
    receptor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='consultas_recibidas')

    def __str__(self):
        return f"Consulta de {self.emisor} a {self.receptor} para perfil {self.perfil}"
