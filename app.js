/**
 * ============================================================================
 * Youssef's Clock — Precision Digital Clock & Islamic Prayer Times Engine
 * ============================================================================
 * Features:
 * - Live dynamic digital clock (HH:MM:SS) with 12h/24h toggle
 * - Current date strictly formatted as YYYY-MM-DD with Hijri support
 * - Automatic Geolocation via navigator.geolocation with seamless Doha fallback
 * - Aladhan API integration + local astronomical calculation fallback engine
 * - Automatic Next Prayer detection, countdown timer, and glowing highlight
 * - Qibla compass bearing calculator
 * - Multi-language support (English & Arabic) with complete RTL handling
 * - Audio Chime synthesizer via Web Audio API
 */

'use strict';

// ==========================================
// 1. App Configuration & Constants
// ==========================================

const CONFIG = {
  DEFAULT_LOCATION: {
    name: 'Doha',
    country: 'Qatar',
    nameAr: 'الدوحة',
    countryAr: 'قطر',
    lat: 25.2854,
    lng: 51.5310,
    timezone: 'Asia/Qatar',
    utcOffset: 3
  },
  DEFAULT_METHOD: 4, // 4: Umm Al-Qura University, Makkah
  STORAGE_KEYS: {
    TIME_FORMAT: 'youssef_clock_format',
    LANGUAGE: 'youssef_clock_lang',
    LOCATION: 'youssef_clock_loc',
    METHOD: 'youssef_clock_method',
    SOUND: 'youssef_clock_sound'
  },
  MECCA_COORDS: {
    lat: 21.422487,
    lng: 39.826206
  }
};

