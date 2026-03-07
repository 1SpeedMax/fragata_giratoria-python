# platillos/urls.py
from django.urls import path
from . import views

app_name = 'platillos'

urlpatterns = [
    path('', views.platillos_list, name='lista'),
    # Agrega más URLs según necesites
]