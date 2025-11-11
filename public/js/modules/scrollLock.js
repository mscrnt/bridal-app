// ===========================
// Scroll Lock Utility
// ===========================

function createScrollLock(name) {
    return {
        name: name,
        scrollPos: 0,
        paddingRight: 0,
        isLocked: false,

        getScrollbarWidth() {
            return window.innerWidth - document.documentElement.clientWidth;
        },

        lock() {
            this.scrollPos = window.pageYOffset || document.documentElement.scrollTop;
            const scrollbarWidth = this.getScrollbarWidth();

            this.paddingRight = parseInt(getComputedStyle(document.body).paddingRight) || 0;

            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${this.paddingRight + scrollbarWidth}px`;
            }

            const html = document.documentElement;
            html.style.overflow = 'hidden';
            html.style.height = '100%';

            document.body.style.setProperty('overflow', 'hidden', 'important');
            document.body.style.setProperty('overflow-x', 'hidden', 'important');
            document.body.style.setProperty('overflow-y', 'hidden', 'important');

            this.isLocked = true;
        },

        unlock() {
            if (!this.isLocked) return;

            const scrollY = this.scrollPos;
            const html = document.documentElement;

            const originalBehavior = html.style.scrollBehavior;
            html.style.scrollBehavior = 'auto';

            html.style.overflow = '';
            html.style.height = '';

            document.body.style.overflow = '';
            document.body.style.overflowX = '';
            document.body.style.overflowY = '';
            document.body.style.paddingRight = this.paddingRight ? `${this.paddingRight}px` : '';

            requestAnimationFrame(() => {
                html.style.scrollBehavior = originalBehavior;
            });

            this.isLocked = false;
        }
    };
}

// Create and export scroll lock instances
export const NavScrollLock = createScrollLock('Nav');
export const ModalScrollLock = createScrollLock('Modal');
