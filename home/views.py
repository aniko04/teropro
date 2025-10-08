from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator

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
    category_id = request.GET.get('category')
    price_range = request.GET.get('price')
    sort_option = request.GET.get('sort')
    categories = Category.objects.all()
    products = Product.objects.all()
    selected_category = None
    # Kategoriya filter
    if category_id:
        products = products.filter(category_id=category_id)
        selected_category = get_object_or_404(Category, id=category_id)
    # Narx filter
    if price_range:
        if price_range == "0-100":
            products = products.filter(current_price__lte=100)
        elif price_range == "100-300":
            products = products.filter(current_price__gte=100, current_price__lte=300)
        elif price_range == "300-500":
            products = products.filter(current_price__gte=300, current_price__lte=500)
        elif price_range == "500+":
            products = products.filter(current_price__gte=500)
    # Saralash
    if sort_option:
        if sort_option == "price-low":
            products = products.order_by("current_price")
        elif sort_option == "price-high":
            products = products.order_by("-current_price")
        elif sort_option == "name":
            products = products.order_by("name")
        elif sort_option == "newest":
            products = products.order_by("-id")
     # --- 4️ Pagination (har bir sahifada 5 ta mahsulot) ---
    paginator = Paginator(products, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'categories': categories,
        'products': page_obj,  
        'page_obj': page_obj,
        'selected_category': selected_category,
        'selected_price': price_range,
        'selected_sort': sort_option,
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
