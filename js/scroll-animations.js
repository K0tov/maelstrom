// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

console.log('Scroll Animations: Initializing Horizontal Scroll...');

window.addEventListener('load', () => {
    // Disable horizontal scroll on mobile
    if (window.innerWidth < 768) {
        console.log('Scroll Animations: Skipping horizontal scroll on mobile');
        return;
    }

    const workSection = document.querySelector('.work-section');
    const wrapper = document.querySelector('.horizontal-scroll-wrapper');
    const projectItems = document.querySelectorAll('.project-item');

    if (workSection && wrapper && projectItems.length > 0) {
        // Calculate the total width to move
        // It's intuitive to scroll until the last item is in view
        // We use a function to recalculate on resize is handled by ScrollTrigger mostly, 
        // but 'xPercent' is safer if we just want to move the track.

        // Alternatively, calculate exact pixel distance:
        function getScrollAmount() {
            let wrapperWidth = wrapper.scrollWidth;
            return -(wrapperWidth - window.innerWidth + 100); // +100 for some padding
        }

        const tween = gsap.to(wrapper, {
            x: getScrollAmount,
            ease: "none"
        });

        // 1. PINNING TRIGGER (Duration = Scroll + Overlap)
        ScrollTrigger.create({
            trigger: workSection,
            start: "top top",
            end: () => "+=" + (window.innerHeight * 7), // 600vh Scroll + 100vh Static for Overlap
            pin: true,
            invalidateOnRefresh: true,
        });

        // 2. ANIMATION TRIGGER (Duration = Scroll only)
        ScrollTrigger.create({
            trigger: workSection,
            start: "top top",
            end: () => "+=" + (window.innerHeight * 6), // Extended to 600vh for slower, smoother feeling
            scrub: 1.5, // Increased inertia/weight
            animation: tween,
            invalidateOnRefresh: true,
        });

        // 3. ABOUT SECTION - Standard Scroll (No Pin needed if Footer flows normally)
        /* Removed Pin to simplify and fix visibility */

        console.log('Scroll Animations: Horizontal Scroll Active');
    }
});
