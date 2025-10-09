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
    path('add_to_cart/<int:product_id>/', add_to_cart, name='add_to_cart'),
    path('remove_from_cart/<int:cart_id>/', remove_from_cart, name='remove_from_cart'),
    path('update_cart_quantity/<int:cart_id>/', update_cart_quantity, name='update_cart_quantity'),
    path('increase_cart/<int:cart_id>/', increase_cart_quantity, name='increase_cart_quantity'),
    path('decrease_cart/<int:cart_id>/', decrease_cart_quantity, name='decrease_cart_quantity'),
    path('clear_cart/', clear_cart, name='clear_cart'),
    path('rate_product/<int:product_id>/', rate_product, name='rate_product'),
    
]