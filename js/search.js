/**
 * Noor Al-Quran - Search Module
 * Handles search functionality
 */

// Search Module
const searchModule = (function() {
    // Private variables
    let _searchResults = [];
    let _currentSearchQuery = '';
    let _currentSearchScope = 'all';
    let _currentSearchType = 'word';
    
    // DOM Elements
    const elements = {
        searchInput: document.getElementById('quran-search-input'),
        searchBtn: document.getElementById('search-btn'),
        searchScope: document.getElementById('search-scope'),
        searchType: document.getElementById('search-type'),
        resultsCount: document.getElementById('results-count'),
        resultsList: document.getElementById('results-list')
    };
    
    /**
     * Initialize the search module
     */
    function init() {
        // Set up event listeners
        setupEventListeners();
    }
    
    /**
     * Set up event listeners for search module
     */
    function setupEventListeners() {
        // Search button
        elements.searchBtn.addEventListener('click', performSearch);
        
        // Search input (enter key)
        elements.searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Search filters
        elements.searchScope.addEventListener('change', function() {
            _currentSearchScope = this.value;
            if (_searchResults.length > 0) {
                performSearch();
            }
        });
        
        elements.searchType.addEventListener('change', function() {
            _currentSearchType = this.value;
            if (_searchResults.length > 0) {
                performSearch();
            }
        });
    }
    
    /**
     * Perform search
     */
    function performSearch() {
        // Get search query
        const query = elements.searchInput.value.trim();
        
        // If query is empty, show message and return
        if (!query) {
            showNoResults('الرجاء إدخال كلمة للبحث');
            return;
        }
        
        // Update current search query
        _currentSearchQuery = query;
        
        // Get search scope and type
        _currentSearchScope = elements.searchScope.value;
        _currentSearchType = elements.searchType.value;
        
        // Perform search based on scope and type
        switch (_currentSearchScope) {
            case 'all':
                searchEntireQuran(query, _currentSearchType);
                break;
            case 'current-surah':
                searchCurrentSurah(query, _currentSearchType);
                break;
            case 'tafsir':
                searchTafsir(query);
                break;
        }
    }
    
    /**
     * Search entire Quran
     * @param {string} query - Search query
     * @param {string} type - Search type ('word', 'root', or 'verse')
     */
    function searchEntireQuran(query, type) {
        // In a real app, this would search through the entire Quran data
        // For now, we'll use a simplified approach with our sample data
        
        _searchResults = [];
        
        // Search through all pages in quranData
        Object.values(quranData.pages).forEach(page => {
            page.verses.forEach(verse => {
                if (matchesSearch(verse.text, query, type)) {
                    _searchResults.push({
                        surah: page.surah,
                        verse: verse.verse,
                        text: verse.text,
                        translation: quranData.getTranslation(page.surah, verse.verse)
                    });
                }
            });
        });
        
        // Display results
        displaySearchResults();
    }
    
    /**
     * Search current surah
     * @param {string} query - Search query
     * @param {string} type - Search type ('word', 'root', or 'verse')
     */
    function searchCurrentSurah(query, type) {
        // Get current surah from app state
        const currentSurah = appState ? appState.currentSurah : 1;
        
        _searchResults = [];
        
        // Search through pages for current surah
        Object.values(quranData.pages).forEach(page => {
            if (page.surah === currentSurah) {
                page.verses.forEach(verse => {
                    if (matchesSearch(verse.text, query, type)) {
                        _searchResults.push({
                            surah: page.surah,
                            verse: verse.verse,
                            text: verse.text,
                            translation: quranData.getTranslation(page.surah, verse.verse)
                        });
                    }
                });
            }
        });
        
        // Display results
        displaySearchResults();
    }
    
    /**
     * Search tafsir
     * @param {string} query - Search query
     */
    function searchTafsir(query) {
        _searchResults = [];
        
        // Search through tafsir data
        Object.entries(quranData.tafsir).forEach(([source, surahData]) => {
            Object.entries(surahData).forEach(([surahNumber, verseData]) => {
                Object.entries(verseData).forEach(([verseNumber, tafsirText]) => {
                    if (tafsirText.includes(query)) {
                        _searchResults.push({
                            surah: parseInt(surahNumber),
                            verse: parseInt(verseNumber),
                            text: getVerseText(parseInt(surahNumber), parseInt(verseNumber)),
                            translation: quranData.getTranslation(parseInt(surahNumber), parseInt(verseNumber)),
                            tafsir: tafsirText,
                            tafsirSource: source
                        });
                    }
                });
            });
        });
        
        // Display results
        displaySearchResults();
    }
    
    /**
     * Check if text matches search query
     * @param {string} text - Text to search in
     * @param {string} query - Search query
     * @param {string} type - Search type ('word', 'root', or 'verse')
     * @returns {boolean} Whether text matches search
     */
    function matchesSearch(text, query, type) {
        switch (type) {
            case 'word':
                // Simple word search
                return text.includes(query);
                
            case 'root':
                // In a real app, this would use Arabic root analysis
                // For now, we'll use a simplified approach
                return text.includes(query);
                
            case 'verse':
                // Match entire verse
                return text === query;
                
            default:
                return text.includes(query);
        }
    }
    
    /**
     * Display search results
     */
    function displaySearchResults() {
        // Update results count
        elements.resultsCount.textContent = `تم العثور على ${_searchResults.length} نتيجة`;
        
        // Clear results list
        elements.resultsList.innerHTML = '';
        
        // If no results, show message
        if (_searchResults.length === 0) {
            showNoResults('لم يتم العثور على نتائج');
            return;
        }
        
        // Add each result to the list
        _searchResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            // Get surah name
            const surahData = quranData.surahs.find(s => s.number === result.surah);
            const surahName = surahData ? surahData.name : '';
            
            // Create result HTML
            let resultHTML = `
                <div class="surah-name">سورة ${surahName} - آية ${result.verse}</div>
                <div class="verse-text">${highlightSearchTerm(result.text, _currentSearchQuery)}</div>
                <div class="verse-translation">${result.translation}</div>
            `;
            
            // Add tafsir if available
            if (result.tafsir) {
                resultHTML += `
                    <div class="result-tafsir">
                        <div class="tafsir-source">${getTafsirSourceName(result.tafsirSource)}</div>
                        <div class="tafsir-text">${highlightSearchTerm(result.tafsir, _currentSearchQuery)}</div>
                    </div>
                `;
            }
            
            resultItem.innerHTML = resultHTML;
            
            // Add click event to navigate to this verse
            resultItem.addEventListener('click', () => {
                navigateToVerse(result.surah, result.verse);
            });
            
            elements.resultsList.appendChild(resultItem);
        });
    }
    
    /**
     * Show no results message
     * @param {string} message - Message to display
     */
    function showNoResults(message) {
        elements.resultsCount.textContent = message;
        elements.resultsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>${message}</p>
            </div>
        `;
    }
    
    /**
     * Highlight search term in text
     * @param {string} text - Text to highlight in
     * @param {string} searchTerm - Term to highlight
     * @returns {string} Text with highlighted search term
     */
    function highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) return text;
        
        // Create regex with global flag
        const regex = new RegExp(escapeRegExp(searchTerm), 'g');
        
        // Replace with highlighted version
        return text.replace(regex, `<span class="highlight">${searchTerm}</span>`);
    }
    
    /**
     * Escape special characters in string for use in regex
     * @param {string} string - String to escape
     * @returns {string} Escaped string
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * Get tafsir source name
     * @param {string} sourceId - Tafsir source ID
     * @returns {string} Tafsir source name
     */
    function getTafsirSourceName(sourceId) {
        const sources = {
            'ibn-kathir': 'تفسير ابن كثير',
            'saadi': 'تفسير السعدي',
            'qurtubi': 'تفسير القرطبي',
            'tabari': 'تفسير الطبري'
        };
        
        return sources[sourceId] || sourceId;
    }
    
    /**
     * Navigate to a specific verse
     * @param {number} surahNumber - Surah number
     * @param {number} verseNumber - Verse number
     */
    function navigateToVerse(surahNumber, verseNumber) {
        // Change to Quran reader section
        if (typeof changeSection === 'function') {
            changeSection('quran-reader');
        }
        
        // Load the surah
        if (typeof loadSurah === 'function') {
            loadSurah(surahNumber);
            
            // Scroll to verse (would be implemented in a real app)
            // For now, just log the action
            console.log(`Navigating to Surah ${surahNumber}, Verse ${verseNumber}`);
        }
    }
    
    /**
     * Get verse text
     * @param {number} surahNumber - Surah number
     * @param {number} verseNumber - Verse number
     * @returns {string} Verse text
     */
    function getVerseText(surahNumber, verseNumber) {
        // Try to get verse text from quranData
        const pageData = Object.values(quranData.pages).find(page => 
            page.surah === surahNumber && 
            page.verses.some(v => v.verse === verseNumber)
        );
        
        if (pageData) {
            const verse = pageData.verses.find(v => v.verse === verseNumber);
            if (verse) {
                return verse.text;
            }
        }
        
        return "نص الآية غير متوفر";
    }
    
    // Public API
    return {
        init: init,
        performSearch: performSearch
    };
})();

// Initialize search module when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    searchModule.init();
});
