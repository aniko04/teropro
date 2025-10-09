// Product Detail Tabs Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tab JavaScript loaded from external file');
    
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    console.log('Found tabs:', tabBtns.length);
    console.log('Found panes:', tabPanes.length);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Tab clicked:', btn.getAttribute('data-tab'));
            
            // Remove active class from all tabs and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab
            btn.classList.add('active');

            // Show corresponding tab pane
            const targetTab = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetTab);
            console.log('Target pane:', targetPane);
            
            if (targetPane) {
                targetPane.classList.add('active');
                console.log('Active class added to:', targetTab);
            } else {
                console.log('Target pane not found for:', targetTab);
            }
        });
    });

    // Quantity control functionality
    const qtyBtns = document.querySelectorAll('.qty-btn');
    const quantityInput = document.querySelector('.quantity-input');

    qtyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentValue = parseInt(quantityInput.value);
            
            if (btn.classList.contains('plus')) {
                quantityInput.value = currentValue + 1;
            } else if (btn.classList.contains('minus') && currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    });

    // Color selection functionality
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Size selection functionality
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Thumbnail image switching
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-product-img img');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            
            const newSrc = thumb.querySelector('img').src;
            if (mainImage) {
                mainImage.src = newSrc;
            }
        });
    });

    // Star rating functionality
    const starLabels = document.querySelectorAll('.star-label');
    const radioButtons = document.querySelectorAll('.star-rating input[type="radio"]');

    starLabels.forEach((label) => {
        label.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input && input.type === 'radio') {
                input.checked = true;
                updateStarDisplay();
            }
        });

        label.addEventListener('mouseenter', function() {
            const input = this.previousElementSibling;
            if (input) {
                const value = input.value;
                highlightStars(value);
            }
        });
    });

    // Star rating container uchun mouseleave
    const starRating = document.querySelector('.star-rating');
    if (starRating) {
        starRating.addEventListener('mouseleave', function() {
            updateStarDisplay();
        });
    }

    function highlightStars(rating) {
        starLabels.forEach((label) => {
            const input = label.previousElementSibling;
            if (input && input.value <= rating) {
                label.style.color = '#ffc107';
            } else {
                label.style.color = '#ddd';
            }
        });
    }

    function updateStarDisplay() {
        const checkedInput = document.querySelector('.star-rating input[type="radio"]:checked');
        if (checkedInput) {
            highlightStars(checkedInput.value);
        } else {
            starLabels.forEach(label => {
                label.style.color = '#ddd';
            });
        }
    }

    // Sahifa yuklanganida rating ko'rsatish
    updateStarDisplay();

    // Rating form submit handler
    const ratingForm = document.querySelector('.rating-form');
    if (ratingForm) {
        ratingForm.addEventListener('submit', function(e) {
            console.log('Form is being submitted');
            
            const selectedRating = document.querySelector('.star-rating input[type="radio"]:checked');
            if (!selectedRating) {
                e.preventDefault();
                alert('Iltimos, rating tanlang!');
                return false;
            }
            
            console.log('Selected rating:', selectedRating.value);
            console.log('Form data will be submitted');
        });
    }
});