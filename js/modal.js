// Contact Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('openContact');
    const closeBtn = document.getElementById('closeContact');
    const backdrop = document.querySelector('.modal-backdrop');
    const form = document.querySelector('.contact-form');

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock native scroll
        if (window.lenis) window.lenis.stop(); // Stop Lenis scroll
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock native scroll
        if (window.lenis) window.lenis.start(); // Resume Lenis scroll
    }

    // Event Listeners
    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form Submission (Demo)
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.form-submit span');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Відправлено! 🚀';

            setTimeout(() => {
                closeModal();
                form.reset();
                submitBtn.innerText = originalText;
            }, 1000);
        });
    }
});
