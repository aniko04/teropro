from django.shortcuts import render, get_object_or_404
from .models import *

# Create your views here.


def home(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def cart(request):
    return render(request, 'cart.html')

def contact(request):
    return render(request, 'contact.html')

def product(request):
    products = Product.objects.all()
    context = {
        'products': products
    }
    return render(request, 'products.html', context)

def product_details(request, id):
    product = get_object_or_404(Product, id=id)
    discount = (product.current_price / product.old_price * 100)-100
    context = {
        'product': product,
        'discount': discount
    }
    return render(request, 'product-detail.html', context)
