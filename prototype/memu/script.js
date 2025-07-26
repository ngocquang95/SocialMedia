class SpectacularMenu {
    constructor() {
        this.init();
        this.bindEvents();
        this.loadTheme();
    }

    init() {
        // Cache DOM elements
        this.header = document.querySelector('.header');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.themeToggle = document.querySelector('.theme-toggle');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.submenus = document.querySelectorAll('.dropdown-submenu');
        
        // State
        this.isMobileMenuOpen = false;
        this.currentTheme = 'light';
        
        // Add scroll effect
        this.addScrollEffect();
    }

    bindEvents() {
        // Mobile menu toggle
        this.mobileToggle?.addEventListener('click', () => this.toggleMobileMenu());
        this.mobileOverlay?.addEventListener('click', () => this.closeMobileMenu());
        
        // Theme toggle
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Dropdown handling for mobile
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle?.addEventListener('click', (e) => this.handleDropdownClick(e, dropdown));
        });
        
        // Submenu handling for mobile
        this.submenus.forEach(submenu => {
            const toggle = submenu.querySelector('.submenu-toggle');
            toggle?.addEventListener('click', (e) => this.handleSubmenuClick(e, submenu));
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        // Scroll event for header effect
        window.addEventListener('scroll', () => this.handleScroll());
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        this.mobileToggle.classList.toggle('active', this.isMobileMenuOpen);
        this.navMenu.classList.toggle('active', this.isMobileMenuOpen);
        this.mobileOverlay.classList.toggle('active', this.isMobileMenuOpen);
        
        // Update ARIA attributes
        this.mobileToggle.setAttribute('aria-expanded', this.isMobileMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
        
        // Focus management
        if (this.isMobileMenuOpen) {
            this.navMenu.querySelector('.nav-link')?.focus();
        }
    }

    closeMobileMenu() {
        if (!this.isMobileMenuOpen) return;
        
        this.isMobileMenuOpen = false;
        this.mobileToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        
        // Update ARIA attributes
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Close all dropdowns
        this.closeAllDropdowns();
    }

    handleDropdownClick(e, dropdown) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns
            this.dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                    d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active', !isActive);
            e.target.setAttribute('aria-expanded', !isActive);
            
            // Animate dropdown icon
            const icon = e.target.querySelector('.dropdown-icon');
            if (icon) {
                icon.style.transform = !isActive ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
    }

    handleSubmenuClick(e, submenu) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            
            const isActive = submenu.classList.contains('active');
            
            // Close all other submenus in the same dropdown
            const parentDropdown = submenu.closest('.dropdown');
            const siblingSubmenus = parentDropdown.querySelectorAll('.dropdown-submenu');
            siblingSubmenus.forEach(s => {
                if (s !== submenu) {
                    s.classList.remove('active');
                }
            });
            
            // Toggle current submenu
            submenu.classList.toggle('active', !isActive);
            
            // Animate submenu icon
            const icon = e.target.querySelector('.submenu-icon');
            if (icon) {
                icon.style.transform = !isActive ? 'rotate(90deg)' : 'rotate(0deg)';
            }
        }
    }

    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle?.setAttribute('aria-expanded', 'false');
            
            const icon = toggle?.querySelector('.dropdown-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        });
        
        this.submenus.forEach(submenu => {
            submenu.classList.remove('active');
            
            const icon = submenu.querySelector('.submenu-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    }

    handleOutsideClick(e) {
        if (window.innerWidth > 768) return;
        
        const isClickInsideNav = e.target.closest('.nav-menu');
        const isClickOnToggle = e.target.closest('.mobile-toggle');
        
        if (!isClickInsideNav && !isClickOnToggle && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    handleKeyboardNavigation(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && this.isMobileMenuOpen) {
            this.closeMobileMenu();
            this.mobileToggle.focus();
        }
        
        // Enter/Space on dropdown toggles
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('dropdown-toggle')) {
            e.preventDefault();
            const dropdown = e.target.closest('.dropdown');
            this.handleDropdownClick(e, dropdown);
        }
        
        // Enter/Space on submenu toggles
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('submenu-toggle')) {
            e.preventDefault();
            const submenu = e.target.closest('.dropdown-submenu');
            this.handleSubmenuClick(e, submenu);
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Save to localStorage
        localStorage.setItem('theme', this.currentTheme);
        
        // Add animation class
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
        
        // Announce theme change to screen readers
        const announcement = this.currentTheme === 'dark' ? 'Chế độ tối đã được bật' : 'Chế độ sáng đã được bật';
        this.announceToScreenReader(announcement);
    }

    loadTheme() {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', this.currentTheme);
            }
        });
    }

    addScrollEffect() {
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                this.header.style.background = this.currentTheme === 'dark' 
                    ? 'rgba(15, 23, 42, 0.98)' 
                    : 'rgba(255, 255, 255, 0.98)';
                this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                this.header.style.background = this.currentTheme === 'dark' 
                    ? 'rgba(15, 23, 42, 0.95)' 
                    : 'rgba(255, 255, 255, 0.95)';
                this.header.style.boxShadow = 'none';
            }
            
            // Hide/show header on scroll (optional)
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        };
        
        // Throttle scroll events
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        // This method is called by the scroll event listener
        // Additional scroll-based functionality can be added here
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Public methods for external control
    openMobileMenu() {
        if (!this.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    }

    // Utility method to add custom animations
    addCustomAnimation(element, animationClass, duration = 300) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
}

// Initialize the menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.spectacularMenu = new SpectacularMenu();
});

// Add some utility CSS classes for screen readers
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpectacularMenu;
}