// Major World & Islamic Cities Database for quick selector
const POPULAR_CITIES = [
  { name: 'Doha', country: 'Qatar', nameAr: 'الدوحة', countryAr: 'قطر', lat: 25.2854, lng: 51.5310 },
  { name: 'Makkah', country: 'Saudi Arabia', nameAr: 'مكة المكرمة', countryAr: 'السعودية', lat: 21.4225, lng: 39.8262 },
  { name: 'Madinah', country: 'Saudi Arabia', nameAr: 'المدينة المنورة', countryAr: 'السعودية', lat: 24.4672, lng: 39.6111 },
  { name: 'Riyadh', country: 'Saudi Arabia', nameAr: 'الرياض', countryAr: 'السعودية', lat: 24.7136, lng: 46.6753 },
  { name: 'Dubai', country: 'UAE', nameAr: 'دبي', countryAr: 'الإمارات', lat: 25.2048, lng: 55.2708 },
  { name: 'Abu Dhabi', country: 'UAE', nameAr: 'أبوظبي', countryAr: 'الإمارات', lat: 24.4539, lng: 54.3773 },
  { name: 'Cairo', country: 'Egypt', nameAr: 'القاهرة', countryAr: 'مصر', lat: 30.0444, lng: 31.2357 },
  { name: 'Alexandria', country: 'Egypt', nameAr: 'الإسكندرية', countryAr: 'مصر', lat: 31.2001, lng: 29.9187 },
  { name: 'Kuwait City', country: 'Kuwait', nameAr: 'مدينة الكويت', countryAr: 'الكويت', lat: 29.3759, lng: 47.9774 },
  { name: 'Manama', country: 'Bahrain', nameAr: 'المنامة', countryAr: 'البحرين', lat: 26.2285, lng: 50.5860 },
  { name: 'Muscat', country: 'Oman', nameAr: 'مسقط', countryAr: 'عُمان', lat: 23.5880, lng: 58.3829 },
  { name: 'Amman', country: 'Jordan', nameAr: 'عمان', countryAr: 'الأردن', lat: 31.9454, lng: 35.9284 },
  { name: 'Jerusalem', country: 'Palestine', nameAr: 'القدس الشريف', countryAr: 'فلسطين', lat: 31.7683, lng: 35.2137 },
  { name: 'Beirut', country: 'Lebanon', nameAr: 'بيروت', countryAr: 'لبنان', lat: 33.8938, lng: 35.5018 },
  { name: 'Baghdad', country: 'Iraq', nameAr: 'بغداد', countryAr: 'العراق', lat: 33.3152, lng: 44.3661 },
  { name: 'Damascus', country: 'Syria', nameAr: 'دمشق', countryAr: 'سوريا', lat: 33.5138, lng: 36.2765 },
  { name: 'Casablanca', country: 'Morocco', nameAr: 'الدار البيضاء', countryAr: 'المغرب', lat: 33.5731, lng: -7.5898 },
  { name: 'Rabat', country: 'Morocco', nameAr: 'الرباط', countryAr: 'المغرب', lat: 34.0209, lng: -6.8416 },
  { name: 'Algiers', country: 'Algeria', nameAr: 'الجزائر', countryAr: 'الجزائر', lat: 36.7538, lng: 3.0588 },
  { name: 'Tunis', country: 'Tunisia', nameAr: 'تونس', countryAr: 'تونس', lat: 36.8065, lng: 10.1815 },
  { name: 'Tripoli', country: 'Libya', nameAr: 'طرابلس', countryAr: 'ليبيا', lat: 32.8872, lng: 13.1913 },
  { name: 'Istanbul', country: 'Turkey', nameAr: 'إسطنبول', countryAr: 'تركيا', lat: 41.0082, lng: 28.9784 },
  { name: 'Ankara', country: 'Turkey', nameAr: 'أنقرة', countryAr: 'تركيا', lat: 39.9334, lng: 32.8597 },
  { name: 'London', country: 'United Kingdom', nameAr: 'لندن', countryAr: 'المملكة المتحدة', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', nameAr: 'باريس', countryAr: 'فرنسا', lat: 48.8566, lng: 2.3522 },
  { name: 'Berlin', country: 'Germany', nameAr: 'برلين', countryAr: 'ألمانيا', lat: 52.5200, lng: 13.4050 },
  { name: 'New York', country: 'United States', nameAr: 'نيويورك', countryAr: 'الولايات المتحدة', lat: 40.7128, lng: -74.0060 },
  { name: 'Toronto', country: 'Canada', nameAr: 'تورونتو', countryAr: 'كندا', lat: 43.6532, lng: -79.3832 },
  { name: 'Kuala Lumpur', country: 'Malaysia', nameAr: 'كوالالمبور', countryAr: 'ماليزيا', lat: 3.1390, lng: 101.6869 },
  { name: 'Jakarta', country: 'Indonesia', nameAr: 'جاكرتا', countryAr: 'إندونيسيا', lat: -6.2088, lng: 106.8456 },
  { name: 'Karachi', country: 'Pakistan', nameAr: 'كراتشي', countryAr: 'باكستان', lat: 24.8607, lng: 67.0011 },
  { name: 'Dhaka', country: 'Bangladesh', nameAr: 'دكا', countryAr: 'بنغلاديش', lat: 23.8103, lng: 90.4125 },
  { name: 'Tokyo', country: 'Japan', nameAr: 'طوكيو', countryAr: 'اليابان', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', country: 'Australia', nameAr: 'سيدني', countryAr: 'أستراليا', lat: -33.8688, lng: 151.2093 }
];

// Translations dictionary
const I18N = {
  en: {
    langName: 'العربية',
    controlLabels: {
      locationBtn: 'Change location',
      formatToggleBtn: 'Toggle 12H / 24H format',
      soundToggleBtn: 'Toggle prayer alert chime',
      qiblaBtn: 'Qibla direction compass',
      langToggleBtn: 'Switch to Arabic',
      refreshBtn: 'Refresh prayer times',
      closeLocationModalBtn: 'Close location dialog',
      closeQiblaModalBtn: 'Close Qibla dialog',
      searchClearBtn: 'Clear search'
    },
    searchLabel: 'Search city',
    brandSubtitle: 'PRECISION TIME & PRAYER SCHEDULE',
    nextPrayerBadge: 'NEXT PRAYER',
    prayerTimesTitle: "Today's Prayer Schedule",
    nextAdhanLabel: 'Next Adhan:',
    remainingLabel: 'Time Remaining:',
    qiblaLabel: 'Qibla Direction:',
    footerDesc: 'Powered by Aladhan API & Astronomical Algorithms',
    modalTitle: 'Select Location',
    gpsBtn: 'Detect My Exact Location (GPS)',
    gpsLocating: 'Locating GPS position...',
    dividerOr: 'OR SEARCH / CHOOSE CITY',
    searchPlaceholder: 'Search city (e.g., Doha, Cairo, Dubai, London...)',
    quickPickTitle: 'Popular Cities',
    calcMethodLabel: 'Calculation Method:',
    qiblaModalTitle: 'Qibla Compass Direction',
    qiblaDesc: 'Direction towards Kaaba, Makkah',
    qiblaFrom: 'from',
    toastLocationUpdated: 'Location updated to',
    toastGpsSuccess: 'GPS Location detected successfully!',
    toastGpsDenied: 'GPS permission denied. Using fallback location.',
    toastRefreshed: 'Prayer times refreshed!',
    startsIn: 'in',
    passed: 'Passed',
    prayers: {
      Fajr: 'Fajr',
      Sunrise: 'Sunrise',
      Dhuhr: 'Dhuhr',
      Asr: 'Asr',
      Maghrib: 'Maghrib',
      Isha: 'Isha'
    },
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  ar: {
    langName: 'English',
    controlLabels: {
      locationBtn: 'تغيير الموقع',
      formatToggleBtn: 'التبديل بين نظامي 12 و24 ساعة',
      soundToggleBtn: 'تبديل التنبيه الصوتي للصلاة',
      qiblaBtn: 'بوصلة اتجاه القبلة',
      langToggleBtn: 'التبديل إلى الإنجليزية',
      refreshBtn: 'تحديث مواقيت الصلاة',
      closeLocationModalBtn: 'إغلاق نافذة الموقع',
      closeQiblaModalBtn: 'إغلاق نافذة القبلة',
      searchClearBtn: 'مسح البحث'
    },
    searchLabel: 'ابحث عن مدينة',
    brandSubtitle: 'ساعة رقمية فائقة الدقة وجدول مواقيت الصلاة',
    nextPrayerBadge: 'الصلاة القادمة',
    prayerTimesTitle: 'مواقيت الصلاة لهذا اليوم',
    nextAdhanLabel: 'الأذان القادم:',
    remainingLabel: 'الوقت المتبقي:',
    qiblaLabel: 'اتجاه القبلة:',
    footerDesc: 'مدعوم بواسطة Aladhan API والخوارزميات الفلكية الدقيقة',
    modalTitle: 'تحديد الموقع الجغرافي',
    gpsBtn: 'تحديد موقعي الحالي تلقائياً (GPS)',
    gpsLocating: 'جاري تحديد موقعك...',
    dividerOr: 'أو ابحث / اختر مدينة',
    searchPlaceholder: 'ابحث عن مدينة (مثال: الدوحة، القاهرة، مكة، دبي...)',
    quickPickTitle: 'المدن الشائعة',
    calcMethodLabel: 'طريقة حساب المواقيت:',
    qiblaModalTitle: 'بوصلة اتجاه القبلة',
    qiblaDesc: 'الاتجاه نحو الكعبة المشرفة في مكة المكرمة',
    qiblaFrom: 'من',
    toastLocationUpdated: 'تم تحديث الموقع إلى',
    toastGpsSuccess: 'تم تحديد موقعك الجغرافي بنجاح!',
    toastGpsDenied: 'تعذر الوصول للموقع. تم اعتماد الموقع الافتراضي.',
    toastRefreshed: 'تم تحديث مواقيت الصلاة!',
    startsIn: 'متبقي',
    passed: 'انقضت',
    prayers: {
      Fajr: 'الفجر',
      Sunrise: 'الشروق',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء'
    },
    days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
  }
};

// ==========================================
// 2. Built-in Offline Astronomical Calculator (PrayTimes Engine)
// ==========================================
class SolarPrayerCalculator {
  constructor() {
    // Degree / Radian helpers
    this.D2R = Math.PI / 180;
    this.R2D = 180 / Math.PI;
  }

  sin(d) { return Math.sin(d * this.D2R); }
  cos(d) { return Math.cos(d * this.D2R); }
  tan(d) { return Math.tan(d * this.D2R); }
  asin(x) { return Math.asin(x) * this.R2D; }
  acos(x) { return Math.acos(x) * this.R2D; }
  atan(x) { return Math.atan(x) * this.R2D; }
  atan2(y, x) { return Math.atan2(y, x) * this.R2D; }

  fixAngle(a) {
    a = a - 360.0 * Math.floor(a / 360.0);
    return a < 0 ? a + 360.0 : a;
  }

  fixHour(h) {
    h = h - 24.0 * Math.floor(h / 24.0);
    return h < 0 ? h + 24.0 : h;
  }

  // Calculate Julian Date
  julianDate(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  }

  // Sun position equations
  sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = this.fixAngle(357.529 + 0.98560028 * D);
    const q = this.fixAngle(280.459 + 0.98564736 * D);
    const L = this.fixAngle(q + 1.915 * this.sin(g) + 0.020 * this.sin(2 * g));
    const e = 23.439 - 0.00000036 * D;
    const d = this.asin(this.sin(e) * this.sin(L));
    let RA = this.atan2(this.cos(e) * this.sin(L), this.cos(L)) / 15.0;
    RA = this.fixHour(RA);
    const EqT = q / 15.0 - RA;
    return { declination: d, equation: EqT };
  }

  // Method parameters
  getMethodParams(methodId) {
    switch (parseInt(methodId, 10)) {
      case 1: // Karachi
        return { fajrAngle: 18.0, ishaAngle: 18.0, ishaInterval: null };
      case 2: // ISNA
        return { fajrAngle: 15.0, ishaAngle: 15.0, ishaInterval: null };
      case 3: // MWL
        return { fajrAngle: 18.0, ishaAngle: 17.0, ishaInterval: null };
      case 5: // Egypt
        return { fajrAngle: 19.5, ishaAngle: 17.5, ishaInterval: null };
      case 8: // Gulf
        return { fajrAngle: 18.0, ishaAngle: null, ishaInterval: 90 };
      case 4: // Umm Al-Qura (Default)
      default:
        return { fajrAngle: 18.5, ishaAngle: null, ishaInterval: 90 };
    }
  }

  // Compute times for a specific date and coordinates
  compute(date, lat, lng, timezoneOffset = null, methodId = 4) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (timezoneOffset === null) {
      timezoneOffset = -date.getTimezoneOffset() / 60;
    }

    const jd = this.julianDate(year, month, day);
    const sun = this.sunPosition(jd);
    const params = this.getMethodParams(methodId);

    // Midday (Dhuhr)
    const noon = this.fixHour(12 + timezoneOffset - lng / 15.0 - sun.equation);

    // Sun altitude for sunrise/sunset (refraction + sun radius approx 0.833 deg)
    const sunAlt = 0.833;
    const sunriseHourAngle = this.acos(
      (-this.sin(sunAlt) - this.sin(lat) * this.sin(sun.declination)) /
      (this.cos(lat) * this.cos(sun.declination))
    ) / 15.0;

    const sunrise = noon - sunriseHourAngle;
    const sunset = noon + sunriseHourAngle;

    // Fajr
    const fajrHourAngle = this.acos(
      (-this.sin(params.fajrAngle) - this.sin(lat) * this.sin(sun.declination)) /
      (this.cos(lat) * this.cos(sun.declination))
    ) / 15.0;
    const fajr = noon - fajrHourAngle;

    // Asr (Standard shadow = 1)
    const asrAlt = this.atan(1 + this.tan(Math.abs(lat - sun.declination)));
    const asrHourAngle = this.acos(
      (this.sin(asrAlt) - this.sin(lat) * this.sin(sun.declination)) /
      (this.cos(lat) * this.cos(sun.declination))
    ) / 15.0;
    const asr = noon + asrHourAngle;

    // Maghrib
    const maghrib = sunset;

    // Isha
    let isha;
    if (params.ishaInterval) {
      isha = maghrib + params.ishaInterval / 60.0;
    } else {
      const ishaHourAngle = this.acos(
        (-this.sin(params.ishaAngle) - this.sin(lat) * this.sin(sun.declination)) /
        (this.cos(lat) * this.cos(sun.declination))
      ) / 15.0;
      isha = noon + ishaHourAngle;
    }

    return {
      Fajr: this.floatToTime(fajr),
      Sunrise: this.floatToTime(sunrise),
      Dhuhr: this.floatToTime(noon),
      Asr: this.floatToTime(asr),
      Maghrib: this.floatToTime(maghrib),
      Isha: this.floatToTime(isha)
    };
  }

  floatToTime(h) {
    h = this.fixHour(h + 0.5 / 60); // Round to nearest minute
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}

// ==========================================
// 3. Qibla Calculator
// ==========================================
function calculateQibla(lat, lng) {
  const phiK = CONFIG.MECCA_COORDS.lat * Math.PI / 180.0;
  const lambdaK = CONFIG.MECCA_COORDS.lng * Math.PI / 180.0;
  const phi = lat * Math.PI / 180.0;
  const lambda = lng * Math.PI / 180.0;

  const numerator = Math.sin(lambdaK - lambda);
  const denominator = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  
  let qiblaRad = Math.atan2(numerator, denominator);
  let qiblaDeg = qiblaRad * 180.0 / Math.PI;
  if (qiblaDeg < 0) {
    qiblaDeg += 360;
  }
  return Math.round(qiblaDeg);
}

function getCompassHeading(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// ==========================================
// 4. Web Audio Synthesizer (Adhan Chime)
// ==========================================
class ChimeSynthesizer {
  constructor() {
    this.audioCtx = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  playSoftChime() {
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 harmonic arpeggio

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0, now + idx * 0.18);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.18 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 1.6);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 1.8);
      });
    } catch (e) {
      console.warn('Audio chime playback notice:', e);
    }
  }
}

