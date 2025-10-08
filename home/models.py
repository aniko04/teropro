
from django.db import models
from ckeditor.fields import RichTextField

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