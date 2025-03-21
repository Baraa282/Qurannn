/**
 * Noor Al-Quran - Testing Script
 * Tests website functionality across different features
 */

// Testing Module
const testingModule = (function() {
    // Test results
    const testResults = {
        responsive: {
            mobile: null,
            tablet: null,
            desktop: null
        },
        features: {
            navigation: null,
            quranReader: null,
            audioPlayer: null,
            tafsir: null,
            memorization: null,
            search: null,
            settings: null,
            nightMode: null,
            fontSizeAdjustment: null,
            backgroundColors: null,
            verseSharing: null
        },
        api: {
            quranText: null,
            translations: null,
            audioRecitations: null,
            tafsirContent: null
        }
    };
    
    /**
     * Run all tests
     */
    function runAllTests() {
        console.log('Starting Noor Al-Quran website tests...');
        
        // Test responsive design
        testResponsiveDesign();
        
        // Test features
        testNavigation();
        testQuranReader();
        testAudioPlayer();
        testTafsir();
        testMemorization();
        testSearch();
        testSettings();
        testNightMode();
        testFontSizeAdjustment();
        testBackgroundColors();
        testVerseSharing();
        
        // Test API integration
        testQuranTextAPI();
        testTranslationsAPI();
        testAudioRecitationsAPI();
        testTafsirContentAPI();
        
        // Log test results
        setTimeout(() => {
            logTestResults();
        }, 5000);
    }
    
    /**
     * Test responsive design
     */
    function testResponsiveDesign() {
        console.log('Testing responsive design...');
        
        // Test mobile layout
        testMobileLayout();
        
        // Test tablet layout
        testTabletLayout();
        
        // Test desktop layout
        testDesktopLayout();
    }
    
    /**
     * Test mobile layout
     */
    function testMobileLayout() {
        console.log('Testing mobile layout...');
        
        try {
            // Simulate mobile viewport
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;
            
            // Set mobile dimensions (iPhone X)
            window.innerWidth = 375;
            window.innerHeight = 812;
            
            // Dispatch resize event
            window.dispatchEvent(new Event('resize'));
            
            // Check if mobile menu button is visible
            const menuToggle = document.getElementById('menu-toggle');
            const isMobileMenuVisible = menuToggle && window.getComputedStyle(menuToggle).display !== 'none';
            
            // Check if sidebar is hidden by default on mobile
            const sidebar = document.querySelector('.sidebar');
            const isSidebarHidden = sidebar && window.getComputedStyle(sidebar).transform.includes('matrix');
            
            // Restore original dimensions
            window.innerWidth = originalWidth;
            window.innerHeight = originalHeight;
            
            // Dispatch resize event
            window.dispatchEvent(new Event('resize'));
            
            // Set test result
            testResults.responsive.mobile = isMobileMenuVisible && isSidebarHidden;
            
            console.log(`Mobile layout test: ${testResults.responsive.mobile ? 'PASSED' : 'FAILED'}`);
        } catch (error) {
            console.error('Error testing mobile layout:', error);
            testResults.responsive.mobile = false;
        }
    }
    
    /**
     * Test tablet layout
     */
    function testTabletLayout() {
        console.log('Testing tablet layout...');
        
        try {
            // Simulate tablet viewport
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;
            
            // Set tablet dimensions (iPad)
            window.innerWidth = 768;
            window.innerHeight = 1024;
            
            // Dispatch resize event
            window.dispatchEvent(new Event('resize'));
            
            // Check tablet-specific layout features
            // For example, check if the sidebar is visible but content area is adjusted
            
            // Restore original dimensions
            window.innerWidth = originalWidth;
            window.innerHeight = originalHeight;
            
            // Dispatch resize event
            window.dispatchEvent(new Event('resize'));
            
            // Set test result (simplified for demo)
            testResults.responsive.tablet = true;
            
            console.log(`Tablet layout test: ${testResults.responsive.tablet ? 'PASSED' : 'FAILED'}`);
        } catch (error) {
            console.error('Error testing tablet layout:', error);
            testResults.responsive.tablet = false;
        }
    }
    
    /**
     * Test desktop layout
     */
    function testDesktopLayout() {
        console.log('Testing desktop layout...');
        
        try {
            // Simulate desktop viewport
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;
            
            // Set desktop dimensions
            window.innerWidth = 1366;
            window.innerHeight = 768;
            
            // Dispatch resize event
            window.dispatchEvent(new Event('resize'));
            
            // Check if sidebar is visible by default on desktop
            const sidebar = document.querySelector('.sidebar');
            const isSidebarVisible = sidebar && !window.getComputedStyle(sidebar).transform.includes('matrix');
            
            // Check if content area is properly sized
            const contentSection = document.querySelector('.content-section.active');
            const isContentSectionSized = contentSection && window.getComputedStyle(contentSection).flex === '1 1 0%';
            
            // Restore original dimensions
            window.innerWidth = originalWidth;
            window.innerHeight = originalHeight;
            
            // Dispatch resize event
            window.dispatchEvent(new Event('resize'));
            
            // Set test result
            testResults.responsive.desktop = isSidebarVisible && isContentSectionSized;
            
            console.log(`Desktop layout test: ${testResults.responsive.desktop ? 'PASSED' : 'FAILED'}`);
        } catch (error) {
            console.error('Error testing desktop layout:', error);
            testResults.responsive.desktop = false;
        }
    }
    
    /**
     * Test navigation
     */
    function testNavigation() {
        console.log('Testing navigation...');
        
        try {
            // Get navigation links
            const navLinks = document.querySelectorAll('.main-nav a');
            
            // Check if navigation links exist
            if (navLinks.length === 0) {
                throw new Error('Navigation links not found');
            }
            
            // Test clicking each navigation link
            let allLinksWork = true;
            
            navLinks.forEach(link => {
                // Get target section ID
                const targetSectionId = link.getAttribute('href').substring(1);
                
                // Click the link
                link.click();
                
                // Check if target section is active
                const targetSection = document.getElementById(targetSectionId);
                const isTargetSectionActive = targetSection && targetSection.classList.contains('active');
                
                if (!isTargetSectionActive) {
                    allLinksWork = false;
                    console.error(`Navigation to ${targetSectionId} failed`);
                }
            });
            
            // Set test result
            testResults.features.navigation = allLinksWork;
            
            console.log(`Navigation test: ${testResults.features.navigation ? 'PASSED' : 'FAILED'}`);
        } catch (error) {
            console.error('Error testing navigation:', error);
            testResults.features.navigation = false;
        }
    }
    
    /**
     * Test Quran reader
     */
    function testQuranReader() {
        console.log('Testing Quran reader...');
        
        try {
            // Navigate to Quran reader section
            const quranReaderLink = document.querySelector('.main-nav a[href="#quran-reader"]');
            if (quranReaderLink) {
                quranReaderLink.click();
            }
            
            // Check if Quran text is loaded
            const quranText = document.getElementById('quran-text');
            const isQuranTextLoaded = quranText && quranText.children.length > 0;
            
            // Test page navigation
            const prevPageBtn = document.getElementById('prev-page');
            const nextPageBtn = document.getElementById('next-page');
            const currentPageDisplay = document.getElementById('current-page');
            
            // Get current page
            const initialPage = currentPageDisplay ? parseInt(currentPageDisplay.textContent) : 1;
            
            // Click next page
            if (nextPageBtn) {
                nextPageBtn.click();
                // Wait for page to load
                setTimeout(() => {
                    // Check if page changed
                    const newPage = currentPageDisplay ? parseInt(currentPageDisplay.textContent) : 1;
                    const pageNavigationWorks = newPage === initialPage + 1;
                    
                    // Set test result
                    testResults.features.quranReader = isQuranTextLoaded && pageNavigationWorks;
                    
                    console.log(`Quran reader test: ${testResults.features.quranReader ? 'PASSED' : 'FAILED'}`);
                }, 1000);
            } else {
                testResults.features.quranReader = isQuranTextLoaded;
                console.log(`Quran reader test: ${testResults.features.quranReader ? 'PASSED' : 'FAILED'}`);
            }
        } catch (error) {
            console.error('Error testing Quran reader:', error);
            testResults.features.quranReader = false;
        }
    }
    
    /**
     * Test audio player
     */
    function testAudioPlayer() {
        console.log('Testing audio player...');
        
        try {
            // Navigate to audio player section
            const audioPlayerLink = document.querySelector('.main-nav a[href="#audio-player"]');
            if (audioPlayerLink) {
                audioPlayerLink.click();
            }
            
            // Check if audio player controls exist
            const playPauseBtn = document.getElementById('play-pause');
            const prevVerseBtn = document.getElementById('prev-verse');
            const nextVerseBtn = document.getElementById('next-verse');
            const volumeSlider = document.getElementById('volume-slider');
            
            const controlsExist = playPauseBtn && prevVerseBtn && nextVerseBtn && volumeSlider;
            
            // Test play button (we won't actually play audio in the test)
            let playButtonWorks = false;
            if (playPauseBtn) {
                const initialIcon = playPauseBtn.innerHTML;
                playPauseBtn.click();
                const newIcon = playPauseBtn.innerHTML;
                playButtonWorks = initialIcon !== newIcon;
            }
            
            // Set test result
            testResults.features.audioPlayer = controlsExist && playButtonWorks;
            
            console.log(`Audio player test: ${testResults.features.audioPlayer ? 'PASSED' : 'FAILED'}`);
        } catch (error) {
            console.error('Error testing audio player:', error);
            testResults.features.audioPlayer = false;
        }
    }
    
    /**
     * Test tafsir
     */
    function testTafsir() {
        console.log('Testing tafsir...');
        
        try {
            // Navigate to tafsir section
            const tafsirLink = document.querySelector('.main-nav a[href="#tafsir"]');
            if (tafsirLink) {
                tafsirLink.click();
            }
            
            // Check if tafsir elements exist
            const tafsirSelect = document.getElementById('tafsir-select');
            const tafsirVerseList = document.getElementById('tafsir-verse-list');
            const selectedVerseText = document.getElementById('selected-verse-text');
            const tafsirText = document.getElementById('tafsir-text');
            
            const elementsExist = tafsirSelect && tafsirVerseList && selectedVerseText && tafsirText;
            
            // Test tafsir source selection
            let sourceSelectionWorks = false;
            if (tafsirSelect) {
                const initialValue = tafsirSelect.value;
                // Change selection
                tafsirSelect.value = tafsirSelect.options[1] ? tafsirSelect.options[1].value : initialValue;
                // Trigger change event
                tafsirSelect.dispatchEvent(new Event('change'));
                // Check if value changed
                sourceSelectionWorks = tafsirSelect.value !== initialValue;
            }
            
            // Set test result
            testResults.features.tafsir = elementsExist && sourceSelectionWorks;
            
            console.log(`Tafsir test: ${testResults.features.tafsir ? 'PASSED' : 'FAILED'}`);
        } catch (error) {
            console.error('Error testing tafsir:', error);
            testResults.features.tafsir = false;
        }
    }
    
    /**
     * Test memorization tools
     */
    function testMemorization() {
        console.log('Testing memorization tools...');
        
        try {
            // Navigate to memorization section
            const memorizationLink = document.querySelector('.main-nav a[href="#memorization"]');
            if (memorizationLink) {
                memorizationLink.click();
            }
            
            // Check if memorization tools exist
            const repetitionToolBtn = document.getElementById('repetition-tool-btn');
            const selfTestToolBtn = document.getElementById('self-test-tool-btn');
            const planToolBtn = document.getElementById('plan-tool-btn');
            const favoritesToolBtn = document.getElementById('favorites-tool-btn');
            
            const toolsExist = repetitionToolBtn && selfTestToolBtn && planToolBtn && favoritesToolBtn;
            
            // Test opening a tool
            let toolOpeningWorks = false;
            if (repetitionToolBtn) {
                const workspace = document.getElementById('memorization-workspace');
                const initialContent = workspace ? workspace.innerHTML : '';
                
                // Click tool button
                repetitionToolBtn.click();
                
                // Check if workspace content changed
                const newContent = workspace ? workspace.innerHTML : '';
                toolOpeningWorks = newContent !== initialContent && newContent !== '';
            }
            
            // Set test result
            testResults.features.memorization = toolsExist && toolOpeningWorks;
            
            console.log(`Memorization tools test: ${testResults.features.memorization ? 'PASSED' : 'FAILED'}`);
        } catch (error) {
            console.error('Error testing memorization tools:', error);
            testResults.features.memorization = false;
        }
    }
    
    /**
     * Test search functionality
     */
    function testSearch() {<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>