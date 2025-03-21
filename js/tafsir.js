/**
 * Noor Al-Quran - Tafsir Module
 * Handles tafsir (Quranic exegesis) functionality
 */

// Tafsir Module
const tafsirModule = (function() {
    // Private variables
    let _currentSurah = 1;
    let _currentVerse = 1;
    let _currentTafsir = 'ibn-kathir';
    
    // DOM Elements
    const elements = {
        tafsirSelect: document.getElementById('tafsir-select'),
        tafsirVerseList: document.getElementById('tafsir-verse-list'),
        selectedVerseText: document.getElementById('selected-verse-text'),
        tafsirText: document.getElementById('tafsir-text')
    };
    
    /**
     * Initialize the tafsir module
     */
    function init() {
        // Set up event listeners
        setupEventListeners();
        
        // Load initial tafsir content
        loadTafsirForSurah(_currentSurah);
        
        // Select first verse by default
        selectVerse(_currentSurah, 1);
    }
    
    /**
     * Set up event listeners for tafsir module
     */
    function setupEventListeners() {
        // Tafsir source selection
        elements.tafsirSelect.addEventListener('change', () => {
            _currentTafsir = elements.tafsirSelect.value;
            loadTafsirForVerse(_currentSurah, _currentVerse);
        });
    }
    
    /**
     * Load tafsir for a specific surah
     * @param {number} surahNumber - Surah number
     */
    function loadTafsirForSurah(surahNumber) {
        _currentSurah = surahNumber;
        
        // Clear existing verse list
        elements.tafsirVerseList.innerHTML = '';
        
        // Get surah data
        const surahData = quranData.surahs.find(s => s.number === surahNumber);
        if (!surahData) return;
        
        // Add each verse to the list
        for (let i = 1; i <= surahData.numberOfAyahs; i++) {
            const verseItem = document.createElement('div');
            verseItem.className = 'verse-list-item';
            verseItem.setAttribute('data-verse', i);
            
            // Get verse text (simplified for demo)
            let verseText = `آية ${i}`;
            
            // Add verse text
            verseItem.innerHTML = `<div class="verse-text">${verseText}</div>`;
            
            // Add click event to select this verse
            verseItem.addEventListener('click', () => {
                selectVerse(surahNumber, i);
            });
            
            elements.tafsirVerseList.appendChild(verseItem);
        }
    }
    
    /**
     * Select a specific verse for tafsir
     * @param {number} surahNumber - Surah number
     * @param {number} verseNumber - Verse number
     */
    function selectVerse(surahNumber, verseNumber) {
        _currentSurah = surahNumber;
        _currentVerse = verseNumber;
        
        // Highlight selected verse in list
        const verseItems = elements.tafsirVerseList.querySelectorAll('.verse-list-item');
        verseItems.forEach(item => {
            if (parseInt(item.getAttribute('data-verse')) === verseNumber) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // Load verse text
        loadVerseText(surahNumber, verseNumber);
        
        // Load tafsir for this verse
        loadTafsirForVerse(surahNumber, verseNumber);
    }
    
    /**
     * Load verse text
     * @param {number} surahNumber - Surah number
     * @param {number} verseNumber - Verse number
     */
    function loadVerseText(surahNumber, verseNumber) {
        // In a real app, this would fetch the verse text from quranData
        // For now, we'll use placeholder text
        let verseText = "Loading verse text...";
        
        // Try to get verse text from quranData
        const pageData = Object.values(quranData.pages).find(page => 
            page.surah === surahNumber && 
            page.verses.some(v => v.verse === verseNumber)
        );
        
        if (pageData) {
            const verse = pageData.verses.find(v => v.verse === verseNumber);
            if (verse) {
                verseText = verse.text;
            }
        }
        
        // Update selected verse text
        elements.selectedVerseText.innerHTML = `
            <div class="verse">
                <span class="verse-number">${verseNumber}</span>
                <span class="verse-text">${verseText}</span>
            </div>
        `;
    }
    
    /**
     * Load tafsir for a specific verse
     * @param {number} surahNumber - Surah number
     * @param {number} verseNumber - Verse number
     */
    function loadTafsirForVerse(surahNumber, verseNumber) {
        // Get tafsir text
        const tafsirText = getTafsirText(surahNumber, verseNumber, _currentTafsir);
        
        // Update tafsir text
        elements.tafsirText.innerHTML = tafsirText;
    }
    
    /**
     * Get tafsir text for a verse
     * @param {number} surahNumber - Surah number
     * @param {number} verseNumber - Verse number
     * @param {string} tafsirSource - Tafsir source ID
     * @returns {string} Tafsir text
     */
    function getTafsirText(surahNumber, verseNumber, tafsirSource) {
        // Try to get tafsir from quranData
        const tafsirText = quranData.getTafsir(surahNumber, verseNumber, tafsirSource);
        
        // If tafsir is not available, show a message
        if (tafsirText === "Tafsir not available") {
            return `<p class="tafsir-not-available">التفسير غير متوفر لهذه الآية في هذا المصدر.</p>`;
        }
        
        return `<p>${tafsirText}</p>`;
    }
    
    /**
     * Change current surah
     * @param {number} surahNumber - Surah number
     */
    function changeSurah(surahNumber) {
        if (_currentSurah !== surahNumber) {
            loadTafsirForSurah(surahNumber);
            selectVerse(surahNumber, 1);
        }
    }
    
    // Public API
    return {
        init: init,
        changeSurah: changeSurah,
        selectVerse: selectVerse
    };
})();

// Initialize tafsir module when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    tafsirModule.init();
});
