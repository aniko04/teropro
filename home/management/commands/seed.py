from django.core.management.base import BaseCommand
from faker import Faker
from home.models import (
    Product, Category, Images, Status,
    Colors, Sizes, Materials, Producer
)
import random, os, uuid
from PIL import Image
from django.conf import settings

fake = Faker()

class Command(BaseCommand):
    help = "Generate fake product data with real image files"

    def add_arguments(self, parser):
        parser.add_argument('--products', type=int, default=50, help='Number of fake products to create')

    def handle(self, *args, **options):
        num_products = options['products']

        # 🧱 1️⃣ Reference ma'lumotlarni yaratish
        self.stdout.write("Checking reference data...")

        categories = list(Category.objects.all()) or [
            Category.objects.create(name=fake.word()) for _ in range(5)
        ]

        statuses = list(Status.objects.all()) or [
            Status.objects.create(name=random.choice(['available', 'out of stock', 'pre-order'])) for _ in range(3)
        ]

        colors = list(Colors.objects.all()) or [
            Colors.objects.create(name=fake.color_name(), code=fake.hex_color()) for _ in range(8)
        ]

        sizes = list(Sizes.objects.all()) or [
            Sizes.objects.create(name=s) for s in ['S', 'M', 'L', 'XL', 'XXL']
        ]

        materials = list(Materials.objects.all()) or [
            Materials.objects.create(name=random.choice(['cotton', 'leather', 'plastic', 'metal'])) for _ in range(4)
        ]

        producers = list(Producer.objects.all()) or [
            Producer.objects.create(name=fake.company()) for _ in range(5)
        ]

        # 🖼 2️⃣ Rasm yaratish funksiyasi
        def generate_fake_image(folder='fake_images'):
            img_dir = os.path.join(settings.MEDIA_ROOT, folder)
            os.makedirs(img_dir, exist_ok=True)

            filename = f"{uuid.uuid4()}.jpg"
            filepath = os.path.join(img_dir, filename)

            # oddiy rasm (rangli kvadrat)
            image = Image.new('RGB', (600, 600),
                              color=(random.randint(0,255), random.randint(0,255), random.randint(0,255)))
            image.save(filepath, 'JPEG')

            return f"{folder}/{filename}"

        # 📷 3️⃣ Images obyektlarini yaratish
        self.stdout.write("Creating image objects...")
        images = []
        for _ in range(num_products * 2):
            img_path = generate_fake_image()
            img = Images.objects.create(image=img_path)
            images.append(img)

        # 🛍 4️⃣ Productlar yaratish
        self.stdout.write(f"Creating {num_products} fake products...")
        for _ in range(num_products):
            main_image_path = generate_fake_image('main_images')
            product = Product.objects.create(
                name=fake.word().capitalize(),
                category=random.choice(categories),
                description=fake.paragraph(nb_sentences=5),
                current_price=random.randint(10000, 500000),
                old_price=random.randint(10000, 500000),
                main_image=main_image_path,
                grade=random.randint(0, 5),
                status=random.choice(statuses),
                count=random.randint(0, 100),
                materials=random.choice(materials),
                lengths=random.randint(50, 300),
                producer=random.choice(producers),
                guarantee=random.randint(6, 36),
                content=fake.paragraph(nb_sentences=3)
            )

            product.images.add(*random.sample(images, random.randint(1, 3)))
            product.colors.add(*random.sample(colors, random.randint(1, 3)))
            product.sizes.add(*random.sample(sizes, random.randint(1, 3)))

        self.stdout.write(self.style.SUCCESS(f"✅ Successfully created {num_products} fake products with images!"))
