/**
 * Noor Al-Quran - Main Application JavaScript
 * Handles core functionality and UI interactions
 */

// Global app state
const appState = {
    currentSection: 'quran-reader',
    currentSurah: 1,
    currentPage: 1,
    currentVerse: 1,
    darkMode: false,
    settings: {
        theme: 'light',
        fontSize: 22,
        fontType: 'uthmani',
        mushafType: 'madina',
        showTranslation: true,
        autoPlayNext: true,
        backgroundPlay: true
    }
};

// DOM Elements
const elements = {
    // Main sections
    sidebar: document.querySelector('.sidebar'),
    contentSections: document.querySelectorAll('.content-section'),
    
    // Navigation
    navLinks: document.querySelectorAll('.main-nav a'),
    menuToggle: document.getElementById('menu-toggle'),
    
    // Theme toggle
    themeToggle: document.getElementById('theme-toggle'),
    
    // Settings
    settingsBtn: document.getElementById('settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    closeSettings: document.getElementById('close-settings'),
    saveSettings: document.getElementById('save-settings'),
    resetSettings: document.getElementById('reset-settings'),
    
    // Quran reader
    surahSearch: document.getElementById('surah-search'),
    surahList: document.getElementById('surah-list'),
    currentSurahName: document.getElementById('current-surah-name'),
    currentSurahInfo: document.getElementById('current-surah-info'),
    currentPage: document.getElementById('current-page'),
    totalPages: document.getElementById('total-pages'),
    prevPage: document.getElementById('prev-page'),
    nextPage: document.getElementById('next-page'),
    quranText: document.getElementById('quran-text'),
    
    // Translation
    translationSelect: document.getElementById('translation-select'),
    translationText: document.getElementById('translation-text'),
    
    // Settings form elements
    themeSelect: document.getElementById('theme-select'),
    fontSizeInput: document.getElementById('font-size'),
    fontSizeValue: document.getElementById('font-size-value'),
    fontSelect: document.getElementById('font-select'),
    mushafTypeSelect: document.getElementById('mushaf-type'),
    showTranslationCheckbox: document.getElementById('show-translation'),
    autoPlayNextCheckbox: document.getElementById('auto-play-next'),
    backgroundPlayCheckbox: document.getElementById('background-play')
};

/**
 * Initialize the application
 */
function initApp() {
    // Load saved settings from localStorage
    loadSettings();
    
    // Apply initial settings
    applySettings();
    
    // Populate Surah list
    populateSurahList();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial Quran content
    loadQuranPage(appState.currentPage);
    
    // Update UI based on current state
    updateUI();
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    const savedSettings = localStorage.getItem('noorAlQuranSettings');
    if (savedSettings) {
        appState.settings = JSON.parse(savedSettings);
    }
    
    // Apply dark mode if needed
    if (appState.settings.theme === 'dark' || 
        (appState.settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        appState.darkMode = true;
    }
}

/**
 * Apply current settings to the UI
 */
function applySettings() {
    // Apply dark mode
    if (appState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Apply font size to Quran text
    document.documentElement.style.setProperty('--font-size-quran', `${appState.settings.fontSize}px`);
    
    // Update settings form values
    elements.themeSelect.value = appState.settings.theme;
    elements.fontSizeInput.value = appState.settings.fontSize;
    elements.fontSizeValue.textContent = `${appState.settings.fontSize}px`;
    elements.fontSelect.value = appState.settings.fontType;
    elements.mushafTypeSelect.value = appState.settings.mushafType;
    elements.showTranslationCheckbox.checked = appState.settings.showTranslation;
    elements.autoPlayNextCheckbox.checked = appState.settings.autoPlayNext;
    elements.backgroundPlayCheckbox.checked = appState.settings.backgroundPlay;
    
    // Show/hide translation panel based on settings
    const translationPanel = document.getElementById('translation-panel');
    if (appState.settings.showTranslation) {
        translationPanel.classList.remove('hidden');
    } else {
        translationPanel.classList.add('hidden');
    }
}

/**
 * Save current settings to localStorage
 */
function saveSettings() {
    localStorage.setItem('noorAlQuranSettings', JSON.stringify(appState.settings));
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Navigation menu links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('href').substring(1);
            changeSection(targetSection);
        });
    });
    
    // Mobile menu toggle
    elements.menuToggle.addEventListener('click', () => {
        elements.sidebar.classList.toggle('active');
    });
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleDarkMode);
    
    // Settings modal
    elements.settingsBtn.addEventListener('click', () => {
        elements.settingsModal.style.display = 'flex';
    });
    
    elements.closeSettings.addEventListener('click', () => {
        elements.settingsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) {
            elements.settingsModal.style.display = 'none';
        }
    });
    
    // Settings form interactions
    elements.fontSizeInput.addEventListener('input', () => {
        const fontSize = elements.fontSizeInput.value;
        elements.fontSizeValue.textContent = `${fontSize}px`;
        document.documentElement.style.setProperty('--font-size-quran', `${fontSize}px`);
    });
    
    // Save settings button
    elements.saveSettings.addEventListener('click', () => {
        // Update settings from form values
        appState.settings.theme = elements.themeSelect.value;
        appState.settings.fontSize = parseInt(elements.fontSizeInput.value);
        appState.settings.fontType = elements.fontSelect.value;
        appState.settings.mushafType = elements.mushafTypeSelect.value;
        appState.settings.showTranslation = elements.showTranslationCheckbox.checked;
        appState.settings.autoPlayNext = elements.autoPlayNextCheckbox.checked;
        appState.settings.backgroundPlay = elements.backgroundPlayCheckbox.checked;
        
        // Apply and save settings
        applySettings();
        saveSettings();
        
        // Close modal
        elements.settingsModal.style.display = 'none';
    });
    
    // Reset settings button
    elements.resetSettings.addEventListener('click', () => {
        // Reset to default settings
        appState.settings = {
            theme: 'light',
            fontSize: 22,
            fontType: 'uthmani',
            mushafType: 'madina',
            showTranslation: true,
            autoPlayNext: true,
            backgroundPlay: true
        };
        
        // Apply and save settings
        applySettings();
        saveSettings();
    });
    
    // Quran navigation
    elements.prevPage.addEventListener('click', () => {
        if (appState.currentPage > 1) {
            loadQuranPage(appState.currentPage - 1);
        }
    });
    
    elements.nextPage.addEventListener('click', () => {
        if (appState.currentPage < 604) {
            loadQuranPage(appState.currentPage + 1);
        }
    });
    
    // Surah search
    elements.surahSearch.addEventListener('input', () => {
        const searchTerm = elements.surahSearch.value.toLowerCase();
        filterSurahList(searchTerm);
    });
    
    // Translation language change
    elements.translationSelect.addEventListener('change', () => {
        loadTranslation(appState.currentSurah, elements.translationSelect.value);
    });
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    appState.darkMode = !appState.darkMode;
    
    if (appState.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        appState.settings.theme = 'dark';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        appState.settings.theme = 'light';
    }
    
    saveSettings();
}

