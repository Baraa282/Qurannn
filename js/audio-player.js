/**
 * Noor Al-Quran - Audio Player
 * Handles audio playback functionality
 */

// Audio Player Module
const audioPlayer = (function() {
    // Private variables
    let _audioElement = null;
    let _currentReciter = 'mishary';
    let _currentSurah = 1;
    let _currentVerse = 1;
    let _isPlaying = false;
    let _repeatMode = false;
    let _repeatCount = 1;
    let _currentRepeat = 0;
    let _playbackSpeed = 1;
    let _volume = 1;
    
    // DOM Elements
    const elements = {
        playPauseBtn: document.getElementById('play-pause'),
        prevVerseBtn: document.getElementById('prev-verse'),
        nextVerseBtn: document.getElementById('next-verse'),
        repeatToggleBtn: document.getElementById('repeat-toggle'),
        volumeSlider: document.getElementById('volume-slider'),
        speedSelect: document.getElementById('speed-select'),
        progressBar: document.getElementById('progress-bar'),
        currentTime: document.getElementById('current-time'),
        totalTime: document.getElementById('total-time'),
        currentSurahAudio: document.getElementById('current-surah-audio'),
        currentVerse: document.getElementById('current-verse'),
        reciterSelect: document.getElementById('reciter-select'),
        verseList: document.getElementById('verse-list')
    };
    
    /**
     * Initialize the audio player
     */
    function init() {
        // Create audio element
        _audioElement = new Audio();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update UI
        updateUI();
    }
    
    /**
     * Set up event listeners for audio player
     */
    function setupEventListeners() {
        // Play/Pause button
        elements.playPauseBtn.addEventListener('click', togglePlayPause);
        
        // Previous verse button
        elements.prevVerseBtn.addEventListener('click', playPreviousVerse);
        
        // Next verse button
        elements.nextVerseBtn.addEventListener('click', playNextVerse);
        
        // Repeat toggle button
        elements.repeatToggleBtn.addEventListener('click', toggleRepeat);
        
        // Volume slider
        elements.volumeSlider.addEventListener('input', () => {
            setVolume(elements.volumeSlider.value / 100);
        });
        
        // Playback speed select
        elements.speedSelect.addEventListener('change', () => {
            setPlaybackSpeed(parseFloat(elements.speedSelect.value));
        });
        
        // Reciter select
        elements.reciterSelect.addEventListener('change', () => {
            setReciter(elements.reciterSelect.value);
            if (_isPlaying) {
                playVerse(_currentSurah, _currentVerse);
            }
        });
        
        // Audio element events
        _audioElement.addEventListener('timeupdate', updateProgress);
        _audioElement.addEventListener('ended', handleAudioEnded);
        _audioElement.addEventListener('loadedmetadata', updateTotalTime);
        _audioElement.addEventListener('error', handleAudioError);
    }
    
    /**
     * Toggle play/pause
     */
    function togglePlayPause() {
        if (_isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }
    
    /**
     * Play audio
     */
    function playAudio() {
        _audioElement.play()
            .then(() => {
                _isPlaying = true;
                elements.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                highlightCurrentVerse();
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    }
    
    /**
     * Pause audio
     */
    function pauseAudio() {
        _audioElement.pause();
        _isPlaying = false;
        elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    /**
     * Play a specific verse
     * @param {number} surahNumber - Surah number
     * @param {number} verseNumber - Verse number
     */
    function playVerse(surahNumber, verseNumber) {
        // Update current surah and verse
        _currentSurah = surahNumber;
        _currentVerse = verseNumber;
        
        // Reset repeat counter
        _currentRepeat = 0;
        
        // Get audio URL
        const audioUrl = getAudioUrl(surahNumber, verseNumber);
        
        // Set audio source
        _audioElement.src = audioUrl;
        
        // Set playback speed and volume
        _audioElement.playbackRate = _playbackSpeed;
        _audioElement.volume = _volume;
        
        // Play audio
        playAudio();
        
        // Update UI
        updateUI();
    }
    
    /**
     * Play previous verse
     */
    function playPreviousVerse() {
        let prevVerse = _currentVerse - 1;
        let prevSurah = _currentSurah;
        
        // If at first verse of surah, go to previous surah's last verse
        if (prevVerse < 1) {
            prevSurah = _currentSurah - 1;
            // If at first surah, stay at first verse
            if (prevSurah < 1) {
                prevSurah = 1;
                prevVerse = 1;
            } else {
                // Get last verse of previous surah
                const prevSurahData = quranData.surahs.find(s => s.number === prevSurah);
                prevVerse = prevSurahData ? prevSurahData.numberOfAyahs : 1;
            }
        }
        
        playVerse(prevSurah, prevVerse);
    }
    
    /**
     * Play next verse
     */
    function playNextVerse() {
        let nextVerse = _currentVerse + 1;
        let nextSurah = _currentSurah;
        
        // Get current surah data
        const currentSurahData = quranData.surahs.find(s => s.number === _currentSurah);
        
        // If at last verse of surah, go to next surah's first verse
        if (currentSurahData && nextVerse > currentSurahData.numberOfAyahs) {
            nextSurah = _currentSurah + 1;
            nextVerse = 1;
            
            // If at last surah, stay at last verse
            if (nextSurah > quranData.surahs.length) {
                nextSurah = _currentSurah;
                nextVerse = currentSurahData.numberOfAyahs;
            }
        }
        
        playVerse(nextSurah, nextVerse);
    }
    
    /**
     * Toggle repeat mode
     */
    function toggleRepeat() {
        _repeatMode = !_repeatMode;
        
        if (_repeatMode) {
            elements.repeatToggleBtn.classList.add('active');
            // Show repeat settings dialog (in a real app)
            _repeatCount = 3; // Default repeat count
        } else {
            elements.repeatToggleBtn.classList.remove('active');
            _repeatCount = 1;
        }
    }
    
    /**
     * Set playback speed
     * @param {number} speed - Playback speed (0.5 to 2)
     */
    function setPlaybackSpeed(speed) {
        _playbackSpeed = speed;
        _audioElement.playbackRate = speed;
    }
    
    /**
     * Set volume
     * @param {number} volume - Volume level (0 to 1)
     */
    function setVolume(volume) {
        _volume = volume;
        _audioElement.volume = volume;
    }
    
    /**
     * Set reciter
     * @param {string} reciterId - ID of the reciter
     */
    function setReciter(reciterId) {
        _currentReciter = reciterId;
    }
    
    /**
     * Update progress bar and time display
     */
    function updateProgress() {
        const currentTime = _audioElement.currentTime;
        const duration = _audioElement.duration || 1;
        const progressPercent = (currentTime / duration) * 100;
        
        // Update progress bar
        elements.progressBar.style.width = `${progressPercent}%`;
        
        // Update current time display
        elements.currentTime.textContent = formatTime(currentTime);
    }
    
    /**
     * Update total time display
     */
    function updateTotalTime() {
        const duration = _audioElement.duration || 0;
        elements.totalTime.textContent = formatTime(duration);
    }
    
    /**
     * Handle audio ended event
     */
    function handleAudioEnded() {
        _currentRepeat++;
        
        // If repeat mode is on and we haven't reached repeat count
        if (_repeatMode && _currentRepeat < _repeatCount) {
            // Replay the same verse
            _audioElement.currentTime = 0;
            playAudio();
        } else {
            // Reset repeat counter
            _currentRepeat = 0;
            
            // Check if auto-play next is enabled in settings
            if (appState && appState.settings && appState.settings.autoPlayNext) {
                playNextVerse();
            } else {
                pauseAudio();
                _audioElement.currentTime = 0;
                updateProgress();
            }
        }
    }
    
    /**
     * Handle audio error
     * @param {Event} error - Error event
     */
    function handleAudioError(error) {
        console.error('Audio error:', error);
        pauseAudio();
        
        // Show error message to user (in a real app)
        alert('Error playing audio. Please try again or select a different reciter.');
    }
    
    /**
     * Get audio URL for a verse
     * @param {number} surahNumber - Surah number
     * @param {number} verseNumber - Verse number
     * @returns {string} Audio URL
     */
    function getAudioUrl(surahNumber, verseNumber) {
        // In a real app, this would use the actual audio file URL
        // For now, we'll use a placeholder URL
        return quranData.getAudioUrl(_currentReciter, surahNumber, verseNumber);
    }
    
    /**
     * Format time in MM:SS format
     * @param {number} timeInSeconds - Time in seconds
     * @returns {string} Formatted time
     */
    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Highlight current verse in the verse list
     */
    function highlightCurrentVerse() {
        // Remove highlight from all verses
        const verseItems = elements.verseList.querySelectorAll('.verse-list-item');
        verseItems.forEach(item => {
            item.classList.remove('playing');
        });
        
        // Add highlight to current verse
        const currentVerseItem = elements.verseList.querySelector(`[data-surah="${_currentSurah}"][data-verse="${_currentVerse}"]`);
        if (currentVerseItem) {
            currentVerseItem.classList.add('playing');
            // Scroll to current verse
            currentVerseItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    /**
     * Update UI based on current state
     */
    function updateUI() {
        // Update surah and verse display
        const surahData = quranData.surahs.find(s => s.number === _currentSurah);
        if (surahData) {
            elements.currentSurahAudio.textContent = `سورة ${surahData.name}`;
        }
        elements.currentVerse.textContent = `آية ${_currentVerse}`;
        
        // Update play/pause button
        elements.playPauseBtn.innerHTML = _isPlaying ? 
            '<i class="fas fa-pause"></i>' : 
            '<i class="fas fa-play"></i>';
        
        // Update repeat button
        if (_repeatMode) {
            elements.repeatToggleBtn.classList.add('active');
        } else {
            elements.repeatToggleBtn.classList.remove('active');
        }
        
        // Update volume slider
        elements.volumeSlider.value = _volume * 100;
        
        // Update speed select
        elements.speedSelect.value = _playbackSpeed.toString();
        
        // Update reciter select
        elements.reciterSelect.value = _currentReciter;
        
        // Populate verse list if empty
        if (elements.verseList.children.length === 0) {
            populateVerseList();
        }
        
        // Highlight current verse
        highlightCurrentVerse();
    }
    
    /**
     * Populate verse list for current surah
     */
    function populateVerseList() {
        // Clear existing list
        elements.verseList.innerHTML = '';
        
        // Get current surah data
        const surahData = quranData.surahs.find(s => s.number === _currentSurah);
        if (!surahData) return;
        
        // Add each verse to the list
        for (let i = 1; i <= surahData.numberOfAyahs; i++) {
            const verseItem = document.createElement('div');
            verseItem.className = 'verse-list-item';
            verseItem.setAttribute('data-surah', _currentSurah);
            verseItem.setAttribute('data-verse', i);
            
            // Get verse text (simplified for demo)
            let verseText = `آية ${i}`;
            
            // Add verse text and controls
            verseItem.innerHTML = `
                <div class="verse-text">${verseText}</div>
                <div class="verse-controls">
                    <button class="verse-play-btn" title="Play">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            `;
            
            // Add click event to play this verse
            verseItem.addEventListener('click', () => {
                playVerse(_currentSurah, i);
            });
            
            elements.verseList.appendChild(verseItem);
        }
    }
    
    // Public API
    return {
        init: init,
        playVerse: playVerse,
        pauseAudio: pauseAudio,
        playAudio: playAudio,
        setReciter: setReciter,
        setVolume: setVolume,
        setPlaybackSpeed: setPlaybackSpeed,
        toggleRepeat: toggleRepeat
    };
})();

// Initialize audio player when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    audioPlayer.init();
});
