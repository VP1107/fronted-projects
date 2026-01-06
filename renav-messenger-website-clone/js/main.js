/**
 * Renav Messenger Website - Main JavaScript
 * Handles mobile navigation, smooth scrolling, and accessibility
 */

(function() {
    'use strict';

    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const consentButton = document.querySelector('.consent_preference button');

    // Mobile Navigation Toggle
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', toggleMobileNav);
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileNav();
            }
        });

        // Close mobile nav when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        // Close mobile nav when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileNav();
                hamburger.focus();
            }
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMobileNav();
            }
        });
    }

    function toggleMobileNav() {
        const isOpen = mobileNav.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
        
        // Animate hamburger icon
        hamburger.classList.toggle('open', isOpen);
        
        // Focus first link when opening
        if (isOpen) {
            mobileNavLinks[0]?.focus();
        }
    }

    function closeMobileNav() {
        mobileNav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });

    // Consent Preference Button (placeholder functionality)
    if (consentButton) {
        consentButton.addEventListener('click', function() {
            // Placeholder for cookie consent modal
            console.log('Cookie consent preferences clicked');
            // You can integrate your cookie consent solution here
        });
    }

    // Add active state to current section nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.center-links a, .mobile-nav a');

    function highlightNavOnScroll() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('current');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('current');
                    }
                });
            }
        });
    }

    // Throttle scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(highlightNavOnScroll);
    });

    // Initialize on page load
    highlightNavOnScroll();

})();