// ==========================================
// 5. Main Application Controller Class
// ==========================================
class YoussefsClockApp {
  constructor() {
    this.calculator = new SolarPrayerCalculator();
    this.chime = new ChimeSynthesizer();

    // App state
    this.state = {
      is24Hour: localStorage.getItem(CONFIG.STORAGE_KEYS.TIME_FORMAT) !== '12h',
      language: localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || 'en',
      location: this.loadSavedLocation(),
      methodId: localStorage.getItem(CONFIG.STORAGE_KEYS.METHOD) || CONFIG.DEFAULT_METHOD,
      soundEnabled: localStorage.getItem(CONFIG.STORAGE_KEYS.SOUND) !== 'false',
      prayerTimes: null,
      hijriData: null,
      nextPrayer: null,
      prevPrayer: null,
      lastChimedPrayer: null
    };

    // DOM Elements Cache
    this.dom = {
      // Top Controls
      locationBtn: document.getElementById('locationBtn'),
      locationText: document.getElementById('locationText'),
      formatToggleBtn: document.getElementById('formatToggleBtn'),
      formatBadge: document.getElementById('formatBadge'),
      soundToggleBtn: document.getElementById('soundToggleBtn'),
      soundIconOn: document.getElementById('soundIconOn'),
      soundIconOff: document.getElementById('soundIconOff'),
      qiblaBtn: document.getElementById('qiblaBtn'),
      langToggleBtn: document.getElementById('langToggleBtn'),
      langText: document.getElementById('langText'),
      refreshBtn: document.getElementById('refreshBtn'),

      // Date Display
      currentDateFormatted: document.getElementById('currentDateFormatted'),
      currentDayName: document.getElementById('currentDayName'),
      hijriDateText: document.getElementById('hijriDateText'),

      // Clock Display
      clockHours: document.getElementById('clockHours'),
      clockMinutes: document.getElementById('clockMinutes'),
      clockSeconds: document.getElementById('clockSeconds'),
      ampmIndicator: document.getElementById('ampmIndicator'),
      ampmText: document.getElementById('ampmText'),

      // Subtitle & Banner
      brandSubtitle: document.getElementById('brandSubtitle'),
      nextPrayerBadgeLabel: document.getElementById('nextPrayerBadgeLabel'),
      nextPrayerNameBanner: document.getElementById('nextPrayerNameBanner'),
      nextPrayerCountdown: document.getElementById('nextPrayerCountdown'),
      prayerProgressBar: document.getElementById('prayerProgressBar'),

      // Prayer Times Table & Stats
      prayerTimesTitle: document.getElementById('prayerTimesTitle'),
      calcMethodBadge: document.getElementById('calcMethodBadge'),
      timezoneInfo: document.getElementById('timezoneInfo'),
      prayersGrid: document.getElementById('prayersGrid'),
      statNextLabel: document.getElementById('statNextLabel'),
      statNextValue: document.getElementById('statNextValue'),
      statRemainingLabel: document.getElementById('statRemainingLabel'),
      statRemainingValue: document.getElementById('statRemainingValue'),
      statQiblaLabel: document.getElementById('statQiblaLabel'),
      statQiblaValue: document.getElementById('statQiblaValue'),
      footerDesc: document.getElementById('footerDesc'),

      // Modals
      locationModal: document.getElementById('locationModal'),
      closeLocationModalBtn: document.getElementById('closeLocationModalBtn'),
      useGpsBtn: document.getElementById('useGpsBtn'),
      gpsBtnText: document.getElementById('gpsBtnText'),
      gpsSpinner: document.getElementById('gpsSpinner'),
      gpsIcon: document.getElementById('gpsIcon'),
      citySearchInput: document.getElementById('citySearchInput'),
      searchClearBtn: document.getElementById('searchClearBtn'),
      citiesList: document.getElementById('citiesList'),
      methodSelect: document.getElementById('methodSelect'),
      modalTitle: document.getElementById('modalTitle'),
      dividerOr: document.getElementById('dividerOr'),
      quickPickTitle: document.getElementById('quickPickTitle'),
      calcMethodLabel: document.getElementById('calcMethodLabel'),

      // Qibla Modal
      qiblaModal: document.getElementById('qiblaModal'),
      closeQiblaModalBtn: document.getElementById('closeQiblaModalBtn'),
      compassPointer: document.getElementById('compassPointer'),
      qiblaAngleDisplay: document.getElementById('qiblaAngleDisplay'),
      qiblaDescText: document.getElementById('qiblaDescText'),
      qiblaCitySub: document.getElementById('qiblaCitySub'),
      qiblaModalTitle: document.getElementById('qiblaModalTitle'),

      // Toast
      appToast: document.getElementById('appToast'),
      toastMessage: document.getElementById('toastMessage')
    };
  }

