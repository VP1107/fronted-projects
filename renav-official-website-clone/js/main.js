/**
 * Renav Official Website - Main JavaScript
 * Handles mobile navigation, text rotation animation, and accessibility
 */

(function () {
    'use strict';

    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const animationCards = document.querySelectorAll('.animation-card');

    // =====================================
    // Mobile Navigation Toggle
    // =====================================
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', toggleMobileNav);
        hamburger.addEventListener('keydown', function (e) {
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
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileNav();
                hamburger.focus();
            }
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function (e) {
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
        hamburger.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';

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

    // =====================================
    // Text Rotation Animation
    // =====================================
    if (animationCards.length > 0) {
        let currentCard = 0;
        const totalCards = animationCards.length;

        function rotateCards() {
            // Remove active from current
            animationCards[currentCard].classList.remove('active');

            // Move to next
            currentCard = (currentCard + 1) % totalCards;

            // Add active to new current
            animationCards[currentCard].classList.add('active');
        }

        // Rotate every 3 seconds
        setInterval(rotateCards, 3000);
    }

    // =====================================
    // Smooth Scroll for Anchor Links
    // =====================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile nav if open
                if (mobileNav && mobileNav.classList.contains('active')) {
                    closeMobileNav();
                }

                // Update URL
                history.pushState(null, null, targetId);
            }
        });
    });

    // =====================================
    // Active Section Highlighting
    // =====================================
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

    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(highlightNavOnScroll);
    });

    highlightNavOnScroll();

})();
