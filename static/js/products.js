// Products Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    const productsGrid = document.getElementById('productsGrid');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // View toggle
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });
    
    // Filter products
    function filterProducts() {
        const category = categoryFilter?.value || '';
        const price = priceFilter?.value || '';
        const sort = sortFilter?.value || '';
        const products = Array.from(productsGrid?.children || []);
        
        // Filter by category
        products.forEach(product => {
            const productCategory = product.dataset.category;
            const productPrice = parseInt(product.dataset.price);
            let show = true;
            
            if (category && productCategory !== category) {
                show = false;
            }
            
            if (price) {
                const [min, max] = price.includes('+') 
                    ? [parseInt(price.replace('+', '')), Infinity]
                    : price.split('-').map(p => parseInt(p));
                
                if (productPrice < min || productPrice > max) {
                    show = false;
                }
            }
            
            product.style.display = show ? 'block' : 'none';
        });
        
        // Sort products
        if (sort) {
            const visibleProducts = products.filter(p => p.style.display !== 'none');
            
            visibleProducts.sort((a, b) => {
                switch(sort) {
                    case 'price-low':
                        return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                    case 'price-high':
                        return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                    case 'name':
                        return a.querySelector('h4').textContent.localeCompare(b.querySelector('h4').textContent);
                    default:
                        return 0;
                }
            });
            
            // Reorder in DOM
            visibleProducts.forEach(product => {
                productsGrid.appendChild(product);
            });
        }
    }
    
    // Add event listeners
    categoryFilter?.addEventListener('change', filterProducts);
    priceFilter?.addEventListener('change', filterProducts);
    sortFilter?.addEventListener('change', filterProducts);
    
    // Pagination
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev):not(.next)');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            pageButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productName = this.closest('.product-card').querySelector('h4').textContent;
            
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const currentCount = parseInt(cartCount.textContent) || 0;
                cartCount.textContent = currentCount + 1;
            }
            
            showNotification(`${productName} savatga qo'shildi!`);
        });
    });
    
    // Wishlist functionality
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            const productName = this.closest('.product-card').querySelector('h4').textContent;
            const action = icon.classList.contains('fas') ? 'qo\'shildi' : 'olib tashlandi';
            showNotification(`${productName} sevimlilar ro'yxatiga ${action}`);
        });
    });
});

// Check URL parameters for category filter
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
            categoryFilter.dispatchEvent(new Event('change'));
        }
    }
});