// ===========================
// Accessory Carousels Module
// ===========================

export function initializeAccessoryCarousels() {
    const carouselTypes = ['shoes', 'jewelry', 'hair', 'nails'];

    carouselTypes.forEach(type => {
        const track = document.querySelector(`.accessory-carousel-track[data-carousel="${type}"]`);
        const prevBtn = document.querySelector(`.accessory-prev[data-carousel="${type}"]`);
        const nextBtn = document.querySelector(`.accessory-next[data-carousel="${type}"]`);
        const indicators = document.querySelectorAll(`.accessory-carousel-indicators[data-carousel="${type}"] .accessory-indicator`);

        if (!track || !prevBtn || !nextBtn) {
            console.warn(`Accessory carousel "${type}" elements not found`);
            return;
        }

        let currentSlide = 0;
        const slides = track.querySelectorAll('.accessory-carousel-slide');
        const totalSlides = slides.length;

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            indicators.forEach((indicator, index) => {
                if (index === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });

            // Update shoe product links if this is the shoes carousel
            if (type === 'shoes') {
                const shoeLinks = document.querySelectorAll('.shoe-link');
                shoeLinks.forEach((link, index) => {
                    if (index === currentSlide) {
                        link.style.display = 'inline-block';
                    } else {
                        link.style.display = 'none';
                    }
                });
            }
        };

        let lastClickTime = 0;
        const clickDelay = 100;

        const goToSlide = (slideIndex) => {
            const now = Date.now();
            if (now - lastClickTime < clickDelay) return;
            lastClickTime = now;

            currentSlide = slideIndex;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            if (currentSlide >= totalSlides) currentSlide = 0;
            updateCarousel();
        };

        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }
            }
        };

        updateCarousel();
    });
}
