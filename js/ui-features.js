/**
 * Noor Al-Quran - UI Features Enhancement
 * Implements additional user interface features and enhancements
 */

// UI Features Module
const uiFeatures = (function() {
    // DOM Elements
    const elements = {
        // Theme toggle
        themeToggle: document.getElementById('theme-toggle'),
        
        // Font size controls (will be created dynamically)
        fontSizeControls: null,
        
        // Background color options (will be created dynamically)
        bgColorOptions: null,
        
        // Verse sharing
        verseShareButtons: null,
        
        // Settings panel elements
        settingsBtn: document.getElementById('settings-btn'),
        settingsModal: document.getElementById('settings-modal')
    };
    
    /**
     * Initialize UI features
     */
    function init() {
        // Create and add UI elements
        createFontSizeControls();
        createBackgroundColorOptions();
        enhanceVerseSharing();
        
        // Set up event listeners
        setupEventListeners();
        
        // Apply initial settings
        applyInitialSettings();
    }
    
    /**
     * Create font size controls
     */
    function createFontSizeControls() {
        // Create font size controls container
        const fontSizeControls = document.createElement('div');
        fontSizeControls.className = 'font-size-controls';
        fontSizeControls.innerHTML = `
            <button class="font-size-btn decrease" title="تصغير الخط">
                <i class="fas fa-minus"></i>
            </button>
            <span class="font-size-value">22px</span>
            <button class="font-size-btn increase" title="تكبير الخط">
                <i class="fas fa-plus"></i>
            </button>
        `;
        
        // Add to reader controls
        const readerControls = document.querySelector('.reader-controls');
        if (readerControls) {
            readerControls.appendChild(fontSizeControls);
            elements.fontSizeControls = fontSizeControls;
        }
    }
    
    /**
     * Create background color options
     */
    function createBackgroundColorOptions() {
        // Create background color options container
        const bgColorOptions = document.createElement('div');
        bgColorOptions.className = 'bg-color-options';
        bgColorOptions.innerHTML = `
            <span class="bg-color-label">الخلفية:</span>
            <button class="bg-color-btn light" data-color="light" title="خلفية فاتحة"></button>
            <button class="bg-color-btn sepia" data-color="sepia" title="خلفية بيج"></button>
            <button class="bg-color-btn dark" data-color="dark" title="خلفية داكنة"></button>
        `;
        
        // Add to settings section
        const appearanceSection = document.querySelector('.settings-section:first-child');
        if (appearanceSection) {
            appearanceSection.appendChild(bgColorOptions);
            elements.bgColorOptions = bgColorOptions;
        }
    }
    
    /**
     * Enhance verse sharing functionality
     */
    function enhanceVerseSharing() {
        // Add share buttons to verses
        const verses = document.querySelectorAll('.verse');
        verses.forEach(verse => {
            // Create share button
            const shareBtn = document.createElement('button');
            shareBtn.className = 'verse-share-btn';
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
            shareBtn.title = 'مشاركة الآية';
            
            // Add click event
            shareBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent verse click event
                
                // Get verse text
                const verseText = verse.querySelector('.verse-text').textContent;
                const verseNumber = verse.querySelector('.verse-number').textContent;
                
                // Get surah name
                const surahName = document.getElementById('current-surah-name').textContent;
                
                // Share verse
                shareVerse(surahName, verseNumber, verseText);
            });
            
            // Add to verse
            verse.appendChild(shareBtn);
        });
        
        // Store reference to share buttons
        elements.verseShareButtons = document.querySelectorAll('.verse-share-btn');
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Theme toggle
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Font size controls
        if (elements.fontSizeControls) {
            const decreaseBtn = elements.fontSizeControls.querySelector('.decrease');
            const increaseBtn = elements.fontSizeControls.querySelector('.increase');
            
            decreaseBtn.addEventListener('click', decreaseFontSize);
            increaseBtn.addEventListener('click', increaseFontSize);
        }
        
        // Background color options
        if (elements.bgColorOptions) {
            const colorBtns = elements.bgColorOptions.querySelectorAll('.bg-color-btn');
            colorBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const color = this.getAttribute('data-color');
                    changeBackgroundColor(color);
                });
            });
        }
    }
    
    /**
     * Apply initial settings
     */
    function applyInitialSettings() {
        // Get current settings
        const settings = localStorage.getItem('noorAlQuranSettings');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            
            // Apply font size
            if (parsedSettings.fontSize) {
                updateFontSizeDisplay(parsedSettings.fontSize);
            }
            
            // Apply background color
            if (parsedSettings.backgroundColor) {
                changeBackgroundColor(parsedSettings.backgroundColor);
            }
        }
    }
    
    /**
     * Toggle theme between light and dark
     */
    function toggleTheme() {
        // Get current theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        
        // Toggle theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update theme toggle icon
        if (elements.themeToggle) {
            elements.themeToggle.innerHTML = newTheme === 'light' ? 
                '<i class="fas fa-moon"></i>' : 
                '<i class="fas fa-sun"></i>';
        }
        
        // Update settings
        updateSettings({ theme: newTheme });
    }
    
    /**
     * Decrease font size
     */
    function decreaseFontSize() {
        // Get current font size
        const currentSize = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--font-size-quran')
            .replace('px', ''));
        
        // Calculate new size (minimum 16px)
        const newSize = Math.max(16, currentSize - 2);
        
        // Apply new size
        document.documentElement.style.setProperty('--font-size-quran', `${newSize}px`);
        
        // Update display
        updateFontSizeDisplay(newSize);
        
        // Update settings
        updateSettings({ fontSize: newSize });
    }
    
    /**
     * Increase font size
     */
    function increaseFontSize() {
        // Get current font size
        const currentSize = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--font-size-quran')
            .replace('px', ''));
        
        // Calculate new size (maximum 36px)
        const newSize = Math.min(36, currentSize + 2);
        
        // Apply new size
        document.documentElement.style.setProperty('--font-size-quran', `${newSize}px`);
        
        // Update display
        updateFontSizeDisplay(newSize);
        
        // Update settings
        updateSettings({ fontSize: newSize });
    }
    
    /**
     * Update font size display
     * @param {number} size - Font size in pixels
     */
    function updateFontSizeDisplay(size) {
        // Update font size value display
        if (elements.fontSizeControls) {
            const fontSizeValue = elements.fontSizeControls.querySelector('.font-size-value');
            if (fontSizeValue) {
                fontSizeValue.textContent = `${size}px`;
            }
        }
        
        // Update settings form
        const fontSizeInput = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        
        if (fontSizeInput) {
            fontSizeInput.value = size;
        }
        
        if (fontSizeValue) {
            fontSizeValue.textContent = `${size}px`;
        }
    }
    
    /**
     * Change background color
     * @param {string} color - Color theme ('light', 'sepia', or 'dark')
     */
    function changeBackgroundColor(color) {
        // Remove all color classes
        document.body.classList.remove('bg-light', 'bg-sepia', 'bg-dark');
        
        // Add selected color class
        document.body.classList.add(`bg-${color}`);
        
        // Update active button
        if (elements.bgColorOptions) {
            const colorBtns = elements.bgColorOptions.querySelectorAll('.bg-color-btn');
            colorBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-color') === color) {
                    btn.classList.add('active');
                }
            });
        }
        
        // If color is dark, also enable dark theme
        if (color === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (elements.themeToggle) {
                elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else if (document.documentElement.getAttribute('data-theme') === 'dark') {
            // If switching from dark to light/sepia, update theme only if it was dark
            document.documentElement.setAttribute('data-theme', 'light');
            if (elements.themeToggle) {
                elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
        
        // Update settings
        updateSettings({ backgroundColor: color });
    }
    
    /**
     * Share verse
     * @param {string} surahName - Surah name
     * @param {string} verseNumber - Verse number
     * @param {string} verseText - Verse text
     */
    function shareVerse(surahName, verseNumber, verseText) {
        // Create share text
        const shareText = `${verseText}\n\n${surahName} - الآية ${verseNumber}\n\nمشاركة من تطبيق نور القرآن`;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: `${surahName} - الآية ${verseNumber}`,
                text: shareText
            })
            .catch(error => {
                console.error('Error sharing:', error);
                fallbackShare(shareText);
            });
        } else {
            fallbackShare(shareText);
        }
    }
    
    /**
     * Fallback share method
     * @param {string} text - Text to share
     */
    function fallbackShare(text) {
        // Create a temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        
        // Select and copy text
        textarea.select();
        document.execCommand('copy');
        
        // Remove textarea
        document.body.removeChild(textarea);
        
        // Show confirmation
        showToast('تم نسخ الآية إلى الحافظة');
    }
    
    /**
     * Show toast notification
     * @param {string} message - Message to display
     */
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            document.body.appendChild(toast);
            
            // Add toast styles
            const style = document.createElement('style');
            style.textContent = `
                #toast {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                #toast.show {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set message
        toast.textContent = message;
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    /**
     * Update settings
     * @param {Object} newSettings - New settings to apply
     */
    function updateSettings(newSettings) {
        // Get current settings
        const settingsJson = localStorage.getItem('noorAlQuranSettings');
        const settings = settingsJson ? JSON.parse(settingsJson) : {};
        
        // Update settings
        const updatedSettings = { ...settings, ...newSettings };
        
        // Save to localStorage
        localStorage.setItem('noorAlQuranSettings', JSON.stringify(updatedSettings));
        
        // Update app state if available
        if (typeof appState !== 'undefined' && appState.settings) {
            appState.settings = { ...appState.settings, ...newSettings };
        }
    }
    
    // Public API
    return {
        init: init,
        toggleTheme: toggleTheme,
        decreaseFontSize: decreaseFontSize,
        increaseFontSize: increaseFontSize,
        changeBackgroundColor: changeBackgroundColor,
        shareVerse: shareVerse
    };
})();

// Initialize UI features when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI features after a short delay to ensure other modules are loaded
    setTimeout(() => {
        uiFeatures.init();
    }, 1500);
    
    // Add background color styles
    const style = document.createElement('style');
    style.textContent = `
        body.bg-light {
            --bg-primary: #ffffff;
            --bg-secondary: #f5f5f5;
            --bg-tertiary: #e0e0e0;
            --text-primary: #212121;
            --text-secondary: #757575;
            --quran-text-color: #000000;
        }
        
        body.bg-sepia {
            --bg-primary: #f8f3e9;
            --bg-secondary: #f0e8d9;
            --bg-tertiary: #e8dcc9;
            --text-primary: #5f4b32;
            --text-secondary: #7d6545;
            --quran-text-color: #4b3c27;
        }
        
        body.bg-dark {
            --bg-primary: #121212;
            --bg-secondary: #1e1e1e;
            --bg-tertiary: #2d2d2d;
            --text-primary: #f5f5f5;
            --text-secondary: #b0b0b0;
            --quran-text-color: #f5f5f5;
        }
        
        .font-size-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: 20px;
        }
        
        .font-size-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>