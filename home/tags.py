from django import template

from home.models import Like

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