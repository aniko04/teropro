// Tabs Debug Script
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing tabs...');

    // Check if elements exist
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    console.log('Found tab buttons:', tabButtons.length);
    console.log('Found tab panes:', tabPanes.length);

    // Log each tab button
    tabButtons.forEach((btn, index) => {
        console.log(`Tab button ${index}:`, btn.dataset.tab, btn.textContent.trim());
    });

    // Log each tab pane
    tabPanes.forEach((pane, index) => {
        console.log(`Tab pane ${index}:`, pane.id, pane.classList.contains('active'));
    });

    // Add click handlers with detailed logging
    tabButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('=== Tab Click Event ===');
            console.log('Clicked button:', this.textContent.trim());
            console.log('Target tab:', this.dataset.tab);

            const targetTab = this.dataset.tab;

            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                const wasActive = btn.classList.contains('active');
                btn.classList.remove('active');
                if (wasActive) console.log('Removed active from:', btn.textContent.trim());
            });

            // Remove active class from all panes
            tabPanes.forEach(pane => {
                const wasActive = pane.classList.contains('active');
                pane.classList.remove('active');
                if (wasActive) console.log('Removed active from pane:', pane.id);
            });

            // Add active class to clicked button
            this.classList.add('active');
            console.log('Added active to button:', this.textContent.trim());

            // Add active class to target pane
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
                console.log('Added active to pane:', targetTab);
                console.log('Pane is now visible:', window.getComputedStyle(targetPane).display !== 'none');
            } else {
                console.error('Target pane not found:', targetTab);
                console.log('Available pane IDs:', Array.from(tabPanes).map(p => p.id));
            }

            console.log('=== End Tab Click Event ===');
        });
    });

    // Test CSS
    console.log('Testing CSS...');
    const testPane = document.querySelector('.tab-pane.active');
    if (testPane) {
        const styles = window.getComputedStyle(testPane);
        console.log('Active tab pane display:', styles.display);
        console.log('Active tab pane visibility:', styles.visibility);
    }
});