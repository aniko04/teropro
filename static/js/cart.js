// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Quantity controls
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const isPlus = this.classList.contains('plus');
            const isMinus = this.classList.contains('minus');
            const productId = this.dataset.id;
            const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            
            if (input) {
                let currentValue = parseInt(input.value);
                
                if (isPlus) {
                    input.value = currentValue + 1;
                } else if (isMinus && currentValue > 1) {
                    input.value = currentValue - 1;
                }
                
                updateItemTotal(productId);
                updateCartSummary();
            }
        });
    });
    
    // Quantity input change
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.id;
            const value = parseInt(this.value);
            
            if (value < 1) {
                this.value = 1;
            }
            
            updateItemTotal(productId);
            updateCartSummary();
        });
    });
    
    // Remove item from cart
    document.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
            const productName = cartItem.querySelector('.item-name').textContent;
            
            // Animate removal
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(-100%)';
            cartItem.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                cartItem.remove();
                updateCartSummary();
                updateCartCount();
                showNotification(`${productName} savatdan olib tashlandi`);
                
                // Check if cart is empty
                checkEmptyCart();
            }, 300);
        });
    });
    
    // Add to wishlist from cart
    document.querySelectorAll('.wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productName = cartItem.querySelector('.item-name').textContent;
            
            this.innerHTML = '<i class="fas fa-heart"></i> Qo\'shildi';
            this.style.color = '#ff6b6b';
            this.disabled = true;
            
            showNotification(`${productName} sevimlilar ro'yxatiga qo'shildi`);
        });
    });
    
    // Clear entire cart
    document.querySelector('.clear-cart-btn')?.addEventListener('click', function() {
        if (confirm('Rostdan ham barcha mahsulotlarni savatdan o\'chirmoqchimisiz?')) {
            const cartItems = document.querySelectorAll('.cart-item');
            
            cartItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-100%)';
                    item.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        item.remove();
                        if (index === cartItems.length - 1) {
                            updateCartSummary();
                            updateCartCount();
                            checkEmptyCart();
                        }
                    }, 300);
                }, index * 100);
            });
            
            showNotification('Savatcha tozalandi');
        }
    });
    
    // Promo code functionality
    const promoInput = document.getElementById('promoCode');
    const applyPromoBtn = document.querySelector('.apply-promo-btn');
    
    applyPromoBtn?.addEventListener('click', function() {
        const promoCode = promoInput?.value.trim().toLowerCase();
        
        if (!promoCode) {
            showNotification('Iltimos, promokodni kiriting!', 'error');
            return;
        }
        
        // Mock promo codes
        const validCodes = {
            'sale10': 10,
            'new20': 20,
            'vip30': 30
        };
        
        if (validCodes[promoCode]) {
            const discount = validCodes[promoCode];
            applyDiscount(discount);
            showNotification(`Promokod qo'llandi! ${discount}% chegirma olasiz.`);
            
            this.textContent = 'Qo\'llandi';
            this.disabled = true;
            this.style.background = '#4ecdc4';
            promoInput.disabled = true;
        } else {
            showNotification('Noto\'g\'ri promokod!', 'error');
        }
    });
    
    // Checkout button
    document.querySelector('.checkout-btn')?.addEventListener('click', function() {
        const cartItems = document.querySelectorAll('.cart-item');
        
        if (cartItems.length === 0) {
            showNotification('Savatcha bo\'sh! Avval mahsulot qo\'shing.', 'error');
            return;
        }
        
        // Simulate checkout process
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buyurtma rasmiylashtirilmoqda...';
        this.disabled = true;
        
        setTimeout(() => {
            showNotification('Buyurtma muvaffaqiyatli rasmiylashtiri;di! Tez orada sizga qo\'ng\'iroq qilamiz.');
            
            // Clear cart after successful order
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 3000);
    });
    
    // Initialize cart summary
    updateCartSummary();
});

// Function to update item total
function updateItemTotal(productId) {
    const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
    const quantityInput = cartItem.querySelector('.quantity-input');
    const priceElement = cartItem.querySelector('.current-price');
    
    if (quantityInput && priceElement) {
        const quantity = parseInt(quantityInput.value);
        const unitPrice = parseFloat(priceElement.textContent.replace('$', ''));
        const total = (unitPrice * quantity).toFixed(2);
        
        priceElement.textContent = `$${total}`;
    }
}

// Function to update cart summary
function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const priceText = item.querySelector('.current-price').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        subtotal += price;
    });
    
    const discount = parseFloat(document.getElementById('discount')?.textContent.replace('-$', '') || 0);
    const shipping = parseFloat(document.getElementById('shipping')?.textContent.replace('$', '') || 15);
    const total = subtotal - discount + (subtotal > 50 ? 0 : shipping);
    
    // Update summary elements
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    }
    
    if (document.getElementById('total')) {
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }
    
    // Update shipping (free for orders over $50)
    if (document.getElementById('shipping') && subtotal > 50) {
        document.getElementById('shipping').textContent = 'Bepul';
        document.getElementById('shipping').style.color = '#4ecdc4';
    }
}

// Function to update cart count
function updateCartCount() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartCount = document.querySelector('.cart-count');
    const cartItemCount = document.getElementById('cartItemCount');
    
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    }
    
    if (cartItemCount) {
        cartItemCount.textContent = `(${cartItems.length} ta)`;
    }
}

// Function to apply discount
function applyDiscount(percentage) {
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    
    if (subtotalElement && discountElement) {
        const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
        const discountAmount = (subtotal * percentage / 100).toFixed(2);
        
        discountElement.textContent = `-$${discountAmount}`;
        discountElement.parentElement.style.display = 'flex';
        
        updateCartSummary();
    }
}

// Function to check if cart is empty
function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartSection = document.querySelector('.cart-section');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cartItems.length === 0) {
        if (cartSection) cartSection.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
    }
}

// Enhanced notification function for cart
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const bgColor = type === 'error' 
        ? 'linear-gradient(45deg, #ff6b6b, #ee5a6f)' 
        : 'linear-gradient(45deg, #4ecdc4, #44a08d)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
        line-height: 1.4;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Save cart to localStorage (for persistence)
function saveCartToStorage() {
    const cartItems = [];
    document.querySelectorAll('.cart-item').forEach(item => {
        const productId = item.dataset.id;
        const quantity = item.querySelector('.quantity-input').value;
        cartItems.push({ id: productId, quantity: quantity });
    });
    
    localStorage.setItem('elegantFashionCart', JSON.stringify(cartItems));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('elegantFashionCart');
    if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        // Implementation would depend on how products are stored/fetched
        console.log('Loaded cart from storage:', cartItems);
    }
}