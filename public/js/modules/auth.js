// ===========================
// Authentication Module
// ===========================

import { getConfig } from './config.js';

const AUTH_KEY = 'bridalPartyAuth'; // Hardcoded - doesn't need to be configurable

let CORRECT_PASSWORD = null;
let AUTH_TOKEN = null;

// Initialize auth constants from config
function initAuthConstants() {
    const config = getConfig();
    CORRECT_PASSWORD = config.auth.password;
    AUTH_TOKEN = 'authenticated_' + btoa(CORRECT_PASSWORD);
}

// Check if already authenticated
export function checkAuthentication() {
    initAuthConstants();

    if (localStorage.getItem(AUTH_KEY) === AUTH_TOKEN) {
        window.location.href = 'main.html';
        return true;
    }
    return false;
}

// Initialize auth form
export function initializeAuth() {
    initAuthConstants();

    const form = document.getElementById('authForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const toggleButton = document.getElementById('togglePassword');
    const authContainer = document.querySelector('.auth-container');

    if (!form || !passwordInput || !errorMessage || !toggleButton || !authContainer) {
        console.error('Auth elements not found');
        return;
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const enteredPassword = passwordInput.value;

        if (enteredPassword === CORRECT_PASSWORD) {
            // Store authentication token
            localStorage.setItem(AUTH_KEY, AUTH_TOKEN);

            // Redirect to main site
            window.location.href = 'main.html';
        } else {
            // Show error
            passwordInput.classList.add('error');
            errorMessage.classList.add('show');

            // Clear after animation
            setTimeout(() => {
                passwordInput.value = '';
                passwordInput.classList.remove('error');
            }, 2000);
        }
    });

    // Remove error on input
    passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('error');
        errorMessage.classList.remove('show');
    });

    // Toggle password visibility
    toggleButton.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.textContent = 'Hide';
            toggleButton.setAttribute('aria-label', 'Hide password');
        } else {
            passwordInput.type = 'password';
            toggleButton.textContent = 'Show';
            toggleButton.setAttribute('aria-label', 'Show password');
        }
    });

    // Slide container up when keyboard appears on mobile
    passwordInput.addEventListener('focus', () => {
        authContainer.classList.add('keyboard-active');
    });

    passwordInput.addEventListener('blur', () => {
        authContainer.classList.remove('keyboard-active');
    });
}
