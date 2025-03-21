/**
 * Noor Al-Quran - Audio Recitations Integration
 * Handles fetching and processing audio recitations from MP3Quran.net API
 */

// Audio Recitations Module
const audioRecitations = (function() {
    // API base URL for MP3Quran.net
    const MP3_QURAN_API = 'https://www.mp3quran.net/api';
    
    // Cache for reciters data
    let recitersCache = null;
    
    /**
     * Fetch available reciters
     * @returns {Promise} Promise resolving to reciters data
     */
    async function fetchReciters() {
        // Check cache first
        if (recitersCache) {
            return recitersCache;
        }
        
        try {
            const response = await fetch(`${MP3_QURAN_API}/reciters`);
            const data = await response.json();
            
            if (data && data.reciters) {
                // Process and cache the data
                const processedData = processRecitersData(data.reciters);
                recitersCache = processedData;
                return processedData;
            } else {
                throw new Error('Failed to fetch reciters');
            }
        } catch (error) {
            console.error('Error fetching reciters:', error);
            // Return fallback data
            return quranData.reciters;
        }
    }
    
    /**
     * Process reciters data from API response
     * @param {Array} recitersData - Raw reciters data from API
     * @returns {Array} Processed reciters data
     */
    function processRecitersData(recitersData) {
        // Format reciters data
        return recitersData.map(reciter => ({
            id: reciter.id.toString(),
            name: reciter.name,
            englishName: reciter.englishName || reciter.name,
            style: reciter.rewaya || 'Murattal',
            audioFormat: 'mp3',
            audioBaseUrl: reciter.Server
        }));
    }
    
    /**
     * Get audio URL for a specific verse
     * @param {string} reciterId - Reciter ID
     * @param {number} surahNumber - Surah number (1-114)
     * @param {number} verseNumber - Verse number
     * @returns {string} Audio URL
     */
    function getAudioUrl(reciterId, surahNumber, verseNumber) {
        // For MP3Quran.net, we need to find the reciter's base URL
        const reciter = recitersCache ? 
            recitersCache.find(r => r.id === reciterId) : 
            quranData.reciters.find(r => r.id === reciterId);
        
        if (reciter && reciter.audioBaseUrl) {
            // Format surah number with leading zeros
            const formattedSurah = surahNumber.toString().padStart(3, '0');
            
            // For verse-by-verse recitations, we would need a different URL structure
            // This is a simplified version that works with surah-level audio files
            return `${reciter.audioBaseUrl}/${formattedSurah}.mp3`;
        }
        
        // Fallback to alquran.cloud API
        return quranAPI.fetchAudioUrl(reciterId, surahNumber, verseNumber);
    }
    
    /**
     * Initialize audio recitations
     * @returns {Promise} Promise resolving when initialization is complete
     */
    async function initAudioRecitations() {
        try {
            // Fetch reciters
            const reciters = await fetchReciters();
            
            // Populate reciter select dropdown
            populateReciterSelect(reciters);
            
            return true;
        } catch (error) {
            console.error('Error initializing audio recitations:', error);
            return false;
        }
    }
    
    /**
     * Populate reciter select dropdown
     * @param {Array} reciters - Reciters data
     */
    function populateReciterSelect(reciters) {
        const reciterSelect = document.getElementById('reciter-select');
        if (!reciterSelect) return;
        
        // Clear existing options
        reciterSelect.innerHTML = '';
        
        // Add each reciter as an option
        reciters.forEach(reciter => {
            const option = document.createElement('option');
            option.value = reciter.id;
            option.textContent = reciter.name;
            reciterSelect.appendChild(option);
        });
    }
    
    // Public API
    return {
        fetchReciters,
        getAudioUrl,
        initAudioRecitations
    };
})();

// Initialize audio recitations when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio recitations after Quran data is loaded
    setTimeout(() => {
        audioRecitations.initAudioRecitations()
            .then(success => {
                if (success) {
                    console.log('Audio recitations initialized successfully');
                } else {
                    console.error('Failed to initialize audio recitations');
                }
            });
    }, 1000); // Wait for Quran data to load first
});