  // ==========================================
  // Initialization
  // ==========================================
  init() {
    this.bindEvents();
    this.renderPopularCitiesList();
    this.applyLanguage(this.state.language);
    this.updateSoundIcon();
    this.updateFormatBadge();

    // Start live clock engine
    this.startClock();

    // Initialize location: try GPS on first visit if not explicitly saved
    const hasStoredLoc = localStorage.getItem(CONFIG.STORAGE_KEYS.LOCATION);
    if (!hasStoredLoc && navigator.geolocation) {
      this.detectGeolocation(false); // background attempt
    } else {
      this.fetchPrayerTimes();
    }
  }

  loadSavedLocation() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.LOCATION);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading saved location:', e);
    }
    return { ...CONFIG.DEFAULT_LOCATION };
  }

  saveLocation(loc) {
    this.state.location = loc;
    localStorage.setItem(CONFIG.STORAGE_KEYS.LOCATION, JSON.stringify(loc));
  }

  // ==========================================
  // Live Clock & Date Engine
  // ==========================================
  startClock() {
    this.updateClock();
    // High-frequency tick for smooth second changes
    setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    const now = new Date();

    // Strict requirement: Top center date formatted as YYYY-MM-DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    if (this.dom.currentDateFormatted.textContent !== formattedDate) {
      this.dom.currentDateFormatted.textContent = formattedDate;
      this.dom.currentDateFormatted.dateTime = formattedDate;
    }

    // Day of the week
    const dayIndex = now.getDay();
    const dayName = I18N[this.state.language].days[dayIndex];
    // Short, tracked English weekday; Arabic stays joined and fully readable.
    const dayLabel = this.state.language === 'en' ? dayName.slice(0, 3).toUpperCase() : dayName;
    if (this.dom.currentDayName.textContent !== dayLabel) {
      this.dom.currentDayName.textContent = dayLabel;
    }
    this.dom.currentDayName.title = dayName;

    // Time digits (HH:MM:SS)
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let ampm = '';

    if (!this.state.is24Hour) {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      this.dom.ampmIndicator.classList.add('visible');
      this.dom.ampmText.textContent = ampm;
    } else {
      this.dom.ampmIndicator.classList.remove('visible');
    }

    const hoursStr = String(hours).padStart(2, '0');

    this.dom.clockHours.textContent = hoursStr;
    this.dom.clockMinutes.textContent = minutes;
    this.dom.clockSeconds.textContent = seconds;

    // Update Next Prayer calculation & live countdown
    this.updateNextPrayerStatus(now);
  }

  // ==========================================
  // Geolocation & Prayer Times Fetcher
  // ==========================================
  async detectGeolocation(showToasts = true) {
    if (!navigator.geolocation) {
      if (showToasts) this.showToast(I18N[this.state.language].toastGpsDenied);
      this.fetchPrayerTimes();
      return;
    }

    if (this.dom.gpsSpinner) this.dom.gpsSpinner.classList.remove('hidden');
    if (this.dom.gpsIcon) this.dom.gpsIcon.classList.add('hidden');
    if (this.dom.gpsBtnText) this.dom.gpsBtnText.textContent = I18N[this.state.language].gpsLocating;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Reverse geocoding attempt or fallback name
        let detectedCity = 'GPS Location';
        let detectedCountry = '';

        try {
          // Nearest popular city match or bigdatacloud reverse geocode
          const nearest = this.findNearestCity(lat, lng);
          if (nearest && nearest.distanceKm < 40) {
            detectedCity = this.state.language === 'ar' ? (nearest.nameAr || nearest.name) : nearest.name;
            detectedCountry = this.state.language === 'ar' ? (nearest.countryAr || nearest.country) : nearest.country;
          } else {
            // Friendly coordinate label
            detectedCity = `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
          }
        } catch (e) {
          console.warn('Reverse geocoding helper note:', e);
        }

        const newLoc = {
          name: detectedCity,
          country: detectedCountry,
          lat,
          lng,
          isGps: true
        };

        this.saveLocation(newLoc);
        this.resetGpsButton();
        this.closeModal(this.dom.locationModal);
        if (showToasts) this.showToast(I18N[this.state.language].toastGpsSuccess);
        await this.fetchPrayerTimes();
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err.message);
        this.resetGpsButton();
        if (showToasts) this.showToast(I18N[this.state.language].toastGpsDenied);
        // Seamlessly use fallback location (Doha)
        this.fetchPrayerTimes();
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }

  resetGpsButton() {
    if (this.dom.gpsSpinner) this.dom.gpsSpinner.classList.add('hidden');
    if (this.dom.gpsIcon) this.dom.gpsIcon.classList.remove('hidden');
    if (this.dom.gpsBtnText) this.dom.gpsBtnText.textContent = I18N[this.state.language].gpsBtn;
  }

  findNearestCity(lat, lng) {
    let nearest = null;
    let minDistance = Infinity;

    POPULAR_CITIES.forEach((city) => {
      const d = this.calculateDistance(lat, lng, city.lat, city.lng);
      if (d < minDistance) {
        minDistance = d;
        nearest = { ...city, distanceKm: d };
      }
    });

    return nearest;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async fetchPrayerTimes() {
    const loc = this.state.location;
    const method = this.state.methodId;
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);

    // Update location badge in UI
    const locDisplayName = this.state.language === 'ar'
      ? (loc.nameAr || loc.name) + (loc.countryAr ? `, ${loc.countryAr}` : (loc.country ? `, ${loc.country}` : ''))
      : loc.name + (loc.country ? `, ${loc.country}` : '');
    this.dom.locationText.textContent = locDisplayName;

    // Calculation method name update
    if (this.dom.methodSelect) {
      this.dom.methodSelect.value = method;
      const selectedOption = this.dom.methodSelect.options[this.dom.methodSelect.selectedIndex];
      if (selectedOption) {
        this.dom.calcMethodBadge.textContent = selectedOption.text.split('(')[0].trim();
      }
    }

    // Update Qibla Bearing in stat & modal
    const qiblaDeg = calculateQibla(loc.lat, loc.lng);
    const qiblaHeading = getCompassHeading(qiblaDeg);
    this.dom.statQiblaValue.textContent = `${qiblaDeg}° ${qiblaHeading}`;
    this.dom.qiblaAngleDisplay.textContent = `${qiblaDeg}°`;
    this.dom.compassPointer.style.transform = `rotate(${qiblaDeg}deg)`;
    this.dom.qiblaCitySub.textContent = `${I18N[this.state.language].qiblaFrom} ${locDisplayName}`;

    // Update Timezone badge
    const tzOffsetHours = -now.getTimezoneOffset() / 60;
    const tzSign = tzOffsetHours >= 0 ? '+' : '-';
    const tzAbs = Math.abs(tzOffsetHours);
    this.dom.timezoneInfo.textContent = `UTC${tzSign}${String(tzAbs).padStart(2, '0')}:00`;

    // Attempt API Fetch with Astronomical Calculator fallback
    let fetched = false;
    const apiUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${loc.lat}&longitude=${loc.lng}&method=${method}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.code === 200 && data.data) {
          const timings = data.data.timings;
          this.state.prayerTimes = {
            Fajr: timings.Fajr.substring(0, 5),
            Sunrise: timings.Sunrise.substring(0, 5),
            Dhuhr: timings.Dhuhr.substring(0, 5),
            Asr: timings.Asr.substring(0, 5),
            Maghrib: timings.Maghrib.substring(0, 5),
            Isha: timings.Isha.substring(0, 5)
          };

          if (data.data.date && data.data.date.hijri) {
            this.state.hijriData = data.data.date.hijri;
            this.renderHijriDate(data.data.date.hijri);
          }
          fetched = true;
        }
      }
    } catch (e) {
      console.warn('Aladhan API fetch failed or timed out. Falling back to local offline calculations:', e);
    }

    // Local calculation fallback if API is unreachable
    if (!fetched) {
      this.state.prayerTimes = this.calculator.compute(now, loc.lat, loc.lng, tzOffsetHours, method);
      this.renderFallbackHijriDate(now);
    }

    // Render prayer schedule cards
    this.renderPrayerTimesCards();
    this.updateNextPrayerStatus(now);
  }

  renderHijriDate(hijri) {
    if (!hijri) return;
    const day = hijri.day;
    const month = this.state.language === 'ar' ? hijri.month.ar : hijri.month.en;
    const year = hijri.year;
    const suffix = this.state.language === 'ar' ? 'هـ' : 'AH';
    this.dom.hijriDateText.textContent = `${day} ${month} ${year} ${suffix}`;
  }

  renderFallbackHijriDate(date) {
    try {
      const formatter = new Intl.DateTimeFormat(this.state.language === 'ar' ? 'ar-SA-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const parts = formatter.format(date);
      const suffix = this.state.language === 'ar' ? 'هـ' : 'AH';
      this.dom.hijriDateText.textContent = `${parts} ${suffix}`;
    } catch (e) {
      this.dom.hijriDateText.textContent = '1448 AH';
    }
  }

  // ==========================================
  // Render Prayer Times Cards & Table
  // ==========================================
  renderPrayerTimesCards() {
    if (!this.state.prayerTimes) return;

    const prayerKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    prayerKeys.forEach((key) => {
      const rawTime = this.state.prayerTimes[key];
      const timeElem = document.getElementById(`time-${key}`);
      const ampmElem = document.getElementById(`ampm-${key}`);

      if (!timeElem || !rawTime) return;

      const [hStr, mStr] = rawTime.split(':');
      let hours = parseInt(hStr, 10);
      const minutes = mStr;

      if (!this.state.is24Hour) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        timeElem.textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
        if (ampmElem) {
          ampmElem.textContent = ampm;
          ampmElem.style.display = 'inline';
        }
      } else {
        timeElem.textContent = rawTime;
        if (ampmElem) {
          ampmElem.style.display = 'none';
        }
      }
    });
  }

  // ==========================================
  // Next Prayer Calculation & Real-time Countdown
  // ==========================================
  updateNextPrayerStatus(now) {
    if (!this.state.prayerTimes) return;

    const prayerKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    let nextKey = null;
    let prevKey = null;
    let nextPrayerDate = null;
    let prevPrayerDate = null;

    // Convert prayer times to Date objects for today
    const prayerDates = prayerKeys.map((key) => {
      const [h, m] = this.state.prayerTimes[key].split(':').map(Number);
      const d = new Date(now);
      d.setHours(h, m, 0, 0);
      return { key, timeMinutes: h * 60 + m, date: d };
    });

    for (let i = 0; i < prayerDates.length; i++) {
      if (prayerDates[i].timeMinutes > currentMinutes) {
        nextKey = prayerDates[i].key;
        nextPrayerDate = prayerDates[i].date;
        prevKey = i > 0 ? prayerDates[i - 1].key : 'Isha';
        if (i > 0) {
          prevPrayerDate = prayerDates[i - 1].date;
        } else {
          // Yesterday's Isha
          const prevD = new Date(prayerDates[prayerDates.length - 1].date);
          prevD.setDate(prevD.getDate() - 1);
          prevPrayerDate = prevD;
        }
        break;
      }
    }

    // If past Isha, next is tomorrow's Fajr
    if (!nextKey) {
      nextKey = 'Fajr';
      const tomorrowFajr = new Date(prayerDates[0].date);
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
      nextPrayerDate = tomorrowFajr;
      prevKey = 'Isha';
      prevPrayerDate = prayerDates[prayerDates.length - 1].date;
    }

    // Highlight prayer cards
    prayerKeys.forEach((key) => {
      const card = document.getElementById(`prayer-${key}`);
      const badge = document.getElementById(`badge-${key}`);
      if (!card) return;

      const [h, m] = this.state.prayerTimes[key].split(':').map(Number);
      const itemMinutes = h * 60 + m;

      card.classList.remove('active-next', 'passed');

      if (key === nextKey) {
        card.classList.add('active-next');
        if (badge) {
          badge.textContent = this.state.language === 'ar' ? 'التالي' : 'NEXT';
        }
      } else if (itemMinutes < currentMinutes && !(nextKey === 'Fajr' && currentMinutes > prayerDates[5].timeMinutes && key === 'Fajr')) {
        card.classList.add('passed');
      }
    });

    // Calculate countdown diff
    const diffMs = Math.max(0, nextPrayerDate.getTime() - now.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);
    const hoursRemaining = Math.floor(totalSeconds / 3600);
    const minutesRemaining = Math.floor((totalSeconds % 3600) / 60);
    const secondsRemaining = totalSeconds % 60;

    const formattedCountdown = `${String(hoursRemaining).padStart(2, '0')}:${String(minutesRemaining).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`;

    // Update banner & stats
    const nextNameLocalized = I18N[this.state.language].prayers[nextKey] || nextKey;
    this.dom.nextPrayerNameBanner.textContent = nextNameLocalized;
    this.dom.nextPrayerCountdown.textContent = `${I18N[this.state.language].startsIn} ${formattedCountdown}`;
    this.dom.statNextValue.textContent = nextNameLocalized;
    this.dom.statRemainingValue.textContent = formattedCountdown;

    // Progress Bar Calculation
    if (prevPrayerDate && nextPrayerDate) {
      const totalInterval = nextPrayerDate.getTime() - prevPrayerDate.getTime();
      const elapsed = now.getTime() - prevPrayerDate.getTime();
      const progressPercent = Math.min(100, Math.max(0, (elapsed / totalInterval) * 100));
      this.dom.prayerProgressBar.style.width = `${progressPercent.toFixed(1)}%`;
    }

    // Audio chime notification when prayer time is reached (0 seconds)
    if (totalSeconds === 0 && this.state.soundEnabled && this.state.lastChimedPrayer !== nextKey) {
      this.state.lastChimedPrayer = nextKey;
      this.chime.playSoftChime();
      this.showToast(`🕌 ${nextNameLocalized} Adhan Time!`);
    }
  }

  // ==========================================
  // Localization & Language Switcher
  // ==========================================
  applyLanguage(lang) {
    this.state.language = lang;
    localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
    const strings = I18N[lang];

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Button label
    this.dom.langText.textContent = strings.langName;
    this.dom.langText.lang = lang === 'ar' ? 'en' : 'ar';
    Object.entries(strings.controlLabels).forEach(([key, label]) => {
      this.dom[key].title = label;
      this.dom[key].setAttribute('aria-label', label);
    });
    this.dom.citySearchInput.setAttribute('aria-label', strings.searchLabel);

    // UI Texts
    this.dom.brandSubtitle.textContent = strings.brandSubtitle;
    this.dom.nextPrayerBadgeLabel.textContent = strings.nextPrayerBadge;
    this.dom.prayerTimesTitle.textContent = strings.prayerTimesTitle;
    this.dom.statNextLabel.textContent = strings.nextAdhanLabel;
    this.dom.statRemainingLabel.textContent = strings.remainingLabel;
    this.dom.statQiblaLabel.textContent = strings.qiblaLabel;
    this.dom.footerDesc.textContent = strings.footerDesc;

    // Modal texts
    this.dom.modalTitle.textContent = strings.modalTitle;
    this.dom.gpsBtnText.textContent = strings.gpsBtn;
    this.dom.dividerOr.textContent = strings.dividerOr;
    this.dom.citySearchInput.placeholder = strings.searchPlaceholder;
    this.dom.quickPickTitle.textContent = strings.quickPickTitle;
    this.dom.calcMethodLabel.textContent = strings.calcMethodLabel;
    this.dom.qiblaModalTitle.textContent = strings.qiblaModalTitle;
    this.dom.qiblaDescText.textContent = strings.qiblaDesc;

    // Update prayer names in cards
    const prayerKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    prayerKeys.forEach((key) => {
      const card = document.getElementById(`prayer-${key}`);
      if (card) {
        const nameSpan = card.querySelector('.prayer-name');
        if (nameSpan) {
          nameSpan.textContent = strings.prayers[key];
        }
      }
    });

    // Update the day immediately, without waiting for the next clock tick.
    this.updateClock();
    this.renderPopularCitiesList();
    this.fetchPrayerTimes();
  }

  // ==========================================
  // Format & Sound Toggles
  // ==========================================
  toggleTimeFormat() {
    this.state.is24Hour = !this.state.is24Hour;
    localStorage.setItem(CONFIG.STORAGE_KEYS.TIME_FORMAT, this.state.is24Hour ? '24h' : '12h');
    this.updateFormatBadge();
    this.renderPrayerTimesCards();
    this.updateClock();
  }

  updateFormatBadge() {
    this.dom.formatBadge.textContent = this.state.is24Hour ? '24H' : '12H';
    this.dom.formatToggleBtn.setAttribute('aria-pressed', String(!this.state.is24Hour));
  }

  toggleSound() {
    this.state.soundEnabled = !this.state.soundEnabled;
    localStorage.setItem(CONFIG.STORAGE_KEYS.SOUND, this.state.soundEnabled);
    this.updateSoundIcon();
    if (this.state.soundEnabled) {
      this.chime.playSoftChime();
      this.showToast('🔔 Audio Chime Enabled');
    } else {
      this.showToast('🔕 Audio Chime Muted');
    }
  }

  updateSoundIcon() {
    this.dom.soundToggleBtn.setAttribute('aria-pressed', String(this.state.soundEnabled));
    if (this.state.soundEnabled) {
      this.dom.soundIconOn.classList.remove('hidden');
      this.dom.soundIconOff.classList.add('hidden');
    } else {
      this.dom.soundIconOn.classList.add('hidden');
      this.dom.soundIconOff.classList.remove('hidden');
    }
  }

  // ==========================================
  // Popular Cities Grid & Search Filter
  // ==========================================
  renderPopularCitiesList(filterQuery = '') {
    if (!this.dom.citiesList) return;
    this.dom.citiesList.innerHTML = '';

    const isAr = this.state.language === 'ar';
    const query = filterQuery.toLowerCase().trim();

    const filtered = POPULAR_CITIES.filter((city) => {
      if (!query) return true;
      const matchNameEn = city.name.toLowerCase().includes(query);
      const matchCountryEn = city.country.toLowerCase().includes(query);
      const matchNameAr = (city.nameAr || '').includes(query);
      const matchCountryAr = (city.countryAr || '').includes(query);
      return matchNameEn || matchCountryEn || matchNameAr || matchCountryAr;
    });

    if (filtered.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.gridColumn = '1 / -1';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.padding = '1rem';
      emptyMsg.style.color = 'var(--text-muted)';
      emptyMsg.textContent = isAr ? 'لم يتم العثور على مدينة مطابقة' : 'No matching city found';
      this.dom.citiesList.appendChild(emptyMsg);
      return;
    }

    filtered.forEach((city) => {
      const btn = document.createElement('button');
      btn.className = 'city-chip';
      if (this.state.location.name === city.name) {
        btn.classList.add('selected');
      }

      const cityName = isAr ? (city.nameAr || city.name) : city.name;
      const cityCountry = isAr ? (city.countryAr || city.country) : city.country;

      btn.innerHTML = `
        <span class="city-name">${cityName}</span>
        <span class="city-country">${cityCountry}</span>
      `;

      btn.addEventListener('click', () => {
        this.saveLocation(city);
        this.closeModal(this.dom.locationModal);
        this.showToast(`${I18N[this.state.language].toastLocationUpdated} ${cityName}`);
        this.fetchPrayerTimes();
      });

      this.dom.citiesList.appendChild(btn);
    });
  }

  // ==========================================
  // Modal Management
  // ==========================================
  openModal(modal) {
    if (!modal) return;
    this.modalReturnFocus = document.activeElement;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    modal.querySelector('button, input, select')?.focus();
  }

  closeModal(modal) {
    if (!modal || modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    this.modalReturnFocus?.focus();
  }

  showToast(message) {
    if (!this.dom.appToast) return;
    this.dom.toastMessage.textContent = message;
    this.dom.appToast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.appToast.classList.remove('show');
    }, 3200);
  }

  // ==========================================
  // Event Bindings
  // ==========================================
  bindEvents() {
    // Top Controls
    this.dom.formatToggleBtn.addEventListener('click', () => this.toggleTimeFormat());
    this.dom.soundToggleBtn.addEventListener('click', () => this.toggleSound());
    this.dom.langToggleBtn.addEventListener('click', () => {
      const nextLang = this.state.language === 'en' ? 'ar' : 'en';
      this.applyLanguage(nextLang);
    });

    this.dom.refreshBtn.addEventListener('click', async () => {
      const icon = this.dom.refreshBtn.querySelector('.refresh-icon');
      if (icon) icon.classList.add('rotating');
      await this.fetchPrayerTimes();
      this.showToast(I18N[this.state.language].toastRefreshed);
      setTimeout(() => {
        if (icon) icon.classList.remove('rotating');
      }, 800);
    });

    // Location Modal
    this.dom.locationBtn.addEventListener('click', () => {
      this.openModal(this.dom.locationModal);
      if (this.dom.citySearchInput) {
        this.dom.citySearchInput.value = '';
        this.dom.searchClearBtn.classList.add('hidden');
        this.renderPopularCitiesList();
        this.dom.citySearchInput.focus();
      }
    });

    this.dom.closeLocationModalBtn.addEventListener('click', () => this.closeModal(this.dom.locationModal));
    this.dom.locationModal.addEventListener('click', (e) => {
      if (e.target === this.dom.locationModal) {
        this.closeModal(this.dom.locationModal);
      }
    });

    // GPS Detect Button
    this.dom.useGpsBtn.addEventListener('click', () => this.detectGeolocation(true));

    // Search Input in Location Modal
    this.dom.citySearchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val) {
        this.dom.searchClearBtn.classList.remove('hidden');
      } else {
        this.dom.searchClearBtn.classList.add('hidden');
      }
      this.renderPopularCitiesList(val);
    });

    this.dom.searchClearBtn.addEventListener('click', () => {
      this.dom.citySearchInput.value = '';
      this.dom.searchClearBtn.classList.add('hidden');
      this.renderPopularCitiesList('');
      this.dom.citySearchInput.focus();
    });

    // Calculation Method Select
    this.dom.methodSelect.addEventListener('change', (e) => {
      this.state.methodId = e.target.value;
      localStorage.setItem(CONFIG.STORAGE_KEYS.METHOD, this.state.methodId);
      this.fetchPrayerTimes();
    });

    // Qibla Modal
    this.dom.qiblaBtn.addEventListener('click', () => this.openModal(this.dom.qiblaModal));
    this.dom.closeQiblaModalBtn.addEventListener('click', () => this.closeModal(this.dom.qiblaModal));
    this.dom.qiblaModal.addEventListener('click', (e) => {
      if (e.target === this.dom.qiblaModal) {
        this.closeModal(this.dom.qiblaModal);
      }
    });

    // Keep keyboard focus inside the open dialog and restore it on close.
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal(this.dom.locationModal);
        this.closeModal(this.dom.qiblaModal);
      }
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal-backdrop:not(.hidden)');
        if (!modal) return;
        const focusable = [...modal.querySelectorAll('button, input, select')]
          .filter((element) => !element.disabled && element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    });
  }
}

// ==========================================
// Bootstrap Application on DOM Ready
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const app = new YoussefsClockApp();
  app.init();
});
