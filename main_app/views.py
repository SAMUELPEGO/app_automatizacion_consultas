from django.shortcuts import render


def inicio_sesion(request):

    return render(request,"inicio_sesion.html")


def especialista_principal_page(request):
    return render(request,"especialista_principal_page.html")