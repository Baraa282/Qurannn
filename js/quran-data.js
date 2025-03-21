/**
 * Noor Al-Quran - Quran Data
 * Contains data structures for Quran text, surah information, and page mapping
 */

const quranData = {
    // Surah information
    surahs: [
        {
            number: 1,
            name: "الفاتحة",
            englishName: "Al-Fatiha",
            englishNameTranslation: "The Opening",
            numberOfAyahs: 7,
            revelationType: "Meccan",
            page: 1
        },
        {
            number: 2,
            name: "البقرة",
            englishName: "Al-Baqara",
            englishNameTranslation: "The Cow",
            numberOfAyahs: 286,
            revelationType: "Medinan",
            page: 2
        },
        {
            number: 3,
            name: "آل عمران",
            englishName: "Aal-Imran",
            englishNameTranslation: "The Family of Imran",
            numberOfAyahs: 200,
            revelationType: "Medinan",
            page: 50
        },
        {
            number: 4,
            name: "النساء",
            englishName: "An-Nisa",
            englishNameTranslation: "The Women",
            numberOfAyahs: 176,
            revelationType: "Medinan",
            page: 77
        },
        {
            number: 5,
            name: "المائدة",
            englishName: "Al-Ma'ida",
            englishNameTranslation: "The Table Spread",
            numberOfAyahs: 120,
            revelationType: "Medinan",
            page: 106
        },
        // More surahs would be added here
    ],
    
    // Page data (simplified for demonstration)
    pages: {
        1: {
            surah: 1,
            verses: [
                { verse: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
                { verse: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
                { verse: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ" },
                { verse: 4, text: "مَالِكِ يَوْمِ الدِّينِ" },
                { verse: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
                { verse: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
                { verse: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" }
            ]
        },
        2: {
            surah: 2,
            verses: [
                { verse: 1, text: "الم" },
                { verse: 2, text: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ" },
                { verse: 3, text: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ" },
                { verse: 4, text: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ" },
                { verse: 5, text: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ" }
            ]
        },
        // More pages would be added here
    },
    
    // Total number of pages
    totalPages: 604,
    
    // Translations (simplified for demonstration)
    translations: {
        en: {
            1: {
                1: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
                2: "[All] praise is [due] to Allah, Lord of the worlds -",
                3: "The Entirely Merciful, the Especially Merciful,",
                4: "Sovereign of the Day of Recompense.",
                5: "It is You we worship and You we ask for help.",
                6: "Guide us to the straight path -",
                7: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
            },
            // More translations would be added here
        },
        fr: {
            1: {
                1: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
                2: "Louange à Allah, Seigneur de l'univers.",
                3: "Le Tout Miséricordieux, le Très Miséricordieux,",
                4: "Maître du Jour de la rétribution.",
                5: "C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons secours.",
                6: "Guide-nous dans le droit chemin,",
                7: "le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés."
            },
            // More translations would be added here
        },
        // More languages would be added here
    },
    
    // Tafsir data (simplified for demonstration)
    tafsir: {
        "ibn-kathir": {
            1: {
                1: "This is the first verse of the first chapter of the Quran. It is a verse of blessing and seeking help. The meaning of 'Bismillah' is: I begin with every name that belongs to Allah. 'Ar-Rahman' and 'Ar-Raheem' are two names derived from the word 'Rahmah' (mercy).",
                2: "Allah praises Himself in this verse. 'Al-Hamd' means praise and gratitude. 'Rabb' means Lord, Master, and Owner who nurtures and sustains. 'Al-Alameen' refers to everything that exists other than Allah.",
                // More tafsir would be added here
            },
            // More surahs would be added here
        },
        // More tafsir sources would be added here
    },
    
    // Recitation information
    reciters: [
        {
            id: "mishary",
            name: "مشاري راشد العفاسي",
            englishName: "Mishary Rashid Alafasy",
            style: "Murattal",
            audioFormat: "mp3"
        },
        {
            id: "sudais",
            name: "عبد الرحمن السديس",
            englishName: "Abdurrahman As-Sudais",
            style: "Murattal",
            audioFormat: "mp3"
        },
        {
            id: "minshawi",
            name: "محمد صديق المنشاوي",
            englishName: "Mohamed Siddiq Al-Minshawi",
            style: "Murattal",
            audioFormat: "mp3"
        },
        {
            id: "husary",
            name: "محمود خليل الحصري",
            englishName: "Mahmoud Khalil Al-Husary",
            style: "Murattal",
            audioFormat: "mp3"
        }
    ],
    
    // Helper functions
    getPageForSurah: function(surahNumber) {
        const surah = this.surahs.find(s => s.number === surahNumber);
        return surah ? surah.page : 1;
    },
    
    getSurahForPage: function(pageNumber) {
        // Find the surah that contains this page
        for (let i = this.surahs.length - 1; i >= 0; i--) {
            if (this.surahs[i].page <= pageNumber) {
                return this.surahs[i].number;
            }
        }
        return 1;
    },
    
    getTranslation: function(surahNumber, verseNumber, language = 'en') {
        if (this.translations[language] && 
            this.translations[language][surahNumber] && 
            this.translations[language][surahNumber][verseNumber]) {
            return this.translations[language][surahNumber][verseNumber];
        }
        return "Translation not available";
    },
    
    getTafsir: function(surahNumber, verseNumber, source = 'ibn-kathir') {
        if (this.tafsir[source] && 
            this.tafsir[source][surahNumber] && 
            this.tafsir[source][surahNumber][verseNumber]) {
            return this.tafsir[source][surahNumber][verseNumber];
        }
        return "Tafsir not available";
    },
    
    getAudioUrl: function(reciterId, surahNumber, verseNumber) {
        // In a real app, this would generate the correct URL for the audio file
        return `assets/audio/${reciterId}/${surahNumber.toString().padStart(3, '0')}${verseNumber.toString().padStart(3, '0')}.mp3`;
    }
};