/**
 * Change active section
 * @param {string} sectionId - ID of the section to activate
 */
function changeSection(sectionId) {
    // Update active section in state
    appState.currentSection = sectionId;
    
    // Update UI
    updateUI();
    
    // Close mobile menu if open
    elements.sidebar.classList.remove('active');
}

/**
 * Update UI based on current state
 */
function updateUI() {
    // Update active section
    elements.contentSections.forEach(section => {
        if (section.id === appState.currentSection) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
    
    // Update active navigation link
    elements.navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href').substring(1);
        if (linkTarget === appState.currentSection) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

/**
 * Populate the Surah list
 */
function populateSurahList() {
    // Clear existing list
    elements.surahList.innerHTML = '';
    
    // Add each surah to the list
    quranData.surahs.forEach(surah => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="surah-name">${surah.number}. ${surah.name}</div>
            <div class="surah-info">${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} - ${surah.numberOfAyahs} آيات</div>
        `;
        
        // Add click event to load the surah
        li.addEventListener('click', () => {
            loadSurah(surah.number);
        });
        
        elements.surahList.appendChild(li);
    });
}

/**
 * Filter the Surah list based on search term
 * @param {string} searchTerm - Search term to filter by
 */
function filterSurahList(searchTerm) {
    const surahItems = elements.surahList.querySelectorAll('li');
    
    surahItems.forEach(item => {
        const surahName = item.querySelector('.surah-name').textContent.toLowerCase();
        if (surahName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Load a specific Surah
 * @param {number} surahNumber - Number of the Surah to load
 */
function loadSurah(surahNumber) {
    appState.currentSurah = surahNumber;
    
    // Find the page for this surah
    const surahData = quranData.surahs.find(s => s.number === surahNumber);
    if (surahData) {
        // Update surah info
        elements.currentSurahName.textContent = `سورة ${surahData.name}`;
        elements.currentSurahInfo.textContent = `${surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} - ${surahData.numberOfAyahs} آيات`;
        
        // Load the page containing this surah
        loadQuranPage(surahData.page);
        
        // Load translation
        loadTranslation(surahNumber, elements.translationSelect.value);
    }
}

/**
 * Load a specific page of the Quran
 * @param {number} pageNumber - Page number to load
 */
function loadQuranPage(pageNumber) {
    appState.currentPage = pageNumber;
    
    // Update page display
    elements.currentPage.textContent = pageNumber;
    
    // Get page data
    const pageData = quranData.pages[pageNumber];
    if (pageData) {
        // Update Quran text
        renderQuranPage(pageData);
        
        // Update current surah info if needed
        if (pageData.surah !== appState.currentSurah) {
            appState.currentSurah = pageData.surah;
            const surahData = quranData.surahs.find(s => s.number === pageData.surah);
            if (surahData) {
                elements.currentSurahName.textContent = `سورة ${surahData.name}`;
                elements.currentSurahInfo.textContent = `${surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} - ${surahData.numberOfAyahs} آيات`;
            }
        }
        
        // Load translation
        loadTranslation(appState.currentSurah, elements.translationSelect.value);
    }
}

/**
 * Render Quran page content
 * @param {Object} pageData - Data for the page to render
 */
function renderQuranPage(pageData) {
    // Clear existing content
    elements.quranText.innerHTML = '';
    
    // Add bismillah if needed (except for Surah 9)
    if (pageData.surah !== 9 && pageData.verses[0].verse === 1) {
        const bismillah = document.createElement('div');
        bismillah.className = 'bismillah';
        bismillah.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
        elements.quranText.appendChild(bismillah);
    }
    
    // Add each verse
    pageData.verses.forEach(verseData => {
        const verseElement = document.createElement('div');
        verseElement.className = 'verse';
        verseElement.innerHTML = `
            <span class="verse-number">${verseData.verse}</span>
            <span class="verse-text">${verseData.text}</span>
        `;
        
        // Add click event to play audio
        verseElement.addEventListener('click', () => {
            playVerseAudio(pageData.surah, verseData.verse);
        });
        
        elements.quranText.appendChild(verseElement);
    });
}

/**
 * Load translation for a Surah
 * @param {number} surahNumber - Number of the Surah
 * @param {string} language - Language code for translation
 */
function loadTranslation(surahNumber, language) {
    // In a real app, this would fetch translation data from an API or local data
    // For now, we'll use placeholder text
    
    const translationData = getTranslationData(surahNumber, language);
    renderTranslation(translationData);
}

/**
 * Get translation data for a Surah
 * @param {number} surahNumber - Number of the Surah
 * @param {string} language - Language code for translation
 * @returns {Object} Translation data
 */
function getTranslationData(surahNumber, language) {
    // This would normally fetch from an API or local data
    // For now, return placeholder data
    return {
        surah: surahNumber,
        language: language,
        verses: [
            { verse: 1, text: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
            { verse: 2, text: "[All] praise is [due] to Allah, Lord of the worlds -" },
            { verse: 3, text: "The Entirely Merciful, the Especially Merciful," },
            { verse: 4, text: "Sovereign of the Day of Recompense." },
            { verse: 5, text: "It is You we worship and You we ask for help." },
            { verse: 6, text: "Guide us to the straight path -" },
            { verse: 7, text: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }
        ]
    };
}

/**
 * Render translation content
 * @param {Object} translationData - Translation data to render
 */
function renderTranslation(transla<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>