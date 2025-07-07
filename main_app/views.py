from django.shortcuts import render


def Home(request):
    nombre = request.user.username

    return render(request,"home.html",{
     "nombre":nombre
    })
