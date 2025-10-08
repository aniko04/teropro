from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from django.contrib.auth.models import User

from .models import *

# Create your views here.


def home(request):
    categories = Category.objects.all()
    products = Product.objects.filter(top=True)
    context = {
        'categories': categories,
        'products': products,
    }
    #products = Product.objects.all()[:8]  # Faqat 8 ta mahs
    return render(request, 'index.html', context)

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

def login_view(request):
    context = {}
    if request.method == 'POST':
        post = request.POST
        username = post.get('username')
        password = post.get('password')
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            print("User authenticated")
            login(request, user)
            return redirect('home')
        else:
            context['error'] = "Invalid username or password."
            return render(request, 'login.html', context)
    return render(request, 'login.html') 



def register(request):
    context = {}
    if request.method == 'POST':
       post = request.POST
       username = post.get('username')
       email = post.get('email')
       password = post.get('password')
       confirm_password = post.get('confirm_password')

       if password != confirm_password:
            context['error'] = "Passwords do not match."
            context['username'] = username
            context['email'] = email
            return render(request, 'register.html', context)
       if User.objects.filter(username=username).exists():
            context['error'] = "Username already taken."
            context['email'] = email
            context['username'] = username
            return render(request, 'register.html', context)
       if User.objects.filter(email=email).exists():
            context['error'] = "Email already taken."
            context['email'] = email
            context['username'] = username
            return render(request, 'register.html', context)
       else: 
            user = User.objects.create_user(username=username, email=email)
            user.set_password(password)
            user.save()
            context['success'] = "Account created successfully. Please log in."
            return render(request, 'register.html', context)
    return render(request, 'register.html')


def logout_view(request):
    logout(request)
    return redirect('home')

def like_product(request, product_id):
    url = request.GET.get('path', 'product')
    if not request.user.is_authenticated:
        return redirect('login')

    product = get_object_or_404(Product, id=product_id)
    like, created = Like.objects.get_or_create(user=request.user, product=product)

    if not created:
        like.delete()

    return redirect(url)

def likes(request):
    if request.user.is_authenticated:
        liked_products = Product.objects.filter(like__user=request.user)
        context = {
            'liked_products': liked_products
        }
        return render(request, 'likes.html', context)
    else:
        return redirect('login')
    
