// Component Loader
// Loads HTML components into the page

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${componentPath}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        } else {
            console.error(`Element with id "${elementId}" not found`);
        }
    } catch (error) {
        console.error('Component loading error:', error);
    }
}

async function loadAllComponents() {
    // Disable scroll restoration to prevent browser from jumping around
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Force scroll to top immediately before loading components
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const components = [
        { id: 'header-component', path: '/components/header.html' },
        { id: 'welcome-component', path: '/components/welcome.html' },
        { id: 'crew-component', path: '/components/crew.html' },
        { id: 'important-component', path: '/components/important.html' },
        { id: 'venue-component', path: '/components/venue.html' },
        { id: 'vibe-component', path: '/components/vibe.html' },
        { id: 'dress-component', path: '/components/dress.html' },
        { id: 'rest-component', path: '/components/rest.html' },
        { id: 'itinerary-component', path: '/components/itinerary.html' },
        { id: 'pack-component', path: '/components/pack.html' },
        { id: 'stay-component', path: '/components/stay.html' },
        { id: 'thankyou-component', path: '/components/thankyou.html' },
        // Modals
        { id: 'image-modal', path: '/components/modals/image-modal.html' },
        { id: 'property-details-modal', path: '/components/modals/property-details-modal.html' },
        { id: 'house-rules-modal', path: '/components/modals/house-rules-modal.html' },
        { id: 'house-manual-modal', path: '/components/modals/house-manual-modal.html' }
    ];

    // Lock scroll during loading to prevent browser from jumping
    document.body.style.overflow = 'hidden';

    // Load all components in parallel
    await Promise.all(
        components.map(component => loadComponent(component.id, component.path))
    );

    // Unlock scroll
    document.body.style.overflow = '';

    // Force scroll to top after components load
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Set a flag that components are loaded
    window.componentsReady = true;

    // Dispatch event when all components are loaded
    document.dispatchEvent(new Event('componentsLoaded'));
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
    loadAllComponents();
}
