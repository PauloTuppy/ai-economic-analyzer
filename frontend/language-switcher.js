// Language Switcher for AI Economic Advisor
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.availableLanguages = {
            'en': {
                name: 'English',
                flag: '🇺🇸',
                file: 'index-en.html',
                currency: 'USD'
            },
            'pt': {
                name: 'Português',
                flag: '🇧🇷',
                file: 'index.html',
                currency: 'BRL'
            }
        };
        this.init();
    }

    detectLanguage() {
        // Check URL for language parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.availableLanguages[urlLang]) {
            return urlLang;
        }

        // Check localStorage
        const savedLang = localStorage.getItem('ai-advisor-language');
        if (savedLang && this.availableLanguages[savedLang]) {
            return savedLang;
        }

        // Check browser language
        const browserLang = navigator.language.split('-')[0];
        if (this.availableLanguages[browserLang]) {
            return browserLang;
        }

        // Default to English
        return 'en';
    }

    init() {
        this.createLanguageSwitcher();
        this.redirectIfNeeded();
    }

    createLanguageSwitcher() {
        // Create language switcher UI
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <div class="language-dropdown">
                <button class="language-btn" id="languageBtn">
                    <span class="flag">${this.availableLanguages[this.currentLanguage].flag}</span>
                    <span class="name">${this.availableLanguages[this.currentLanguage].name}</span>
                    <span class="arrow">▼</span>
                </button>
                <div class="language-menu" id="languageMenu">
                    ${Object.entries(this.availableLanguages).map(([code, lang]) => `
                        <button class="language-option ${code === this.currentLanguage ? 'active' : ''}" 
                                data-lang="${code}">
                            <span class="flag">${lang.flag}</span>
                            <span class="name">${lang.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .language-switcher {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }

            .language-dropdown {
                position: relative;
            }

            .language-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-base);
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .language-btn:hover {
                background: var(--color-secondary);
            }

            .language-menu {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 4px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-lg);
                min-width: 150px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.2s ease;
            }

            .language-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .language-option {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                padding: 8px 12px;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s ease;
            }

            .language-option:hover {
                background: var(--color-secondary);
            }

            .language-option.active {
                background: var(--color-primary);
                color: var(--color-btn-primary-text);
            }

            .flag {
                font-size: 16px;
            }

            .arrow {
                font-size: 10px;
                transition: transform 0.2s ease;
            }

            .language-dropdown.open .arrow {
                transform: rotate(180deg);
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(switcher);

        // Add event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const languageBtn = document.getElementById('languageBtn');
        const languageMenu = document.getElementById('languageMenu');
        const dropdown = document.querySelector('.language-dropdown');

        if (languageBtn && languageMenu) {
            languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
                languageMenu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.remove('open');
                languageMenu.classList.remove('show');
            });

            // Language selection
            document.querySelectorAll('.language-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const selectedLang = e.currentTarget.dataset.lang;
                    this.switchLanguage(selectedLang);
                });
            });
        }
    }

    switchLanguage(langCode) {
        if (!this.availableLanguages[langCode]) return;

        // Save language preference
        localStorage.setItem('ai-advisor-language', langCode);

        // Redirect to appropriate version
        const targetFile = this.availableLanguages[langCode].file;
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';

        if (currentFile !== targetFile) {
            window.location.href = targetFile + '?lang=' + langCode;
        }
    }

    redirectIfNeeded() {
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        const expectedFile = this.availableLanguages[this.currentLanguage].file;

        // Only redirect if we're on the wrong file for the detected language
        if (currentFile !== expectedFile) {
            // Don't redirect immediately to avoid loops, just update the switcher
            this.currentLanguage = currentFile === 'index-en.html' ? 'en' : 'pt';
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getLanguageInfo(langCode = null) {
        const code = langCode || this.currentLanguage;
        return this.availableLanguages[code];
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
}