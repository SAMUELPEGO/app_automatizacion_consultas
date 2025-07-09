from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required


def inicio_sesion(request):
    return render(request,"inicio_sesion.html")

@login_required
def especialista_principal_page(request):
     if request.user.perfil.rol == 'especialista_principal':
        return render(request, "especialista_principal_page.html")
     else:
        return redirect('inicio_sesion')

@login_required
def especialista_page(request):
     if request.user.perfil.rol == 'especialista':
        return render(request,"especialista_page.html")
     else:
        return redirect('inicio_sesion')
     
@login_required
def especialista_consultas_page(request):
     if request.user.perfil.rol == 'especialista':
        return render(request,"especialista_consultas_page.html")
     else:
        return redirect('inicio_sesion')
     
@login_required
def guardia_page(request):
     if request.user.perfil.rol == 'guardia':
        return render(request,"guardia_page.html")
     else:
        return redirect('inicio_sesion')
     
@login_required
def guardia_consultas_page(request):
     if request.user.perfil.rol == 'guardia':
        return render(request,"guardia_consultas_page.html")
     else:
        return redirect('inicio_sesion')