// AI Economic Advisor - Simplified Navigation Fix
class SimpleEconomicAdvisor {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('🚀 Initializing Simple AI Economic Advisor...');
        
        try {
            this.setupEventListeners();
            console.log('✅ Simple AI Economic Advisor initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }

    setupEventListeners() {
        console.log('🔧 Setting up navigation event listeners...');
        
        // Navigation buttons
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                console.log('🖱️ Navigation button clicked:', page);
                if (page) {
                    console.log('📍 Navigating to:', page);
                    this.navigateToPage(page);
                }
            });
        });
        
        console.log('✅ Navigation event listeners set up successfully');
    }

    navigateToPage(page) {
        if (!page) return;
        
        console.log('🔄 Navigating to page:', page);
        
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-page="${page}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
            console.log('✅ Active nav item updated');
        }

        // Show/hide pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });
        
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            this.currentPage = page;
            console.log('✅ Page switched to:', page);
        } else {
            console.error('❌ Page not found:', page);
        }
    }
}

// Initialize the simple application
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.simpleEconomicAdvisor = new SimpleEconomicAdvisor();
        console.log('🎉 Simple AI Economic Advisor loaded successfully');
    } catch (error) {
        console.error('💥 Failed to initialize Simple AI Economic Advisor:', error);
    }
});

// Handle errors gracefully
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
});