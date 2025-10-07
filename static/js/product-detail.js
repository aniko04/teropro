// Product Detail Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Image gallery functionality
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-product-img');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));

            // Add active class to clicked thumbnail
            this.classList.add('active');

            // Change main image
            const newImage = this.querySelector('.image-placeholder');
            if (newImage && mainImage) {
                mainImage.className = newImage.className.replace('image-placeholder', 'main-product-img');
            }
        });
    });

    // Product options functionality
    const colorOptions = document.querySelectorAll('.color-option');
    const sizeOptions = document.querySelectorAll('.size-option');

    colorOptions.forEach(option => {
        option.addEventListener('click', function () {
            colorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    sizeOptions.forEach(option => {
        option.addEventListener('click', function () {
            sizeOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Quantity control
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');

    if (minusBtn && quantityInput) {
        minusBtn.addEventListener('click', function () {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }

    if (plusBtn && quantityInput) {
        plusBtn.addEventListener('click', function () {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }

    // Add to cart functionality
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            const productName = document.querySelector('.product-title').textContent;
            const quantity = quantityInput ? quantityInput.value : 1;
            const selectedColor = document.querySelector('.color-option.active')?.dataset.color || 'default';
            const selectedSize = document.querySelector('.size-option.active')?.textContent || 'M';

            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const currentCount = parseInt(cartCount.textContent) || 0;
                cartCount.textContent = currentCount + parseInt(quantity);
            }

            // Show success message
            showNotification(`${productName} (${quantity} ta, ${selectedColor} rang, ${selectedSize} o'lcham) savatga qo'shildi!`);

            // Animate button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Wishlist functionality
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');

            const productName = document.querySelector('.product-title').textContent;
            const action = icon.classList.contains('fas') ? 'qo\'shildi' : 'olib tashlandi';
            showNotification(`${productName} sevimlilar ro'yxatiga ${action}`);
        });
    }

    // Share functionality
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function () {
            if (navigator.share) {
                navigator.share({
                    title: document.querySelector('.product-title').textContent,
                    text: document.querySelector('.product-description p').textContent,
                    url: window.location.href
                });
            } else {
                // Fallback for browsers without Web Share API
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('Mahsulot havolasi nusxalandi!');
                });
            }
        });
    }

    // Tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    console.log('Tab buttons found:', tabButtons.length);
    console.log('Tab panes found:', tabPanes.length);

    tabButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const targetTab = this.dataset.tab;

            console.log('Tab clicked:', targetTab);

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
                console.log('Tab activated:', targetTab);
            } else {
                console.error('Tab pane not found:', targetTab);
            }
        });
    });

    // Load more reviews functionality
    const loadMoreBtn = document.querySelector('.load-more-reviews');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            // Simulate loading more reviews
            this.textContent = 'Yuklanmoqda...';
            this.disabled = true;

            setTimeout(() => {
                showNotification('Barcha baholar ko\'rsatildi!');
                this.style.display = 'none';
            }, 1500);
        });
    }

    // Size guide modal (placeholder)
    const sizeGuideLink = document.querySelector('.size-guide');
    if (sizeGuideLink) {
        sizeGuideLink.addEventListener('click', function (e) {
            e.preventDefault();
            showNotification('O\'lchamlar jadvali tez orada mavjud bo\'ladi!');
        });
    }

    // Product features animation
    function animateFeatures() {
        const features = document.querySelectorAll('.product-features .feature');

        features.forEach((feature, index) => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateX(-20px)';
            feature.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;

            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateX(0)';
            }, 500 + (index * 100));
        });
    }

    // Initialize features animation
    animateFeatures();

    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // Load product data based on ID (this would normally come from a database)
        loadProductData(productId);
    }
});

// Function to load product data (mock implementation)
function loadProductData(productId) {
    const products = {
        '1': {
            name: 'Elegant Dress',
            category: 'Ayollar kiyimi',
            price: '$259',
            oldPrice: '$329'
        },
        '2': {
            name: 'Classic Suit',
            category: 'Erkaklar kiyimi',
            price: '$499',
            oldPrice: null
        },
        '3': {
            name: 'Casual Wear',
            category: 'Ayollar kiyimi',
            price: '$149',
            oldPrice: '$199'
        }
        // Add more products as needed
    };

    const product = products[productId];
    if (product) {
        // Update product details
        const titleElement = document.querySelector('.product-title');
        const breadcrumbName = document.getElementById('productName');

        if (titleElement) titleElement.textContent = product.name;
        if (breadcrumbName) breadcrumbName.textContent = product.name;

        // Update page title
        document.title = `${product.name} - Elegant Fashion`;
    }
}

// Image zoom functionality
document.addEventListener('DOMContentLoaded', function () {
    const mainImage = document.querySelector('.main-image');

    if (mainImage) {
        mainImage.addEventListener('mouseenter', function () {
            this.style.cursor = 'zoom-in';
        });

        mainImage.addEventListener('click', function () {
            // Create zoom modal (simplified version)
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: zoom-out;
            `;

            const zoomedImage = this.querySelector('.main-product-img').cloneNode(true);
            zoomedImage.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 15px;
            `;

            modal.appendChild(zoomedImage);
            document.body.appendChild(modal);

            modal.addEventListener('click', function () {
                document.body.removeChild(modal);
            });
        });
    }
});