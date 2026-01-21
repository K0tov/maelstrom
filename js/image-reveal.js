// Image Reveal on Hover - Syнcs with Custom Cursor Ball
(function () {
    'use strict';

    // Skip on mobile devices (no cursor, touch-based)
    if (window.innerWidth < 768) {
        console.log('🖼️ Image reveal skipped on mobile');
        return;
    }

    const container = document.querySelector('.image-reveal-container');
    const projectItems = document.querySelectorAll('.project-item');
    const cursorBall = document.querySelector('.cursor-ball');

    if (!container || projectItems.length === 0) {
        console.warn('⚠️ Image reveal elements not found');
        return;
    }

    // Default position & Velocity tracking
    let ballX = 0;
    let ballY = 0;
    let lastX = 0;
    let lastY = 0;

    // Select the displacement map for glitch effect
    const displacementMap = document.querySelector('#glitch feDisplacementMap');
    const turbo = document.querySelector('#glitch feTurbulence');

    // Track cursor ball position loop
    function updatePosition() {
        if (!cursorBall) return;

        // Get visual position
        const rect = cursorBall.getBoundingClientRect();
        ballX = rect.left + rect.width / 2;
        ballY = rect.top + rect.height / 2;

        // Calculate Velocity using distance from last frame
        const velX = ballX - lastX;
        const velY = ballY - lastY;
        const dist = Math.hypot(velX, velY);

        lastX = ballX;
        lastY = ballY;

        // Apply Glitch Effect based on Velocity
        if (displacementMap) {
            const targetScale = Math.min(dist * 5, 100);
            gsap.to(displacementMap, {
                attr: { scale: targetScale },
                duration: 0.1,
                ease: 'power2.out'
            });

            if (turbo && targetScale > 5) {
                gsap.to(turbo, {
                    attr: { baseFrequency: `0.02 ${0.05 + Math.random() * 0.1}` },
                    duration: 0.1
                });
            }
        }

        // Apply to container with offset AND bending (rotation)
        if (container.style.opacity === '1') {
            // Rotate based on X velocity (inertia effect)
            const rotation = Math.min(Math.max(velX * 0.5, -15), 15); // Clamp rotation
            const targetX = ballX + 30;
            const targetY = ballY - 100;

            // Smoothly interpolate transform would be better, but direct apply for responsiveness:
            container.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${rotation}deg)`;
        }

        requestAnimationFrame(updatePosition);
    }

    // Start tracking
    requestAnimationFrame(updatePosition);

    // Setup hover for projects
    projectItems.forEach((item, index) => {
        const images = container.querySelectorAll('.image-reveal__image');
        const bgImages = document.querySelectorAll('.work-bg-img'); // Select background images

        // Adjust index for project items if we have an Intro card at index 0 which isn't a project
        // The HTML structure has the first .project-item as "Selected Work" (intro)
        // Checks if this item is the intro card
        if (item.classList.contains('project-item--intro')) return;

        // Visual index needs to account for the intro card being -1 in the images array context
        // BUT, looking at HTML, the intro card is a sibling. 
        // Let's rely on the project items list. The intro is item[0]. 
        // Real projects start at item[1].
        // The images array corresponds to the Real projects.
        // So we need to map item index to image index.

        // However, standard projectItems querySelectorAll includes the intro card.
        // Let's assume images array matches the order of REAL projects.
        // So item 1 -> image 0, item 2 -> image 1, etc.

        const realIndex = index - 1; // 0-based index for actual projects
        if (realIndex < 0) return; // Skip intro card logic for images

        const img = images[realIndex];
        const bgImg = bgImages[realIndex];

        if (!img) return;

        item.addEventListener('mouseenter', () => {
            // Hide other images
            images.forEach(img => img.style.opacity = '0');
            bgImages.forEach(bg => bg.style.opacity = '0');

            // Show current
            img.style.opacity = '1';
            if (bgImg) bgImg.style.opacity = '1';

            // Show container
            container.style.opacity = '1';
            container.style.visibility = 'visible';
        });

        item.addEventListener('mouseleave', () => {
            // Hide container
            container.style.opacity = '0';
            container.style.visibility = 'hidden';

            // Hide background
            if (bgImg) bgImg.style.opacity = '0';
        });
    });

    // Only transition opacity smoothly
    container.style.transition = 'opacity 0.3s ease';

    console.log(' Image reveal initialized (synced with cursor ball)');
})();
