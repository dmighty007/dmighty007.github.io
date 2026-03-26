document.addEventListener('DOMContentLoaded', function() {
    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Close responsive menu when a scroll trigger link is clicked
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarResponsive');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Close hamburger menu on click outside
    document.addEventListener('click', (e) => {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const clickedInsideNav = navbarCollapse.contains(e.target) || navbarToggler.contains(e.target);
            if (!clickedInsideNav) {
                navbarToggler.click();
            }
        }
    });

    // Close hamburger menu on scroll
    document.addEventListener('scroll', () => {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    }, { passive: true });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    fadeElements.forEach(el => observer.observe(el));

    // 3-Way Theme Cycle Logic: dark -> light -> cartoon -> dark
    const cycleBtn = document.querySelector('#theme-toggle-btn');
    const themeIcon = document.querySelector('#theme-icon');

    // Theme config: name, body class to add, icon emoji
    const themes = [
        { name: 'dark',    className: null,              icon: '🌙' },
        { name: 'light',   className: 'light-theme',     icon: '☀️' },
        { name: 'cartoon', className: 'cartoon-theme',   icon: '🎨' },
        { name: 'glass',   className: 'glass-theme',     icon: '💎' },
    ];

    // Restore saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    let currentThemeIndex = themes.findIndex(t => t.name === savedTheme);
    if (currentThemeIndex === -1) currentThemeIndex = 0;

    function applyTheme(index) {
        // Remove all theme classes first
        document.body.classList.remove('light-theme', 'cartoon-theme', 'glass-theme');
        const theme = themes[index];
        if (theme.className) {
            document.body.classList.add(theme.className);
        }
        if (themeIcon) themeIcon.textContent = theme.icon;
        localStorage.setItem('theme', theme.name);
        initBackground(); // Re-initialize background colors
    }

    if (cycleBtn) {
        cycleBtn.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            applyTheme(currentThemeIndex);
        });
    }

    // Apply on load
    applyTheme(currentThemeIndex);

    // Dynamic Physics Background using tsParticles
    function initBackground() {
        const isLight   = document.body.classList.contains('light-theme');
        const isCartoon = document.body.classList.contains('cartoon-theme');
        const isGlass   = document.body.classList.contains('glass-theme');

        // Default set for dark theme
        let colors = ["#42b9f5", "#ff3f81", "#ffffff"]; 
        let bgColor = "#0a0c10";

        if (isLight) {
            colors = ["#0284c7", "#e11d48", "#1e293b"];
            bgColor = "#f8fafc";
        } else if (isCartoon) {
            colors = ["#e97316", "#14b8a6", "#334155"];
            bgColor = "#fef08a";
        } else if (isGlass) {
            colors = ["#00f2fe", "#4facfe", "#ffffff"];
            bgColor = "#050a15";
        }

        // Apply bg color to container dynamically to ensure it stays behind if themes shift deeply
        const tsContainer = document.getElementById("tsparticles");
        if (tsContainer) {
             tsContainer.style.backgroundColor = bgColor;
        }

        if (window.tsParticles) {
            const pJS = tsParticles.domItem(0);

            // Hide/Pause particles except in Glass Theme
            if (!isGlass) {
                if (pJS) {
                    pJS.pause();
                    pJS.canvas.element.style.display = 'none';
                }
                return; // Do not initialize/run on other themes
            }

            // Provide seamless color updates if already loaded (Glass theme active)
            if (pJS) {
                pJS.canvas.element.style.display = 'block';
                pJS.play();
                pJS.options.particles.color.value = colors;
                pJS.refresh();
                return;
            }

            // Fresh load utilizing the user's specific optimized settings (Glass theme active)
            tsParticles.load("tsparticles", {
                background: {
                    color: "transparent" // Let CSS handle the main color
                },
                particles: {
                    number: {
                        value: 60,
                        density: { enable: true, area: 800 }
                    },
                    color: {
                        value: colors 
                    },
                    shape: { type: "circle" },
                    opacity: { value: 0.6, random: true },
                    size: { value: { min: 1, max: 3 } },
                    links: { enable: false },
                    collisions: { enable: true, mode: "bounce" },
                    move: {
                        enable: true,
                        speed: 1.2,
                        direction: "none",
                        random: true,
                        straight: false,
                        outModes: { default: "bounce" }
                    }
                },
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "repulse" },
                        onClick: { enable: true, mode: "push" },
                        resize: true
                    },
                    modes: {
                        repulse: { distance: 120, duration: 0.4 },
                        push: { quantity: 3 }
                    }
                },
                detectRetina: true
            });
        }
    }

    // Handle CV PDF Download
    const downloadCvBtn = document.getElementById('download-cv-btn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const cvIframe = document.getElementById('cv-iframe');
            // Try to trigger the download button inside the iframe (same-origin)
            if (cvIframe && cvIframe.contentDocument) {
                // Button ID in cv.html (check both possible IDs for resilience)
                const innerBtn = cvIframe.contentDocument.getElementById('dl-btn')
                              || cvIframe.contentDocument.getElementById('downloadPdfBtn');
                if (innerBtn) {
                    innerBtn.click();
                    return;
                }
            }
            // Fallback: open CV in new tab so user can download from there
            window.open('assets/cv.html', '_blank');
        });
    }
});
