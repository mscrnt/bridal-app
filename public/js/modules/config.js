// ===========================
// Configuration Module
// Loads config from window.__APP_CONFIG__ (injected by server)
// or falls back to default values
// ===========================

let config = null;

export async function loadConfig() {
    if (config) return config;

    // Check if config was injected by server (for Docker/env var support)
    if (window.__APP_CONFIG__) {
        config = window.__APP_CONFIG__;
        return config;
    }

    // Fallback: try to load from /config.json
    try {
        const response = await fetch('/config.json');
        if (response.ok) {
            config = await response.json();
            return config;
        }
    } catch (error) {
        console.error('Failed to load config.json:', error);
    }

    // Ultimate fallback: hardcoded defaults
    config = {
        auth: {
            password: 'SecretPassword123' // Default password
        }
    };

    return config;
}

export function getConfig() {
    if (!config) {
        throw new Error('Config not loaded. Call loadConfig() first.');
    }
    return config;
}
