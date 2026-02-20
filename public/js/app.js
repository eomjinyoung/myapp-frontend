document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ VibeApp Frontend Initialized');

    const navUl = document.querySelector('nav ul');
    if (navUl) {
        if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
            navUl.innerHTML = `
                <li><a href="/">Home</a></li>
                <li><a href="/posts.html">Posts</a></li>
                <li><a href="/profile.html">Profile</a></li>
                <li><a href="#" id="logout-btn">Logout</a></li>
            `;

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (typeof Auth !== 'undefined') {
                        await Auth.logout();
                    }
                    location.href = '/';
                });
            }
        } else {
            navUl.innerHTML = `
                <li><a href="/">Home</a></li>
                <li><a href="/login.html">Login</a></li>
                <li><a href="/signup.html">Signup</a></li>
            `;
        }
    }

    const primaryCta = document.getElementById('primary-cta');
    if (primaryCta) {
        primaryCta.addEventListener('click', () => {
            if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
                location.href = '/posts.html';
            } else {
                location.href = '/login.html';
            }
        });
    }
});
