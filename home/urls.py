from django.urls import path
from .views import *


urlpatterns = [
    path('', home, name='home'),
    path('about', about, name='about'),
    path('cart', cart, name='cart'),
    path('contact', contact, name='contact'),
    path('product', product, name='product'),
    path('product_details/<int:id>/', product_details, name='product_details'),
    path('login', login_view, name='login'),
    path('register', register, name='register'),
    path('logout', logout_view, name='logout'),
    path('like/<int:product_id>/', like_product, name='like_product'),
    path('likes/', likes, name='likes'),
    
]