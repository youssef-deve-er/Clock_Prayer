# ⏱️ Youssef's Clock — Precision Digital Clock & Islamic Prayer Times

<div align="center">

![Project Status](https://img.shields.io/badge/Status-Active-00f2fe?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-4facfe?style=for-the-badge)
![Theme](https://img.shields.io/badge/Design-Futuristic%20Glassmorphic-6366f1?style=for-the-badge)
![API](https://img.shields.io/badge/API-Aladhan%20%2B%20Solar%20Engine-10b981?style=for-the-badge)

**A modern, ultra-responsive single-page digital clock and dynamic Islamic prayer times web application built with a futuristic glassmorphic aesthetic.**

[English](#english) • [العربية](#arabic)

</div>

---

## 🌟 Highlights & Features

- 🕒 **Live High-Precision Digital Clock**: Real-time clock updating every second (`HH:MM:SS`) with support for 12-hour and 24-hour modes.
- 📅 **Accurate Date Formats**: Top-center date display strictly in `YYYY-MM-DD` format alongside Day name and Hijri lunar date (e.g., `1448 AH`).
- 🌐 **Automatic Geolocation (GPS)**: Seamless location detection via `navigator.geolocation` with zero-friction fallback to Doha, Qatar (`25.2854° N, 51.5310° E`).
- 🕌 **Aladhan API & Offline Solar Calculation Engine**: Fetches real-time prayer times directly from Aladhan API with an embedded astronomical calculation engine (Umm Al-Qura, MWL, Egyptian, ISNA, Karachi, Gulf).
- ⚡ **Next Prayer Highlighting & Countdown**: Dynamically identifies the upcoming prayer, highlighting it with an animated glowing neon border, active badge, real-time countdown timer (`in HH:MM:SS`), and visual interval progress bar.
- 🧭 **Built-in Qibla Compass**: Calculates the exact spherical trigonometric bearing towards the Holy Kaaba in Makkah with an interactive visual compass dial.
- 🎨 **Futuristic Glassmorphic UI**: Deep midnight navy gradient background with ambient animated floating light orbs, glowing cyan laser beam divider, and frosted glass cards (`backdrop-filter: blur(24px)`).
- 🔊 **Synthesized Web Audio Chimes**: Gentle harmonic chime tone synthesized on-the-fly using the Web Audio API when prayer time arrives (no external audio files required).
- 🌍 **Full Bilingual Localization (EN / AR)**: Instant one-click language switching between English and Arabic with complete RTL (Right-to-Left) layout support.
- 📱 **100% Responsive Design**: Perfectly optimized for ultra-wide desktops, laptops, tablets, and smartphones.

---

## 📐 Visual Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [📍 Doha, Qatar ▼]                                 [24H] [🔔] [🧭] [EN] │
│                                                                        │
│                      [ 📅 2026-09-07 • Monday ]                        │
│                         [ 🌙 25 Safar 1448 AH ]                        │
│                                                                        │
│                            1 9 : 2 4 : 4 5                             │
│               ═══════════════ ✦ ═══════════════ (Glow Bar)             │
│                           YOUSSEF'S CLOCK                              │
│                    PRECISION TIME & PRAYER SCHEDULE                    │
│                                                                        │
│        [ 🟢 NEXT PRAYER: Maghrib ────────── in 01:24:35 ]              │
│        [=====================>..........................] (Progress)   │
│                                                                        │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │   FAJR   │ SUNRISE  │  DHUHR   │   ASR    │ MAGHRIB* │   ISHA   │   │
│  │  04:15   │  05:32   │  11:38   │  15:05   │  17:45   │  19:15   │   │
│  │  الفجر   │  الشروق   │  الظهر   │  العصر   │  المغرب  │  العشاء  │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘   │
│                                                                        │
│         Next: Maghrib  •  Remaining: 01:24:35  •  Qibla: 248° WSW      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack & Structure

- **HTML5**: Semantic tags, accessible ARIA attributes, SVG vector icons.
- **CSS3**: CSS Custom Properties (Variables), CSS Grid, Flexbox, Glassmorphism (`backdrop-filter`), keyframe glow animations, full RTL styling.
- **JavaScript (ES6+)**: Modular Object-Oriented architecture, Web Audio API, Geolocation API, Intl API, LocalStorage persistence.
- **Typography**: `Orbitron`, `Rajdhani`, `Plus Jakarta Sans`, and `Cairo` via Google Fonts.

### Project Files

```tree
Clock_Prayer/
├── index.html       # Semantic single-page application structure
├── style.css        # Futuristic theme, animations, glassmorphic styling & responsive rules
├── app.js           # Live clock, Aladhan API fetcher, solar calculator, Qibla & UI handlers
└── README.md        # Comprehensive documentation (EN & AR)
```

---

## 🚀 Getting Started

### Local Setup

Simply clone the repository and open `index.html` in any modern web browser, or run a lightweight local static server:

```bash
# Clone repository
git clone https://github.com/youssef-deve-er/Clock_Prayer.git
cd Clock_Prayer

# Run a local HTTP server (Python 3)
python3 -m http.server 8080

# Or with Node.js
npx serve .
```

Open `http://localhost:8080` in your browser.

---

<a name="arabic"></a>
## 🇸🇦 النسخة العربية (Arabic Documentation)

### نظرة عامة
**Youssef's Clock** هو تطبيق ويب حديث وأنيق ذو صفحة واحدة (Single-page) يجمع بين ساعة رقمية حية فائقة الدقة وجدول متكامل لمواقيت الصلاة الإسلامية، بتصميم مستقبلي ساحر يعتمد على تقنية الزجاج الضبابي (Glassmorphism) وتأثيرات الإضاءة النيونية التفاعلية.

### الميزات الرئيسية:
1. **ساعة رقمية حية**: تعمل في الوقت الفعلي وتُحدّث بالثانية `HH:MM:SS` مع إمكانية التبديل بين نظامي 12 ساعة و 24 ساعة.
2. **التاريخ بتنسيق قياسي**: عرض التاريخ في أعلى المنتصف بتنسيق `YYYY-MM-DD` مع اسم اليوم والتقويم الهجري المقابل.
3. **التحديد التلقائي للموقع (GPS)**: استخدام `navigator.geolocation` لجلب إحداثيات المستخدم، مع نظام بديل فوري (Fallback) يعتمد على مدينة الدوحة، قطر (`UTC+3`)، بالإضافة إلى نافذة مدمجة للبحث والاختيار بين أكثر من 35 مدينة عالمية وإسلامية.
4. **الربط مع Aladhan API وخوارزمية فلكية احتياطية**: جلب المواقيت بدقة متناهية من Aladhan API، مع وجود محرك حسابات فلكية محلي (PrayTimes) يضمن عمل التطبيق بنسبة 100% حتى في حال انقطاع الاتصال بالإنترنت.
5. **التمييز التلقائي للصلاة القادمة**: إبراز بطاقة الصلاة القادمة بإطار متوهج، وشارة "التالي"، مع عداد تنازلي حي وشريط تقدم زمني بين الصلاتين.
6. **بوصلة اتجاه القبلة**: حساب دقيق لزاوية اتجاه الكعبة المشرفة بالنسبة للموقع الحالي مع قرص بوصلة تفاعلي.
7. **تنبيه صوتي لطيف**: نغمات إشعار متناسقة تم توليدها برمجياً عبر Web Audio API دون الحاجة إلى ملفات صوتية خارجية.
8. **دعم كامل للغتين العربية والإنجليزية**: واجهة ثنائية اللغة مع دعم كامل لاتجاه النص من اليمين إلى اليسار (RTL).

---

## 📄 License & Credits

Designed and developed with precision by **Youssef** & **Senior Frontend Architecture**.
Open-source under the MIT License.
