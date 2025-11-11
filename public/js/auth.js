// ===========================
// Auth Page Main Script
// ===========================

import { loadConfig } from './modules/config.js';
import { checkAuthentication, initializeAuth } from './modules/auth.js';

// Load config first, then initialize
async function init() {
    await loadConfig();

    // Check if already authenticated
    checkAuthentication();

    // Initialize auth when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAuth);
    } else {
        initializeAuth();
    }
}

init();
