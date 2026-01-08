document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in-up class to elements we want to animate
    const cards = document.querySelectorAll('.gs-card, .pillar-card, .timeline-item');
    cards.forEach(card => card.classList.add('fade-in-up'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => observer.observe(card));
});
