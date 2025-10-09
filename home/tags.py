from django import template
from django.db.models import Avg

from home import models
from home.models import Category, Like, Cart

register = template.Library()

@register.filter
def intspace(value):
    """
    Sonlarni probel bilan ajratadi
    """
    try:
        # Stringga o'girish
        orig = str(int(value))
        
        # Manfiy sonni tekshirish
        if orig.startswith('-'):
            negative = '-'
            orig = orig[1:]
        else:
            negative = ''
        
        # O'ngdan chapga formatlash
        result = ''
        for i, digit in enumerate(reversed(orig)):
            if i > 0 and i % 3 == 0:
                result = ' ' + result
            result = digit + result
        
        return negative + result
    except (ValueError, TypeError):
        return value
    

@register.filter
def in_likes(value,user):
    """
    Foydalanuvchi yoqtirgan mahsulotlarni tekshiradi
    """
    if user.is_authenticated:
        #value.like_set.filter(user=user).exists()
        is_like = Like.objects.filter(user=user, product=value).exists()
        return is_like
    return False

@register.filter
def likes_count(user):
    """
    Foydalanuvchi yoqtirgan mahsulotlar sonini qaytaradi
    """
    if user.is_authenticated:
        return user.like_set.count()
    return 0
# Mahsulotni necha kishi cartga qo'shganini sanaydi
@register.filter
def product_cart_count(product):
    """
    Berilgan mahsulotni necha kishi cartga qo'shganini qaytaradi
    """
    return Cart.objects.filter(product=product).count()

# Mahsulotni necha kishi yoqtirganini sanaydi
@register.filter
def product_likes_count(product):
    """
    Berilgan mahsulotni necha kishi yoqtirganini qaytaradi
    """
    return Like.objects.filter(product=product).count()

@register.filter
def cart_items_count(value):
    """
    Foydalanuvchi savatidagi mahsulotlar sonini qaytaradi
    """
    if value.user.is_authenticated:
        return value.user.cart_set.count()
    return 0

@register.filter
def categories(user):
    return Category.objects.all()

@register.filter
def in_cart(value, user):
    """
    Foydalanuvchi cartga qo'shgan mahsulotlarni tekshiradi
    """
    if user.is_authenticated:
        is_in_cart = Cart.objects.filter(user=user, product=value).exists()
        return is_in_cart
    return False

@register.filter
def cart_count(user):
    """
    Foydalanuvchi cartdagi mahsulotlar sonini qaytaradi
    """
    if user.is_authenticated:
        return user.cart_set.count()
    return 0

@register.filter
def generate_star_rating(rating):
    """
    Ratingga asoslangan yulduzchalar generatsiya qiladi (1-5)
    """
    if rating is None or rating == 0:
        rating = 0
    
    # Rating 1-5 oralig'ida bo'lishi kerak
    rating = max(1, min(5, int(rating)))
    
    full_stars = "★" * rating
    empty_stars = "☆" * (5 - rating)
    
    return full_stars + empty_stars

@register.filter  
def star_rating_html(rating):
    """
    Rating uchun HTML yulduzchalar yaratadi
    """
    if rating is None or rating == 0:
        rating = 0
    
    rating = max(1, min(5, int(rating)))
    
    html = ""
    for i in range(1, 6):
        if i <= rating:
            html += '<i class="fas fa-star text-warning"></i>'
        else:
            html += '<i class="far fa-star text-muted"></i>'
    
    return html

@register.filter
def rating_choices():
    """
    Rating tanlov variantlarini qaytaradi (1-5 yulduz)
    """
    return [
        (1, '1 Yulduz'),
        (2, '2 Yulduz'),
        (3, '3 Yulduz'),
        (4, '4 Yulduz'),
        (5, '5 Yulduz'),
    ]

@register.filter
def user_rating(product, user):
    """
    Foydalanuvchining berilgan mahsulotga berilgan ratingini qaytaradi
    """
    if user.is_authenticated:
        from .models import ProductView
        try:
            user_review = ProductView.objects.get(user=user, product=product)
            return user_review.rate if user_review.rate > 0 else 0
        except ProductView.DoesNotExist:
            return 0
    return 0

@register.filter
def user_comment(product, user):
    """
    Foydalanuvchining berilgan mahsulotga yozgan kommentini qaytaradi
    """
    if user.is_authenticated:
        from .models import ProductView
        try:
            user_review = ProductView.objects.get(user=user, product=product)
            return user_review.comment or ""
        except ProductView.DoesNotExist:
            return ""
    return ""

@register.filter
def has_reviews(product):
    """
    Mahsulotda baholar borligini tekshiradi
    """
    from .models import ProductView
    return ProductView.objects.filter(product=product).exists()

@register.filter
def reviews_count(product):
    """
    Mahsulotdagi jami baholar sonini qaytaradi
    """
    from .models import ProductView
    return ProductView.objects.filter(product=product).count()

@register.filter
def average_rating(product):
    """
    Mahsulotning o'rtacha reytingini hisoblaydi
    """
    from .models import ProductView
    reviews = ProductView.objects.filter(product=product)
    if reviews.exists():
        avg = reviews.aggregate(Avg('rate'))['rate__avg']
        return round(avg, 2)  # O'rtacha qiymatni 2 xonagacha yaxlitlash
    return 0