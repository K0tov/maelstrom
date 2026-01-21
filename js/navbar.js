// Animated Sticky Navbar
// Shrinks navbar and adds background on scroll

(function () {
    'use strict';

    const header = document.querySelector('.header');

    if (!header) {
        console.warn('⚠️ Header element not found');
        return;
    }

    let lastScroll = 0;

    // Handle scroll event
    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;

        // Add scrolled class when scrolled down more than 50px
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    }

    // Listen to scroll with throttling for performance
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleScroll();

    console.log('📜 Animated navbar initialized');
})();
