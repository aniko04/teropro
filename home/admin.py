from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Images)
admin.site.register(Status)
admin.site.register(Colors)
admin.site.register(Sizes)
admin.site.register(Materials)
admin.site.register(Producer)
admin.site.register(Like)
admin.site.register(Cart)
admin.site.register(ProductView)