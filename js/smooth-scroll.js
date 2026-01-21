// Initialize Lenis for smooth momentum scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Expose to window for Modal control
window.lenis = lenis;

// Integrate with GSAP's ScrollTrigger (if used)
// function raf(time) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
// }
// requestAnimationFrame(raf);

// Since we are using a simplified setup without complex ScrollTrigger syncing for now:
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Handle anchor links with Lenis smooth scroll
// Handle anchor links with Lenis smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target === '#') {
            lenis.scrollTo(0); // Scroll to top
        } else {
            lenis.scrollTo(target); // Scroll to anchor
        }
    });
});

console.log('Lenis Smooth Scroll Initialized');
