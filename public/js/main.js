// ===========================
// Import Modules
// ===========================
import { initializeNavigation, initializeSmoothScroll } from './modules/navigation.js';
import { initializeDressCarousel } from './modules/dressCarousel.js';
import { initializeAccessoryCarousels } from './modules/accessoryCarousels.js';
import { initializeStayCarousel } from './modules/stayCarousel.js';
import { initializeImageModal } from './modules/imageModal.js';
import { initializePropertyModal, initializeRulesModal, initializeManualModal } from './modules/propertyModals.js';
import { initializeWeather } from './modules/weather.js';

// ===========================
// Initialize all modules
// ===========================
function initializeAll() {
    initializeNavigation();
    initializeSmoothScroll();
    initializeDressCarousel();
    initializeAccessoryCarousels();
    initializeStayCarousel();
    initializeImageModal();
    initializePropertyModal();
    initializeRulesModal();
    initializeManualModal();
    initializeWeather();
}

// Check if components are already loaded
if (window.componentsReady) {
    initializeAll();
} else {
    document.addEventListener('componentsLoaded', initializeAll);
}
