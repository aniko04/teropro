from django.urls import path
from .views import *


urlpatterns = [
    # Example:
    path('', home, name='home'),
    path('about', about, name='about'),
]