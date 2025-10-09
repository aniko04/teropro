
from django.db import models
from ckeditor.fields import RichTextField
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    description = models.TextField()
    current_price = models.IntegerField( blank=True, null=True)
    old_price = models.IntegerField( blank=True, null=True)
    main_image = models.ImageField(upload_to='')
    images = models.ManyToManyField('Images')
    grade = models.IntegerField(default=0)
    status = models.ForeignKey('Status', on_delete=models.CASCADE)
    count = models.IntegerField(default=0)
    colors = models.ManyToManyField('Colors')
    sizes = models.ManyToManyField('Sizes')
    materials = models.ForeignKey('Materials', on_delete=models.CASCADE, null=True)
    lengths = models.IntegerField(null=True, blank=True)
    producer = models.ForeignKey('Producer', on_delete=models.CASCADE, null=True)
    guarantee = models.IntegerField(null=True, blank=True)
    content = RichTextField(blank=True, null=True)
    top = models.BooleanField(default=False)
    

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='', null=True, blank=True)

    def __str__(self):
        return self.name

class Images(models.Model):
    image = models.ImageField(upload_to='')

    def __str__(self):
        return self.image.url
    
class Status(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
class Colors(models.Model):
    name = models.CharField(max_length=50,null=True)
    code = models.CharField(max_length=7, null=True)

    def __str__(self):
        return self.name

class Sizes(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Materials(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Producer(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Like(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

class Cart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
    
    def get_total_price(self):
        return self.product.current_price * self.quantity
    
    def get_discount_amount(self):
        """Chegirma miqdorini hisoblab beradi"""
        if self.product.old_price and self.product.old_price > 0:
            discount_per_item = self.product.old_price - self.product.current_price
            return discount_per_item * self.quantity
        return 0
    
    def get_discount_percent(self):
        """Chegirma foizini hisoblab beradi"""
        if self.product.old_price and self.product.old_price > 0:
            discount_percent = (self.product.current_price / self.product.old_price) * 100 - 100
            return abs(discount_percent)  # Musbat qiymat qaytarish
        return 0
    
class ProductView(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    comment = models.TextField(null=True, blank=True)
    createddate = models.DateTimeField(auto_now_add=True)
    rate = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=0,
        help_text="1 dan 5 gacha yulduz bering"
    )
    def __str__(self):
        return self.user.username
