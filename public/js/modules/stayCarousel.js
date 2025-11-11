// ===========================
// Stay/Airbnb Carousel Module
// ===========================

export function initializeStayCarousel() {
    const track = document.getElementById('airbnbCarouselTrack');
    const prevBtn = document.getElementById('airbnbCarouselPrev');
    const nextBtn = document.getElementById('airbnbCarouselNext');
    const indicators = document.querySelectorAll('#airbnbCarouselIndicators .carousel-indicator');

    if (!track || !prevBtn || !nextBtn) {
        console.warn('Stay carousel elements not found');
        return;
    }

    let currentSlide = 0;
    const slides = track.querySelectorAll('.carousel-slide');
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
    };

    const goToSlide = (slideIndex) => {
        currentSlide = slideIndex;

        if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        } else if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }

        updateCarousel();
    };

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Touch/swipe support
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
}
