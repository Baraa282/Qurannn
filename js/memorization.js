/**
 * Noor Al-Quran - Memorization Tools
 * Handles memorization and review functionality
 */

// Memorization Module
const memorizationModule = (function() {
    // Private variables
    let _currentSurah = 1;
    let _currentTool = null;
    let _repetitionSettings = {
        verseStart: 1,
        verseEnd: 7,
        repeatCount: 3,
        interval: 1 // seconds between repetitions
    };
    let _selfTestSettings = {
        verseStart: 1,
        verseEnd: 7,
        hideMode: 'partial' // 'partial', 'full', or 'alternate'
    };
    let _planSettings = {
        dailyVerses: 5,
        reviewInterval: 3, // days
        startDate: new Date()
    };
    
    // DOM Elements
    const elements = {
        repetitionToolBtn: document.getElementById('repetition-tool-btn'),
        selfTestToolBtn: document.getElementById('self-test-tool-btn'),
        planToolBtn: document.getElementById('plan-tool-btn'),
        favoritesToolBtn: document.getElementById('favorites-tool-btn'),
        memorizationWorkspace: document.getElementById('memorization-workspace')
    };
    
    /**
     * Initialize the memorization module
     */
    function init() {
        // Set up event listeners
        setupEventListeners();
    }
    
    /**
     * Set up event listeners for memorization module
     */
    function setupEventListeners() {
        // Tool buttons
        elements.repetitionToolBtn.addEventListener('click', () => {
            openTool('repetition');
        });
        
        elements.selfTestToolBtn.addEventListener('click', () => {
            openTool('self-test');
        });
        
        elements.planToolBtn.addEventListener('click', () => {
            openTool('plan');
        });
        
        elements.favoritesToolBtn.addEventListener('click', () => {
            openTool('favorites');
        });
    }
    
    /**
     * Open a specific memorization tool
     * @param {string} toolName - Name of the tool to open
     */
    function openTool(toolName) {
        _currentTool = toolName;
        
        // Clear workspace
        elements.memorizationWorkspace.innerHTML = '';
        
        // Load tool UI
        switch (toolName) {
            case 'repetition':
                loadRepetitionTool();
                break;
            case 'self-test':
                loadSelfTestTool();
                break;
            case 'plan':
                loadPlanTool();
                break;
            case 'favorites':
                loadFavorites();
                break;
        }
    }
    
    /**
     * Load repetition tool UI
     */
    function loadRepetitionTool() {
        const workspace = elements.memorizationWorkspace;
        
        // Create tool UI
        workspace.innerHTML = `
            <div class="tool-header">
                <h3>أداة التكرار</h3>
                <p>تكرار الآيات لتسهيل الحفظ</p>
            </div>
            
            <div class="tool-settings">
                <div class="setting-group">
                    <label for="repetition-surah">السورة:</label>
                    <select id="repetition-surah"></select>
                </div>
                
                <div class="setting-group">
                    <label for="repetition-verse-start">من الآية:</label>
                    <input type="number" id="repetition-verse-start" min="1" value="${_repetitionSettings.verseStart}">
                </div>
                
                <div class="setting-group">
                    <label for="repetition-verse-end">إلى الآية:</label>
                    <input type="number" id="repetition-verse-end" min="1" value="${_repetitionSettings.verseEnd}">
                </div>
                
                <div class="setting-group">
                    <label for="repetition-count">عدد التكرارات:</label>
                    <input type="number" id="repetition-count" min="1" max="10" value="${_repetitionSettings.repeatCount}">
                </div>
                
                <div class="setting-group">
                    <label for="repetition-interval">الفاصل الزمني (ثوان):</label>
                    <input type="number" id="repetition-interval" min="0" max="10" value="${_repetitionSettings.interval}">
                </div>
            </div>
            
            <div class="tool-actions">
                <button id="start-repetition" class="tool-btn">ابدأ التكرار</button>
                <button id="stop-repetition" class="tool-btn secondary" disabled>إيقاف</button>
            </div>
            
            <div class="repetition-display">
                <div id="current-repetition-verse" class="current-verse"></div>
                <div class="repetition-progress">
                    <span>التكرار: </span>
                    <span id="current-repetition">0</span>
                    <span> / </span>
                    <span id="total-repetitions">${_repetitionSettings.repeatCount}</span>
                </div>
            </div>
        `;
        
        // Populate surah select
        const surahSelect = document.getElementById('repetition-surah');
        quranData.surahs.forEach(surah => {
            const option = document.createElement('option');
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.name}`;
            if (surah.number === _currentSurah) {
                option.selected = true;
            }
            surahSelect.appendChild(option);
        });
        
        // Set up event listeners
        document.getElementById('repetition-surah').addEventListener('change', function() {
            const surahNumber = parseInt(this.value);
            updateVerseRangeForSurah(surahNumber, 'repetition');
        });
        
        document.getElementById('start-repetition').addEventListener('click', startRepetition);
        document.getElementById('stop-repetition').addEventListener('click', stopRepetition);
        
        // Update verse range based on selected surah
        updateVerseRangeForSurah(_currentSurah, 'repetition');
    }
    
    /**
     * Load self-test tool UI
     */
    function loadSelfTestTool() {
        const workspace = elements.memorizationWorkspace;
        
        // Create tool UI
        workspace.innerHTML = `
            <div class="tool-header">
                <h3>أداة الاختبار الذاتي</h3>
                <p>اختبر حفظك بإخفاء الآيات</p>
            </div>
            
            <div class="tool-settings">
                <div class="setting-group">
                    <label for="self-test-surah">السورة:</label>
                    <select id="self-test-surah"></select>
                </div>
                
                <div class="setting-group">
                    <label for="self-test-verse-start">من الآية:</label>
                    <input type="number" id="self-test-verse-start" min="1" value="${_selfTestSettings.verseStart}">
                </div>
                
                <div class="setting-group">
                    <label for="self-test-verse-end">إلى الآية:</label>
                    <input type="number" id="self-test-verse-end" min="1" value="${_selfTestSettings.verseEnd}">
                </div>
                
                <div class="setting-group">
                    <label for="self-test-hide-mode">طريقة الإخفاء:</label>
                    <select id="self-test-hide-mode">
                        <option value="partial" ${_selfTestSettings.hideMode === 'partial' ? 'selected' : ''}>إخفاء جزئي</option>
                        <option value="full" ${_selfTestSettings.hideMode === 'full' ? 'selected' : ''}>إخفاء كامل</option>
                        <option value="alternate" ${_selfTestSettings.hideMode === 'alternate' ? 'selected' : ''}>إخفاء متناوب</option>
                    </select>
                </div>
            </div>
            
            <div class="tool-actions">
                <button id="start-self-test" class="tool-btn">ابدأ الاختبار</button>
                <button id="show-answers" class="tool-btn secondary">إظهار الإجابات</button>
            </div>
            
            <div id="self-test-content" class="self-test-content"></div>
        `;
        
        // Populate surah select
        const surahSelect = document.getElementById('self-test-surah');
        quranData.surahs.forEach(surah => {
            const option = document.createElement('option');
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.name}`;
            if (surah.number === _currentSurah) {
                option.selected = true;
            }
            surahSelect.appendChild(option);
        });
        
        // Set up event listeners
        document.getElementById('self-test-surah').addEventListener('change', function() {
            const surahNumber = parseInt(this.value);
            updateVerseRangeForSurah(surahNumber, 'self-test');
        });
        
        document.getElementById('start-self-test').addEventListener('click', startSelfTest);
        document.getElementById('show-answers').addEventListener('click', showSelfTestAnswers);
        
        // Update verse range based on selected surah
        updateVerseRangeForSurah(_currentSurah, 'self-test');
    }
    
    /**
     * Load memorization plan tool UI
     */
    function loadPlanTool() {
        const workspace = elements.memorizationWorkspace;
        
        // Create tool UI
        workspace.innerHTML = `
            <div class="tool-header">
                <h3>خطة الحفظ</h3>
                <p>إنشاء خطة حفظ مخصصة</p>
            </div>
            
            <div class="tool-settings">
                <div class="setting-group">
                    <label for="plan-daily-verses">عدد الآيات اليومية:</label>
                    <input type="number" id="plan-daily-verses" min="1" max="20" value="${_planSettings.dailyVerses}">
                </div>
                
                <div class="setting-group">
                    <label for="plan-review-interval">فترة المراجعة (أيام):</label>
                    <input type="number" id="plan-review-interval" min="1" max="30" value="${_planSettings.reviewInterval}">
                </div>
                
                <div class="setting-group">
                    <label for="plan-start-date">تاريخ البدء:</label>
                    <input type="date" id="plan-start-date" value="${formatDate(_planSettings.startDate)}">
                </div>
                
                <div class="setting-group">
                    <label for="plan-start-surah">البدء من سورة:</label>
                    <select id="plan-start-surah"></select>
                </div>
                
                <div class="setting-group">
                    <label for="plan-start-verse">البدء من آية:</label>
                    <input type="number" id="plan-start-verse" min="1" value="1">
                </div>
            </div>
            
            <div class="tool-actions">
                <button id="generate-plan" class="tool-btn">إنشاء الخطة</button>
                <button id="save-plan" class="tool-btn secondary">حفظ الخطة</button>
            </div>
            
            <div id="plan-preview" class="plan-preview"></div>
        `;
        
        // Populate surah select
        const surahSelect = document.getElementById('plan-start-surah');
        quranData.surahs.forEach(surah => {
            const option = document.createElement('option');
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.name}`;
            if (surah.number === _currentSurah) {
                option.selected = true;
            }
            surahSelect.appendChild(option);
        });
        
        // Set up event listeners
        document.getElementById('plan-start-surah').addEventListener('change', function() {
            const surahNumber = parseInt(this.value);
            updateVerseRangeForSurah(surahNumber, 'plan');
        });
        
        document.getElementById('generate-plan').addEventListener('click', generatePlan);
        document.getElementById('save-plan').addEventListener('click', savePlan);
        
        // Update verse range based on selected surah
        updateVerseRangeForSurah(_currentSurah, 'plan');
    }
    
    /**
     * Load favorites UI
     */
    function loadFavorites() {
        const workspace = elements.memorizationWorkspace;
        
        // Get favorites from localStorage
        const favorites = getFavorites();
        
        // Create tool UI
        workspace.innerHTML = `
            <div class="tool-header">
                <h3>الآيات المفضلة</h3>
                <p>الآيات التي قمت بحفظها للرجوع إليها</p>
            </div>
            
            <div class="favorites-controls">
                <div class="favorites-filter">
                    <label for="favorites-sort-memorization">ترتيب حسب:</label>
                    <select id="favorites-sort-memorization">
                        <option value="date-added">تاريخ الإضافة</option>
                        <option value="surah-order">ترتيب السور</option>
                    </select>
                </div>
            </div>
            
            <div id="favorites-list-memorization" class="favorites-list">
                ${favorites.length === 0 ? 
                    `<div class="empty-favorites-message">
                        <i class="fas fa-bookmark"></i>
                        <p>لم تقم بإضافة آيات إلى المفضلة بعد</p>
                    </div>` : 
                    ''}
            </div>
        `;
        
        // Populate favorites list
        if (favorites.length > 0) {
            const favoritesList = document.getElementById('favorites-list-memorization');
            favorites.forEach(favorite => {
                const favoriteItem = document.createElement('div');
                favoriteItem.className = 'favorite-item';
                favoriteItem.innerHTML = `
                    <div class="favorite-header">
                        <div class="favorite-surah">${favorite.surahName}</div>
                        <div class="favorite-actions">
                            <button class="favorite-play-btn" data-surah="${favorite.surah}" data-verse="${favorite.verse}" title="Play">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="favorite-remove-btn" data-surah="${favorite.surah}" data-verse="${favorite.verse}" title="Remove">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="favorite-verse">
                        <span class="verse-number">${favorite.verse}</span>
                        <span class="verse-text">${favorite.text}</span>
                    </div>
                    <div class="favorite-translation">${favorite.translation || ''}</div>
                    <div class="favorite-date">أضيف: ${formatDateShort(new Date(favorite.dateAdded))}</div>
                `;
                
                favoritesList.appendChild(favoriteItem);
            });
            
            // Add event listeners to favorite items
            document.querySelectorAll('.favorite-play-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const surah = parseInt(this.getAttribute('data-surah'));
                    const verse = parseInt(this.getAttribute('data-verse'));
                    playFavoriteVerse(surah, verse);
                });
            });
            
            document.querySelectorAll('.favorite-remove-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const surah<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>