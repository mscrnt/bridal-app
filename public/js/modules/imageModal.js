// ===========================
// Image Modal Module
// ===========================

import { ModalScrollLock } from './scrollLock.js';

export function initializeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.image-modal-close');
    const prevBtn = document.querySelector('.image-modal-prev');
    const nextBtn = document.querySelector('.image-modal-next');

    if (!modal || !modalImg || !closeBtn) {
        console.warn('Image modal elements not found');
        return;
    }

    let currentCarouselImages = [];
    let currentImageIndex = 0;

    const showImage = (index) => {
        if (currentCarouselImages.length === 0) return;

        if (index < 0) index = currentCarouselImages.length - 1;
        if (index >= currentCarouselImages.length) index = 0;
        currentImageIndex = index;
        modalImg.src = currentCarouselImages[index].src;
        modalImg.alt = currentCarouselImages[index].alt;

        if (modalCaption) {
            modalCaption.textContent = currentCarouselImages[index].alt || '';
        }
    };

    const closeModal = () => {
        modal.style.display = 'none';
        ModalScrollLock.unlock();
    };

    // Add click event to each carousel (dress + accessories + airbnb)
    const carouselTypes = ['dress', 'shoes', 'jewelry', 'hair', 'nails', 'airbnb'];

    carouselTypes.forEach(type => {
        let carouselImages;

        if (type === 'dress') {
            carouselImages = document.querySelectorAll('.dress-carousel .carousel-slide img');
        } else if (type === 'airbnb') {
            carouselImages = document.querySelectorAll('.airbnb-carousel .carousel-slide img');
        } else {
            const carouselTrack = document.querySelector(`.accessory-carousel-track[data-carousel="${type}"]`);
            if (!carouselTrack) return;
            carouselImages = carouselTrack.querySelectorAll('.accessory-carousel-slide img');
        }

        if (!carouselImages || carouselImages.length === 0) return;

        carouselImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                currentCarouselImages = Array.from(carouselImages);
                currentImageIndex = index;
                ModalScrollLock.lock();
                modal.style.display = 'block';
                showImage(currentImageIndex);
            });
        });
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentImageIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentImageIndex + 1);
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                showImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showImage(currentImageIndex + 1);
            }
        }
    });
}
