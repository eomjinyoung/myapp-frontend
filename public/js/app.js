document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ VibeApp Frontend Initialized');

    const primaryCta = document.getElementById('primary-cta');

    if (primaryCta) {
        primaryCta.addEventListener('click', () => {
            alert('Welcome to VibeApp! This is just the beginning.');

            // Add a little interaction feel
            primaryCta.textContent = 'Launching...';
            setTimeout(() => {
                primaryCta.textContent = 'Get Started';
            }, 2000);
        });
    }

    // Smooth hover effect for nav links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
});
