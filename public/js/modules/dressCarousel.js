// ===========================
// Dress Carousel Module
// ===========================

export function initializeDressCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicators = document.querySelectorAll('.indicator');
    const dressName = document.getElementById('dressName');
    const dressDescription = document.getElementById('dressDescription');
    const dressLink = document.getElementById('dressLink');

    if (!track || !prevBtn || !nextBtn) {
        console.warn('Dress carousel elements not found');
        return;
    }

    // Dress data for each slide
    const dressData = [
        {
            name: 'Azazie Bondi',
            description: 'A-Line with ruffled chiffon sleeves and floor-length skirt',
            link: 'https://www.azazie.com/products/azazie-bondi-blushing-pink-a-line-ruffled-chiffon-floor-length-bridesmaid-dress/213115'
        },
        {
            name: 'Azazie Clarice',
            description: 'Halter neckline with chiffon and floor-length elegance',
            link: 'https://www.azazie.com/products/azazie-clarice-blushing-pink-a-line-halter-chiffon-floor-length-bridesmaid-dress/191359'
        },
        {
            name: 'Azazie Chanel',
            description: 'A-Line with pleated chiffon and floor-length design',
            link: 'https://www.azazie.com/products/azazie-chanel-blushing-pink-a-line-pleated-chiffon-floor-length-bridesmaid-dress/190721'
        }
    ];

    let currentSlide = 0;
    const totalSlides = track.querySelectorAll('.carousel-slide').length;

    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        if (dressData[currentSlide]) {
            dressName.textContent = dressData[currentSlide].name;
            dressDescription.textContent = dressData[currentSlide].description;
            dressLink.href = dressData[currentSlide].link;
        }

        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
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
}
