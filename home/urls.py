from django.urls import path
from .views import *


urlpatterns = [
    path('', home, name='home'),
    path('about', about, name='about'),
    path('cart', cart, name='cart'),
    path('contact', contact, name='contact'),
    path('product', product, name='product'),
    path('product_details/<int:id>/', product_details, name='product_details'),
    
]