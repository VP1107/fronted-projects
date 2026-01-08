// Intro Animation
let particleAnimationId;

document.addEventListener('DOMContentLoaded', function () {
    // Add intro-active class to body
    document.body.classList.add('intro-active');

    // Check if user has seen intro before (in this session)
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

    if (hasSeenIntro) {
        skipIntro();
        return;
    }

    // Run intro animation
    runIntroAnimation();
    initParticles();
});

function runIntroAnimation() {
    const stages = [
        { id: 'stage1', delay: 0 },
        { id: 'stage2', delay: 1200 },
        { id: 'stage3', delay: 2400 },
        { id: 'stage4', delay: 3600 },
        { id: 'introLogo', delay: 4800 }
    ];

    // Show first stage
    const firstStage = document.getElementById(stages[0].id);
    if (!firstStage) return; // Exit if intro elements are missing (e.g., inner pages)

    firstStage.classList.add('active');

    // Progress through stages
    stages.forEach((stage, index) => {
        if (index === 0) return; // Skip first, already shown

        setTimeout(() => {
            // Hide previous stage
            if (index > 0) {
                const prevStage = document.getElementById(stages[index - 1].id);
                if (prevStage) prevStage.classList.remove('active');
            }
            // Show current stage
            const currStage = document.getElementById(stage.id);
            if (currStage) currStage.classList.add('active');
        }, stage.delay);
    });

    // End intro after all stages
    setTimeout(() => {
        endIntro();
    }, 6500);
}

function skipIntro() {
    sessionStorage.setItem('hasSeenIntro', 'true');
    const overlay = document.getElementById('introOverlay');

    if (overlay) {
        overlay.classList.add('hidden');
        // Remove overlay from DOM after animation
        setTimeout(() => {
            overlay.remove();
        }, 800);
    }

    document.body.classList.remove('intro-active');
    document.body.classList.add('loaded');

    // Stop particles
    if (particleAnimationId) {
        cancelAnimationFrame(particleAnimationId);
    }
}

function endIntro() {
    skipIntro(); // Reuse same logic
}

// Make skipIntro available globally
window.skipIntro = skipIntro;

// Interactive Particles
function initParticles() {
    const canvas = document.getElementById('bgParticles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;

    // Mouse position
    let mouse = {
        x: null,
        y: null,
        radius: 150
    }

    window.addEventListener('mousemove', function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, size, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.baseX = x;
            this.baseY = y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }

            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 4) + 1;
            let x = (Math.random() * innerWidth);
            let y = (Math.random() * innerHeight);
            let color = 'rgba(237, 30, 121, 0.4)'; // Primary pink transparency

            // Mix in some secondary colors
            if (i % 3 === 0) color = 'rgba(0, 0, 124, 0.3)'; // Navy blue
            if (i % 5 === 0) color = 'rgba(255, 255, 255, 0.6)'; // White

            particlesArray.push(new Particle(x, y, size, color));
        }
    }

    function animate() {
        particleAnimationId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    init();
    animate();

    // Resize event
    window.addEventListener('resize', function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });
}

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Wait for intro to finish or be skipped
    setTimeout(() => {
        initializeSiteFeatures();
    }, 100);
});

function initializeSiteFeatures() {
    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });

    // Smooth Scroll for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Validation and Submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const trimester = document.getElementById('trimester').value;
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !phone || !trimester) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Phone validation (Indian format)
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                showNotification('Please enter a valid 10-digit phone number.', 'error');
                return;
            }

            // Success - In production, this would send to a server
            showNotification('Thank you! We will contact you soon.', 'success');
            contactForm.reset();
        });
    }

    // Notification Function
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 16px;
            font-weight: 500;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
        `;

        // Add close button styles
        const closeBtn = notification.querySelector('button');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Floating Elements & Page Transition
    // Note: The backToTop button visibility and click handler are already present
    // in the 'Back to Top and Navbar Effect' section below.

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-box, .testimonial-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinksList = document.querySelector('.nav-links');

    if (hamburger && navLinksList) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinksList.classList.remove('active');
            });
        });
    }

    // Back to Top and Navbar Effect
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset; // or scrollY

        // Navbar Effect (handled above, but we can refine here or leave as is)
        // Existing logic handles shadow. We can add padding shrink here if needed.
        if (currentScroll > 50) {
            navbar.style.padding = '15px 80px';
        } else {
            navbar.style.padding = '20px 80px';
        }

        // Mobile responsive padding correction
        if (window.innerWidth <= 768) {
            navbar.style.padding = '15px 20px';
        }

        // Back to Top Visibility
        if (currentScroll > 500 && backToTopBtn) {
            backToTopBtn.classList.add('visible');
        } else if (backToTopBtn) {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Page Transition Effect - Global Function
window.handlePageTransition = function (url) {
    const overlay = document.getElementById('zoomTransition');
    if (overlay) {
        // Prevent interfering scrolls
        document.body.style.overflow = 'hidden';
        overlay.classList.add('active');

        setTimeout(() => {
            window.location.href = url;
        }, 800); // Wait for zoom animation (0.8s)
    } else {
        window.location.href = url;
    }
};
