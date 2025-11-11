// ===========================
// Navigation Module
// ===========================

import { NavScrollLock } from './scrollLock.js';

export function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navMenu || !navClose) {
        console.error('Navigation elements not found', { menuToggle, navMenu, navClose });
        return;
    }

    // Open menu
    menuToggle.addEventListener('click', () => {
        navMenu.classList.add('active');
        NavScrollLock.lock();
    });

    // Close menu
    const closeMenu = () => {
        if (!navMenu.classList.contains('active')) return;
        navMenu.classList.remove('active');
        NavScrollLock.unlock();
    };

    navClose.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                const AUTH_KEY = 'bridalPartyAuth';
                localStorage.removeItem(AUTH_KEY);
                window.location.href = 'auth.html';
            }
        });
    }
}

export function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
