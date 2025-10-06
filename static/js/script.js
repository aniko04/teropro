// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// Newsletter Form Handler
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    if (email) {
        // Simulate form submission
        alert('Rahmat! Siz muvaffaqiyatli obuna bo\'ldingiz: ' + email);
        this.reset();
    }
});

// Product Card Animations
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Collection Card Click Handler
document.querySelectorAll('.overlay-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const cardTitle = this.closest('.collection-card').querySelector('h3').textContent;
        alert(`${cardTitle} kolleksiyasi tez orada mavjud bo'ladi!`);
    });
});

// Action Buttons Handler
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const productName = this.closest('.product-card').querySelector('h4').textContent;
        
        if (icon.classList.contains('fa-heart')) {
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
            const action = icon.classList.contains('fas') ? 'qo\'shildi' : 'olib tashlandi';
            showNotification(`${productName} sevimlilar ro'yxatiga ${action}`);
        } else if (icon.classList.contains('fa-eye')) {
            showNotification(`${productName} mahsuloti ko'rilmoqda`);
        } else if (icon.classList.contains('fa-shopping-cart')) {
            showNotification(`${productName} savatga qo'shildi`);
        }
    });
});

// Notification System
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Scroll Animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.collection-card, .product-card, .about-text, .about-image');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state
    const elements = document.querySelectorAll('.collection-card, .product-card, .about-text, .about-image');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});

// Search Functionality (Mock)
document.querySelector('.fa-search')?.addEventListener('click', function() {
    const searchTerm = prompt('Qidirish uchun mahsulot nomini kiriting:');
    if (searchTerm) {
        showNotification(`"${searchTerm}" qidirilmoqda...`);
    }
});

// User Icon Click
document.querySelector('.fa-user')?.addEventListener('click', function() {
    showNotification('Foydalanuvchi profili tez orada mavjud bo\'ladi!');
});

// Shopping Bag Click
document.querySelector('.fa-shopping-bag')?.addEventListener('click', function() {
    showNotification('Savatcha tez orada mavjud bo\'ladi!');
});

// Hero Button Click
document.querySelector('.hero-btn')?.addEventListener('click', function() {
    const collectionsSection = document.querySelector('#collections');
    if (collectionsSection) {
        collectionsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Loading Animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add CSS for loading animation
const loadingCSS = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeOut 0.5s ease 1s forwards;
    }
    
    body:not(.loaded)::after {
        content: 'Elegant Fashion';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 2rem;
        font-weight: 700;
        z-index: 10000;
        animation: fadeOut 0.5s ease 1s forwards;
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            visibility: hidden;
        }
    }
`;

const style = document.createElement('style');
style.textContent = loadingCSS;
document.head.appendChild(style);