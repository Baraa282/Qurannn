/**
 * Noor Al-Quran - Settings Module
 * Handles settings and preferences
 */

// Settings Module
const settingsModule = (function() {
    // Default settings
    const defaultSettings = {
        theme: 'light',
        fontSize: 22,
        fontType: 'uthmani',
        mushafType: 'madina',
        showTranslation: true,
        autoPlayNext: true,
        backgroundPlay: true
    };
    
    // DOM Elements
    const elements = {
        themeSelect: document.getElementById('theme-select'),
        fontSizeInput: document.getElementById('font-size'),
        fontSizeValue: document.getElementById('font-size-value'),
        fontSelect: document.getElementById('font-select'),
        mushafTypeSelect: document.getElementById('mushaf-type'),
        showTranslationCheckbox: document.getElementById('show-translation'),
        autoPlayNextCheckbox: document.getElementById('auto-play-next'),
        backgroundPlayCheckbox: document.getElementById('background-play'),
        saveSettingsBtn: document.getElementById('save-settings'),
        resetSettingsBtn: document.getElementById('reset-settings')
    };
    
    /**
     * Initialize the settings module
     */
    function init() {
        // Load settings from localStorage
        loadSettings();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update UI with current settings
        updateSettingsUI();
    }
    
    /**
     * Set up event listeners for settings module
     */
    function setupEventListeners() {
        // Font size slider
        elements.fontSizeInput.addEventListener('input', function() {
            const fontSize = this.value;
            elements.fontSizeValue.textContent = `${fontSize}px`;
            
            // Update font size in real-time
            document.documentElement.style.setProperty('--font-size-quran', `${fontSize}px`);
        });
        
        // Save settings button
        elements.saveSettingsBtn.addEventListener('click', saveSettings);
        
        // Reset settings button
        elements.resetSettingsBtn.addEventListener('click', resetSettings);
    }
    
    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem('noorAlQuranSettings');
        
        if (savedSettings) {
            // Parse saved settings
            const settings = JSON.parse(savedSettings);
            
            // Update app state with saved settings
            if (typeof appState !== 'undefined') {
                appState.settings = settings;
                
                // Apply dark mode if needed
                if (settings.theme === 'dark' || 
                    (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    appState.darkMode = true;
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    appState.darkMode = false;
                    document.documentElement.setAttribute('data-theme', 'light');
                }
            }
        }
    }
    
    /**
     * Update settings UI with current settings
     */
    function updateSettingsUI() {
        // Get current settings
        const settings = typeof appState !== 'undefined' ? appState.settings : defaultSettings;
        
        // Update form elements
        elements.themeSelect.value = settings.theme;
        elements.fontSizeInput.value = settings.fontSize;
        elements.fontSizeValue.textContent = `${settings.fontSize}px`;
        elements.fontSelect.value = settings.fontType;
        elements.mushafTypeSelect.value = settings.mushafType;
        elements.showTranslationCheckbox.checked = settings.showTranslation;
        elements.autoPlayNextCheckbox.checked = settings.autoPlayNext;
        elements.backgroundPlayCheckbox.checked = settings.backgroundPlay;
    }
    
    /**
     * Save settings
     */
    function saveSettings() {
        // Get settings from form
        const settings = {
            theme: elements.themeSelect.value,
            fontSize: parseInt(elements.fontSizeInput.value),
            fontType: elements.fontSelect.value,
            mushafType: elements.mushafTypeSelect.value,
            showTranslation: elements.showTranslationCheckbox.checked,
            autoPlayNext: elements.autoPlayNextCheckbox.checked,
            backgroundPlay: elements.backgroundPlayCheckbox.checked
        };
        
        // Save to localStorage
        localStorage.setItem('noorAlQuranSettings', JSON.stringify(settings));
        
        // Update app state
        if (typeof appState !== 'undefined') {
            appState.settings = settings;
            
            // Apply theme
            if (settings.theme === 'dark' || 
                (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                appState.darkMode = true;
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                appState.darkMode = false;
                document.documentElement.setAttribute('data-theme', 'light');
            }
            
            // Apply other settings
            applySettings(settings);
        }
        
        // Close settings modal
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.style.display = 'none';
        }
    }
    
    /**
     * Reset settings to defaults
     */
    function resetSettings() {
        // Reset to default settings
        const settings = { ...defaultSettings };
        
        // Update form elements
        elements.themeSelect.value = settings.theme;
        elements.fontSizeInput.value = settings.fontSize;
        elements.fontSizeValue.textContent = `${settings.fontSize}px`;
        elements.fontSelect.value = settings.fontType;
        elements.mushafTypeSelect.value = settings.mushafType;
        elements.showTranslationCheckbox.checked = settings.showTranslation;
        elements.autoPlayNextCheckbox.checked = settings.autoPlayNext;
        elements.backgroundPlayCheckbox.checked = settings.backgroundPlay;
        
        // Save to localStorage
        localStorage.setItem('noorAlQuranSettings', JSON.stringify(settings));
        
        // Update app state
        if (typeof appState !== 'undefined') {
            appState.settings = settings;
            
            // Apply theme
            if (settings.theme === 'light') {
                appState.darkMode = false;
                document.documentElement.setAttribute('data-theme', 'light');
            }
            
            // Apply other settings
            applySettings(settings);
        }
    }
    
    /**
     * Apply settings to the UI
     * @param {Object} settings - Settings to apply
     */
    function applySettings(settings) {
        // Apply font size
        document.documentElement.style.setProperty('--font-size-quran', `${settings.fontSize}px`);
        
        // Apply font type
        document.body.style.fontFamily = getFontFamily(settings.fontType);
        
        // Show/hide translation panel
        const translationPanel = document.getElementById('translation-panel');
        if (translationPanel) {
            if (settings.showTranslation) {
                translationPanel.classList.remove('hidden');
            } else {
                translationPanel.classList.add('hidden');
            }
        }
    }
    
    /**
     * Get font family based on font type
     * @param {string} fontType - Font type
     * @returns {string} Font family
     */
    function getFontFamily(fontType) {
        switch (fontType) {
            case 'uthmani':
                return "'Scheherazade New', serif";
            case 'amiri':
                return "'Amiri', serif";
            case 'scheherazade':
                return "'Scheherazade New', serif";
            default:
                return "'Scheherazade New', serif";
        }
    }
    
    // Public API
    return {
        init: init,
        loadSettings: loadSettings,
        saveSettings: saveSettings,
        resetSettings: resetSettings
    };
})();

// Initialize settings module when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    settingsModule.init();
});
