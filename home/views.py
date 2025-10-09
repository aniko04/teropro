from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.contrib import messages

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
    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user)
        
        # Jami narx va chegirma hisobi
        subtotal = sum(item.get_total_price() for item in cart_items)
        total_discount = sum(item.get_discount_amount() for item in cart_items)
        shipping = 15
        final_total = subtotal - total_discount + shipping
        
        context = {
            'cart_items': cart_items,
            'subtotal': subtotal,
            'total_discount': total_discount,
            'shipping': shipping,
            'final_total': final_total,
        }
        return render(request, 'cart.html', context)
    else:
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
    
    # Baholar ma'lumotlari
    all_reviews = ProductView.objects.filter(product=product).order_by('-createddate')
    reviews_with_rating = ProductView.objects.filter(product=product, rate__gt=0)
    
    # O'rtacha rating hisoblash (faqat 0 dan yuqori ratinglar)
    if reviews_with_rating.exists():
        total_rating = sum(review.rate for review in reviews_with_rating)
        average_rating = round(total_rating / reviews_with_rating.count(), 1)
    else:
        average_rating = 0
    
    # Har bir rating miqdorini hisoblash
    rating_counts = {
        5: reviews_with_rating.filter(rate=5).count(),
        4: reviews_with_rating.filter(rate=4).count(),
        3: reviews_with_rating.filter(rate=3).count(),
        2: reviews_with_rating.filter(rate=2).count(),
        1: reviews_with_rating.filter(rate=1).count(),
    }
    
    total_reviews_count = reviews_with_rating.count()
    
    # Rating foizlarini hisoblash
    rating_percentages = {}
    for rating, count in rating_counts.items():
        if total_reviews_count > 0:
            rating_percentages[rating] = round((count / total_reviews_count) * 100)
        else:
            rating_percentages[rating] = 0
    
    context = {
        'product': product,
        'discount': discount,
        'all_reviews': all_reviews,
        'reviews_with_rating': reviews_with_rating,
        'average_rating': average_rating,
        'total_reviews_count': total_reviews_count,
        'rating_counts': rating_counts,
        'rating_percentages': rating_percentages,
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
    from urllib.parse import unquote
    
    # Filter'lar bilan to'liq URL'ni olish
    url = request.GET.get('path', 'product')
    if url != 'product':
        url = unquote(url)  # URL decode qilish
        
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

def add_to_cart(request, product_id):
    from urllib.parse import unquote
    
    # Filter'lar bilan to'liq URL'ni olish
    url = request.GET.get('path', 'product')
    if url != 'product':
        url = unquote(url)  # URL decode qilish
    
    if not request.user.is_authenticated:
        return redirect('login')

    product = get_object_or_404(Product, id=product_id)
    
    # Mahsulot cartda bor yoki yo'qligini tekshirish
    cart_item, created = Cart.objects.get_or_create(user=request.user, product=product)
    
    if not created:
        # Agar mahsulot allaqachon cartda bo'lsa, miqdorni oshirish
        cart_item.quantity += 1
        cart_item.save()
        messages.success(request, f"'{product.name}' mahsuloti miqdori oshirildi! Jami: {cart_item.quantity} ta")
    else:
        # Yangi mahsulot qo'shish
        messages.success(request, f"'{product.name}' mahsuloti cartga qo'shildi!")

    return redirect(url)

def remove_from_cart(request, cart_id):
    if not request.user.is_authenticated:
        return redirect('login')
    
    cart_item = get_object_or_404(Cart, id=cart_id, user=request.user)
    cart_item.delete()
    return redirect('cart')

def update_cart_quantity(request, cart_id):
    if not request.user.is_authenticated:
        return redirect('login')
    
    if request.method == 'POST':
        quantity = int(request.POST.get('quantity', 1))
        cart_item = get_object_or_404(Cart, id=cart_id, user=request.user)
        
        if quantity > 0:
            cart_item.quantity = quantity
            cart_item.save()
        else:
            cart_item.delete()
    
    return redirect('cart')

def increase_cart_quantity(request, cart_id):
    if not request.user.is_authenticated:
        return redirect('login')
    
    cart_item = get_object_or_404(Cart, id=cart_id, user=request.user)
    cart_item.quantity += 1
    cart_item.save()
    return redirect('cart')

def decrease_cart_quantity(request, cart_id):
    if not request.user.is_authenticated:
        return redirect('login')
    
    cart_item = get_object_or_404(Cart, id=cart_id, user=request.user)
    
    if cart_item.quantity > 1:
        cart_item.quantity -= 1
        cart_item.save()
    else:
        # Agar miqdor 1 dan kam bo'lsa, mahsulotni o'chirish
        cart_item.delete()
        messages.info(request, f"'{cart_item.product.name}' mahsuloti cartdan o'chirildi.")
    
    return redirect('cart')

def clear_cart(request):
    if not request.user.is_authenticated:
        return redirect('login')
    
    # Foydalanuvchining barcha cart itemlarini o'chirish
    cart_items = Cart.objects.filter(user=request.user)
    items_count = cart_items.count()
    
    if items_count > 0:
        cart_items.delete()
        messages.success(request, f"Barcha mahsulotlar ({items_count} ta) cartdan o'chirildi!")
    else:
        messages.info(request, "Cart allaqachon bo'sh.")
    
    return redirect('cart')

def rate_product(request, product_id):
    """Mahsulotga rating berish funksiyasi"""
    print(f"Rating function called with product_id: {product_id}")
    print(f"Request method: {request.method}")
    print(f"User authenticated: {request.user.is_authenticated}")
    
    product = get_object_or_404(Product, id=product_id)
    
    if not request.user.is_authenticated:
        messages.error(request, "Rating berish uchun ro'yxatdan o'ting!")
        return redirect('product_details', id=product_id)
    
    if request.method == 'POST':
        print(f"POST data: {request.POST}")
        print(f"Rating value: {request.POST.get('rating')}")
        print(f"Comment: {request.POST.get('comment')}")
        rating = request.POST.get('rating')
        comment = request.POST.get('comment', '')
        
        # Rating ni tekshirish
        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                messages.error(request, "Rating 1 dan 5 gacha bo'lishi kerak!")
                return redirect('product_details', id=product_id)
        except (ValueError, TypeError):
            messages.error(request, "Noto'g'ri rating qiymati!")
            return redirect('product_details', id=product_id)
        
        # Foydalanuvchi avval rating berganmi tekshirish
        existing_rating = ProductView.objects.filter(user=request.user, product=product).first()
        
        if existing_rating:
            # Mavjud ratingni yangilash
            existing_rating.rate = rating
            existing_rating.comment = comment
            existing_rating.save()
            messages.success(request, f"Ratingingiz yangilandi: {rating} yulduz!")
        else:
            # Yangi rating yaratish
            ProductView.objects.create(
                user=request.user,
                product=product,
                rate=rating,
                comment=comment
            )
            messages.success(request, f"Rating berildi: {rating} yulduz!")
        
        # Mahsulotning o'rtacha ratingini yangilash
        all_ratings = ProductView.objects.filter(product=product, rate__gt=0)
        if all_ratings.exists():
            avg_rating = sum(r.rate for r in all_ratings) / all_ratings.count()
            product.grade = round(avg_rating)
            product.save()
    
    return redirect('product_details', id=product_id)

