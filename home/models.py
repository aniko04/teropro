
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
    content = RichTextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)

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
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Sizes(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name