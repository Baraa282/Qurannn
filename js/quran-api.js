/**
 * Noor Al-Quran - Quran API Integration
 * Handles fetching and processing Quran data from alquran.cloud API
 */

// Quran API Module
const quranAPI = (function() {
    // API base URL
    const API_BASE_URL = 'https://api.alquran.cloud/v1';
    
    // Cache for API responses
    const cache = {
        surahs: null,
        pages: {},
        verses: {},
        translations: {},
        audio: {}
    };
    
    /**
     * Fetch all surahs information
     * @returns {Promise} Promise resolving to surahs data
     */
    async function fetchSurahs() {
        // Check cache first
        if (cache.surahs) {
            return cache.surahs;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/surah`);
            const data = await response.json();
            
            if (data.code === 200 && data.status === 'OK') {
                // Process and cache the data
                cache.surahs = data.data;
                return data.data;
            } else {
                throw new Error('Failed to fetch surahs');
            }
        } catch (error) {
            console.error('Error fetching surahs:', error);
            // Return fallback data from quranData
            return quranData.surahs;
        }
    }
    
    /**
     * Fetch a specific surah
     * @param {number} surahNumber - Surah number (1-114)
     * @returns {Promise} Promise resolving to surah data
     */
    async function fetchSurah(surahNumber) {
        // Validate surah number
        if (surahNumber < 1 || surahNumber > 114) {
            throw new Error('Invalid surah number');
        }
        
        // Check cache first
        if (cache.verses[`surah_${surahNumber}`]) {
            return cache.verses[`surah_${surahNumber}`];
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}`);
            const data = await response.json();
            
            if (data.code === 200 && data.status === 'OK') {
                // Process and cache the data
                cache.verses[`surah_${surahNumber}`] = data.data;
                return data.data;
            } else {
                throw new Error(`Failed to fetch surah ${surahNumber}`);
            }
        } catch (error) {
            console.error(`Error fetching surah ${surahNumber}:`, error);
            // Return fallback data if available
            const fallbackPage = Object.values(quranData.pages).find(page => page.surah === surahNumber);
            return fallbackPage ? { number: surahNumber, verses: fallbackPage.verses } : null;
        }
    }
    
    /**
     * Fetch a specific page of the Quran
     * @param {number} pageNumber - Page number (1-604)
     * @returns {Promise} Promise resolving to page data
     */
    async function fetchPage(pageNumber) {
        // Validate page number
        if (pageNumber < 1 || pageNumber > 604) {
            throw new Error('Invalid page number');
        }
        
        // Check cache first
        if (cache.pages[pageNumber]) {
            return cache.pages[pageNumber];
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/page/${pageNumber}/quran-uthmani`);
            const data = await response.json();
            
            if (data.code === 200 && data.status === 'OK') {
                // Process and cache the data
                const processedData = processPageData(data.data);
                cache.pages[pageNumber] = processedData;
                return processedData;
            } else {
                throw new Error(`Failed to fetch page ${pageNumber}`);
            }
        } catch (error) {
            console.error(`Error fetching page ${pageNumber}:`, error);
            // Return fallback data
            return quranData.pages[pageNumber] || null;
        }
    }
    
    /**
     * Process page data from API response
     * @param {Object} pageData - Raw page data from API
     * @returns {Object} Processed page data
     */
    function processPageData(pageData) {
        // Extract relevant information
        const ayahs = pageData.ayahs;
        const surah = ayahs.length > 0 ? ayahs[0].surah.number : 1;
        
        // Format verses
        const verses = ayahs.map(ayah => ({
            verse: ayah.numberInSurah,
            text: ayah.text,
            surah: ayah.surah.number,
            page: ayah.page
        }));
        
        return {
            page: pageData.number,
            surah: surah,
            verses: verses
        };
    }
    
    /**
     * Fetch translation for a surah
     * @param {number} surahNumber - Surah number (1-114)
     * @param {string} language - Language code (e.g., 'en', 'fr')
     * @returns {Promise} Promise resolving to translation data
     */
    async function fetchTranslation(surahNumber, language) {
        // Map language code to edition
        const editionMap = {
            'en': 'en.sahih',
            'fr': 'fr.hamidullah',
            'ur': 'ur.jalandhry',
            'id': 'id.indonesian',
            'tr': 'tr.ates',
            'ru': 'ru.kuliev',
            'es': 'es.cortes'
        };
        
        const edition = editionMap[language] || 'en.sahih';
        const cacheKey = `${surahNumber}_${edition}`;
        
        // Check cache first
        if (cache.translations[cacheKey]) {
            return cache.translations[cacheKey];
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${edition}`);
            const data = await response.json();
            
            if (data.code === 200 && data.status === 'OK') {
                // Process and cache the data
                const translationData = processTranslationData(data.data);
                cache.translations[cacheKey] = translationData;
                return translationData;
            } else {
                throw new Error(`Failed to fetch translation for surah ${surahNumber}`);
            }
        } catch (error) {
            console.error(`Error fetching translation for surah ${surahNumber}:`, error);
            // Return fallback data
            return {
                surah: surahNumber,
                language: language,
                verses: quranData.translations[language] && quranData.translations[language][surahNumber] 
                    ? Object.entries(quranData.translations[language][surahNumber]).map(([verse, text]) => ({
                        verse: parseInt(verse),
                        text: text
                    }))
                    : []
            };
        }
    }
    
    /**
     * Process translation data from API response
     * @param {Object} translationData - Raw translation data from API
     * @returns {Object} Processed translation data
     */
    function processTranslationData(translationData) {
        // Extract relevant information
        const ayahs = translationData.ayahs;
        
        // Format verses
        const verses = ayahs.map(ayah => ({
            verse: ayah.numberInSurah,
            text: ayah.text,
            surah: translationData.number
        }));
        
        return {
            surah: translationData.number,
            language: translationData.edition.language,
            verses: verses
        };
    }
    
    /**
     * Fetch audio URL for a verse
     * @param {string} reciterId - Reciter ID
     * @param {number} surahNumber - Surah number (1-114)
     * @param {number} verseNumber - Verse number
     * @returns {Promise} Promise resolving to audio URL
     */
    async function fetchAudioUrl(reciterId, surahNumber, verseNumber) {
        // Map reciter ID to API edition
        const reciterMap = {
            'mishary': 'ar.alafasy',
            'sudais': 'ar.abdurrahmaansudais',
            'minshawi': 'ar.minshawi',
            'husary': 'ar.husary'
        };
        
        const edition = reciterMap[reciterId] || 'ar.alafasy';
        const cacheKey = `${edition}_${surahNumber}_${verseNumber}`;
        
        // Check cache first
        if (cache.audio[cacheKey]) {
            return cache.audio[cacheKey];
        }
        
        try {
            // For individual ayah audio
            const response = await fetch(`${API_BASE_URL}/ayah/${surahNumber}:${verseNumber}/${edition}`);
            const data = await response.json();
            
            if (data.code === 200 && data.status === 'OK') {
                // Cache and return the audio URL
                const audioUrl = data.data.audio;
                cache.audio[cacheKey] = audioUrl;
                return audioUrl;
            } else {
                throw new Error(`Failed to fetch audio for surah ${surahNumber}, verse ${verseNumber}`);
            }
        } catch (error) {
            console.error(`Error fetching audio for surah ${surahNumber}, verse ${verseNumber}:`, error);
            // Return fallback URL
            return quranData.getAudioUrl(reciterId, surahNumber, verseNumber);
        }
    }
    
    /**
     * Fetch tafsir for a verse
     * @param {number} surahNumber - Surah number (1-114)
     * @param {number} verseNumber - Verse number
     * @param {string} tafsirSource - Tafsir source ID
     * @returns {Promise} Promise resolving to tafsir text
     */
    async function fetchTafsir(surahNumber, verseNumber, tafsirSource) {
        // Map tafsir source to API edition
        const tafsirMap = {
            'ibn-kathir': 'en.ibn-kathir',
            'saadi': 'ar.sa3dy',
            'qurtubi': 'ar.qurtubi',
            'tabari': 'ar.tabari'
        };
        
        const edition = tafsirMap[tafsirSource] || 'en.ibn-kathir';
        const cacheKey = `${edition}_${surahNumber}_${verseNumber}`;
        
        // For now, return fallback data as the API doesn't directly support tafsir
        // In a real app, this would fetch from a tafsir API or database
        return quranData.getTafsir(surahNumber, verseNumber, tafsirSource);
    }
    
    /**
     * Initialize the Quran data
     * @returns {Promise} Promise resolving when initialization is complete
     */
    async function initQuranData() {
        try {
            // Fetch surahs information
            const surahs = await fetchSurahs();
            
            // Update quranData with fetched surahs
            quranData.surahs = surahs;
            
            // Fetch first page to start with
            await fetchPage(1);
            
            return true;
        } catch (error) {
            console.error('Error initializing Quran data:', error);
            return false;
        }
    }
    
    // Public API
    return {
        fetchSurahs,
        fetchSurah,
        fetchPage,
        fetchTranslation,
        fetchAudioUrl,
        fetchTafsir,
        initQuranData
    };
})();

// Initialize Quran data when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update UI to show loading state
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-message';
    loadingMessage.innerHTML = `
        <div class="spinner"></div>
        <p>جاري تحميل القرآن الكريم...</p>
    `;
    document.body.appendChild(loadingMessage);
    
    // Initialize Quran data
    quranAPI.initQuranData()
        .then(success => {
            if (success) {
                console.log('Quran data initialized successfully');
                // Remove loading message
                document.body.removeChild(loadingMessage);
                
                // Update app with fetched data
                if (typeof initApp === 'function') {
                    initApp();
                }
            } else {
                console.error('Failed to initialize Quran data');
                // Update loading message to show error
                loadingMessage.innerHTML = `
                    <div class="error-icon">❌</div>
                    <p>فشل في تحميل البيانات. الرجاء المحاولة مرة أخرى.</p>
                    <button id="retry-load" class="retry-btn">إعادة المحاولة</button>
                `;
                
                // Add retry button functionality
                document.getElementById('retry-load').addEventListener('click', function() {
                    location.reload();
                });
            }
        });
});
