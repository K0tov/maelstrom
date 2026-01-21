// Animated Sticky Navbar
// Shrinks navbar and adds background on scroll

(function () {
    'use strict';

    // --- Burger Menu Logic ---
    const burgerBtn = document.querySelector('.burger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const mobileContactTrigger = document.querySelector('.mobile-contact-trigger');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            const isActive = burgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            // Lock scroll if menu is open
            if (isActive) {
                document.body.style.overflow = 'hidden';
                if (window.lenis) window.lenis.stop();
            } else {
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
            });
        });

        // Open Contact Modal from Mobile Menu
        if (mobileContactTrigger) {
            mobileContactTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                // Close mobile menu first
                burgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');

                // Slight delay to allow menu close animation
                setTimeout(() => {
                    const contactModal = document.getElementById('contactModal');
                    if (contactModal) {
                        contactModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                        if (window.lenis) window.lenis.stop();
                    }
                }, 300);
            });
        }
    }

    // --- Header Scroll Detection ---
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
