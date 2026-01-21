// Custom Cursor - Reference Logic (Instant Follow + Pulse)
(function () {
    'use strict';

    // Mobile detection
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    if (isMobile) {
        console.log('Mobile device detected - cursor disabled');
        return;
    }

    const cursor = document.querySelector('.cursor-ball');

    if (!cursor) {
        console.warn('Cursor element not found');
        return;
    }

    let mouseX = 0;
    let mouseY = 0;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant follow - logic from reference
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Pulse effect from reference (throttled check)
    let lastMouseMoveTime = 0;
    let pulseFrame = null;

    function checkPulse() {
        if (Date.now() - lastMouseMoveTime > 100) {
            cursor.style.borderWidth = "2px";
            pulseFrame = null;
        } else {
            pulseFrame = requestAnimationFrame(checkPulse);
        }
    }

    document.addEventListener("mousemove", () => {
        lastMouseMoveTime = Date.now();
        cursor.style.borderWidth = "3px"; // Thicker on move
        if (!pulseFrame) {
            pulseFrame = requestAnimationFrame(checkPulse);
        }
    });

    // Hover effects - logic from reference (using standard mouseenter/leave)
    // Because cursor is now instant, mouseenter on elements works perfectly visually
    const interactiveElements = document.querySelectorAll('a, button, .project-item, .nav-link, .toggle-btn, .meta-item, .btn-gradient, .card, .large-box, .shiny-cta');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '60px'; // Larger hover
            cursor.style.height = '60px';
            cursor.style.borderWidth = '3px';
            // Dot stays same size centered
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.width = '40px'; // Back to normal
            cursor.style.height = '40px';
            cursor.style.borderWidth = '2px';
        });
    });

    console.log('✨ Cursor initialized (Reference Logic: Instant + Ring/Dot)');
})();
