// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animate statistics counter
    function animateCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    const current = parseInt(entry.target.textContent);
                    
                    if (current < target) {
                        const increment = target / 50;
                        const timer = setInterval(() => {
                            const current = parseInt(entry.target.textContent);
                            if (current < target) {
                                entry.target.textContent = Math.min(current + increment, target).toFixed(0);
                            } else {
                                clearInterval(timer);
                                entry.target.textContent = target;
                            }
                        }, 30);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        });
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    // Initialize counter animation
    animateCounter();
    
    // Team member hover effects
    document.querySelectorAll('.team-member').forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Timeline animation
    function animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });
        
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    }
    
    // Initialize timeline animation
    animateTimeline();
    
    // Values cards animation
    function animateValues() {
        const valueCards = document.querySelectorAll('.value-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });
        
        valueCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }
    
    // Initialize values animation
    animateValues();
});