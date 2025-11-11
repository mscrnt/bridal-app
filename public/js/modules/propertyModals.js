// ===========================
// Property Modals Module
// ===========================

import { ModalScrollLock } from './scrollLock.js';

export function initializePropertyModal() {
    const propertyModal = document.getElementById('propertyModal');
    const viewDetailsBtn = document.getElementById('viewDetailsBtn');
    const closeBtn = document.querySelector('.property-modal-close');

    if (!propertyModal || !viewDetailsBtn || !closeBtn) {
        console.warn('Property modal elements not found');
        return;
    }

    // Function to close property modal
    const closePropertyModal = () => {
        propertyModal.style.display = 'none';
        ModalScrollLock.unlock();
    };

    // Open modal when button is clicked
    viewDetailsBtn.addEventListener('click', () => {
        ModalScrollLock.lock();
        propertyModal.style.display = 'block';
    });

    // Close modal when X is clicked
    closeBtn.addEventListener('click', closePropertyModal);

    // Close modal when clicking outside the modal content
    propertyModal.addEventListener('click', (e) => {
        if (e.target === propertyModal) {
            closePropertyModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && propertyModal.style.display === 'block') {
            closePropertyModal();
        }
    });
}

export function initializeRulesModal() {
    const rulesModal = document.getElementById('rulesModal');
    const rulesLink = document.getElementById('rulesLink');
    const rulesCloseBtn = document.getElementById('rulesModalClose');

    if (!rulesModal || !rulesLink || !rulesCloseBtn) {
        console.warn('Rules modal elements not found');
        return;
    }

    // Function to close rules modal
    const closeRulesModal = () => {
        rulesModal.style.display = 'none';
        ModalScrollLock.unlock();
    };

    // Open modal when link is clicked
    rulesLink.addEventListener('click', (e) => {
        e.preventDefault();
        ModalScrollLock.lock();
        rulesModal.style.display = 'block';
    });

    // Close modal when X is clicked
    rulesCloseBtn.addEventListener('click', closeRulesModal);

    // Close modal when clicking outside the modal content
    rulesModal.addEventListener('click', (e) => {
        if (e.target === rulesModal) {
            closeRulesModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && rulesModal.style.display === 'block') {
            closeRulesModal();
        }
    });
}

export function initializeManualModal() {
    const manualModal = document.getElementById('manualModal');
    const manualLink = document.getElementById('manualLink');
    const manualCloseBtn = document.getElementById('manualModalClose');

    if (!manualModal || !manualLink || !manualCloseBtn) {
        console.warn('Manual modal elements not found');
        return;
    }

    // Function to close manual modal
    const closeManualModal = () => {
        manualModal.style.display = 'none';
        ModalScrollLock.unlock();
    };

    // Open modal when link is clicked
    manualLink.addEventListener('click', (e) => {
        e.preventDefault();
        ModalScrollLock.lock();
        manualModal.style.display = 'block';
    });

    // Close modal when X is clicked
    manualCloseBtn.addEventListener('click', closeManualModal);

    // Close modal when clicking outside the modal content
    manualModal.addEventListener('click', (e) => {
        if (e.target === manualModal) {
            closeManualModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && manualModal.style.display === 'block') {
            closeManualModal();
        }
    });
}
