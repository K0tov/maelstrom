// Magnetic Button Effect
// Adds magnetic pull and liquid fill animation
(function () {
    'use strict';

    // Skip on mobile devices (no mouse hover)
    if (window.innerWidth < 768) {
        console.log('🧲 Magnetic buttons skipped on mobile');
        return;
    }

    const buttons = document.querySelectorAll('.btn-magnetic');

    if (buttons.length === 0) {
        console.log('No magnetic buttons found');
        return;
    }

    buttons.forEach(btn => {
        // Create fill element if not exists
        if (!btn.querySelector('.btn-fill')) {
            const fill = document.createElement('span');
            fill.classList.add('btn-fill');
            btn.appendChild(fill);
        }

        // Create text wrapper if not exists (for z-index)
        if (!btn.querySelector('.btn-text')) {
            const text = btn.textContent;
            btn.textContent = '';
            const span = document.createElement('span');
            span.classList.add('btn-text');
            span.textContent = text;
            btn.appendChild(span);
        }

        const fill = btn.querySelector('.btn-fill');

        // Mouse move - Magnetic pull
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center distance
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) * 0.3; // Magnetic strength
            const deltaY = (y - centerY) * 0.3;

            // Move button
            gsap.to(btn, {
                duration: 0.5,
                x: deltaX,
                y: deltaY,
                ease: "power2.out"
            });

            // Move fill (liquid effect)
            gsap.to(fill, {
                duration: 0.5,
                x: (x - centerX) * 0.1, // Lag behind slightly
                y: (y - centerY) * 0.1,
                ease: "power2.out"
            });
        });

        // Mouse enter - Expand fill
        btn.addEventListener('mouseenter', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set initial fill position to entry point
            fill.style.left = x + 'px';
            fill.style.top = y + 'px';

            gsap.to(fill, {
                duration: 0.5,
                scale: 5, // Expand to cover
                opacity: 1,
                ease: "power2.out"
            });
        });

        // Mouse leave - Reset
        btn.addEventListener('mouseleave', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Move button back
            gsap.to(btn, {
                duration: 0.7,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.5)"
            });

            // Shrink fill towards exit point
            gsap.to(fill, {
                duration: 0.4,
                scale: 0,
                opacity: 0,
                left: x,
                top: y,
                ease: "power2.in"
            });
        });
    });

    console.log('🧲 Magnetic buttons initialized');
})();
