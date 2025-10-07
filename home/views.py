from django.shortcuts import render

# Create your views here.
def admin(request):
    return render(request, 'admin.html')

def home(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def cart(request):
    return render(request, 'cart.html')

def contact(request):
    return render(request, 'contact.html')

def product(request):
    return render(request, 'products.html')

def product_details(request):
    return render(request, 'product_details.html')
