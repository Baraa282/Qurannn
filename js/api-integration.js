// Add the API script to index.html
document.addEventListener('DOMContentLoaded', function() {
    // Update the app.js file to use the API
    const appScript = document.querySelector('script[src="js/app.js"]');
    if (appScript) {
        // Insert the API script before app.js
        const apiScript = document.createElement('script');
        apiScript.src = 'js/quran-api.js';
        appScript.parentNode.insertBefore(apiScript, appScript);
    }
    
    // Add CSS for loading spinner
    const style = document.createElement('style');
    style.textContent = `
        .loading-message {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        [data-theme="dark"] .loading-message {
            background-color: rgba(18, 18, 18, 0.9);
            color: #f5f5f5;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #e0e0e0;
            border-top: 5px solid #1e88e5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error-icon {
            font-size: 48px;
            margin-bottom: 20px;
            color: #f44336;
        }
        
        .retry-btn {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #1e88e5;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        
        .retry-btn:hover {
            background-color: #1565c0;
        }
    `;
    document.head.appendChild(style);
});

// Modify the loadQuranPage function in app.js to use the API
function loadQuranPage(pageNumber) {
    appState.currentPage = pageNumber;
    
    // Update page display
    elements.currentPage.textContent = pageNumber;
    
    // Show loading indicator
    elements.quranText.innerHTML = '<div class="loading-indicator"><div class="spinner"></div></div>';
    
    // Fetch page data from API
    quranAPI.fetchPage(pageNumber)
        .then(pageData => {
            if (pageData) {
                // Update Quran text
                renderQuranPage(pageData);
                
                // Update current surah info if needed
                if (pageData.surah !== appState.currentSurah) {
                    appState.currentSurah = pageData.surah;
                    quranAPI.fetchSurahs().then(surahs => {
                        const surahData = surahs.find(s => s.number === pageData.surah);
                        if (surahData) {
                            elements.currentSurahName.textContent = `سورة ${surahData.name}`;
                            elements.currentSurahInfo.textContent = `${surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} - ${surahData.numberOfAyahs} آيات`;
                        }
                    });
                }
                
                // Load translation
                loadTranslation(appState.currentSurah, elements.translationSelect.value);
            }
        })
        .catch(error => {
            console.error('Error loading page:', error);
            elements.quranText.innerHTML = '<div class="error-message">فشل في تحميل الصفحة. الرجاء المحاولة مرة أخرى.</div>';
        });
}

// Modify the loadTranslation function to use the API
function loadTranslation(surahNumber, language) {
    // Show loading indicator
    elements.translationText.innerHTML = '<div class="loading-indicator"><div class="spinner"></div></div>';
    
    // Fetch translation from API
    quranAPI.fetchTranslation(surahNumber, language)
        .then(translationData => {
            if (translationData) {
                renderTranslation(translationData);
            }
        })
        .catch(error => {
            console.error('Error loading translation:', error);
            elements.translationText.innerHTML = '<div class="error-message">فشل في تحميل الترجمة. الرجاء المحاولة مرة أخرى.</div>';
        });
}

// Modify the playVerseAudio function to use the API
function playVerseAudio(surahNumber, verseNumber) {
    console.log(`Playing audio for Surah ${surahNumber}, Verse ${verseNumber}`);
    
    // Update current verse in state
    appState.currentVerse = verseNumber;
    
    // Get current reciter from audio player
    const reciterId = document.getElementById('reciter-select').value || 'mishary';
    
    // Fetch audio URL from API
    quranAPI.fetchAudioUrl(reciterId, surahNumber, verseNumber)
        .then(audioUrl => {
            if (audioUrl) {
                // Create audio element if it doesn't exist
                let audioElement = document.getElementById('quran-audio');
                if (!audioElement) {
                    audioElement = document.createElement('audio');
                    audioElement.id = 'quran-audio';
                    document.body.appendChild(audioElement);
                }
                
                // Set audio source and play
                audioElement.src = audioUrl;
                audioElement.play()
                    .catch(error => {
                        console.error('Error playing audio:', error);
                        alert('فشل في تشغيل الصوت. الرجاء المحاولة مرة أخرى.');
                    });
            }
        })
        .catch(error => {
            console.error('Error fetching audio URL:', error);
            alert('فشل في تحميل الصوت. الرجاء المحاولة مرة أخرى.');
        });
}

// Modify the loadTafsirForVerse function to use the API
function loadTafsirForVerse(surahNumber, verseNumber) {
    // Get tafsir source
    const tafsirSource = document.getElementById('tafsir-select').value || 'ibn-kathir';
    
    // Show loading indicator
    document.getElementById('tafsir-text').innerHTML = '<div class="loading-indicator"><div class="spinner"></div></div>';
    
    // Fetch tafsir from API
    quranAPI.fetchTafsir(surahNumber, verseNumber, tafsirSource)
        .then(tafsirText => {
            // Update tafsir text
            document.getElementById('tafsir-text').innerHTML = `<p>${tafsirText}</p>`;
        })
        .catch(error => {
            console.error('Error loading tafsir:', error);
            document.getElementById('tafsir-text').innerHTML = '<div class="error-message">فشل في تحميل التفسير. الرجاء المحاولة مرة أخرى.</div>';
        });
}
