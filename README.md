# ⏱️ Youssef's Clock — Precision Digital Clock & Islamic Prayer Times

<div align="center">

![Project Status](https://img.shields.io/badge/Status-Active-00f2fe?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-4facfe?style=for-the-badge)
![Theme](https://img.shields.io/badge/Design-Atmospheric%20Mesh-a5b4fc?style=for-the-badge)
![API](https://img.shields.io/badge/API-Aladhan%20%2B%20Solar%20Engine-10b981?style=for-the-badge)

**A responsive digital clock and Islamic prayer schedule with a calm atmospheric mesh card, rounded geometric typography, and polished dark-glass controls.**

[English](#english) • [العربية](#arabic)

</div>

---

<a name="english"></a>
## 🌟 Highlights & Features

- 🕒 **Live High-Precision Digital Clock**: Real-time clock updating every second (`HH:MM:SS`) with support for 12-hour and 24-hour modes.
- 📅 **Day & Date Hierarchy**: A spaced, uppercase weekday (`MON`) above the live `YYYY-MM-DD` date. Arabic keeps the full, joined day name; the Hijri date remains available in the prayer schedule header.
- 🌐 **Automatic Geolocation (GPS)**: Seamless location detection via `navigator.geolocation` with zero-friction fallback to Doha, Qatar (`25.2854° N, 51.5310° E`).
- 🕌 **Aladhan API & Offline Solar Calculation Engine**: Fetches real-time prayer times directly from Aladhan API with an embedded astronomical calculation engine (Umm Al-Qura, MWL, Egyptian, ISNA, Karachi, Gulf).
- ⚡ **Next Prayer Highlighting & Countdown**: Dynamically identifies the upcoming prayer, highlighting it with a soft cyan border, a quiet active badge, real-time countdown timer (`in HH:MM:SS`), and visual interval progress bar.
- 🧭 **Built-in Qibla Compass**: Calculates the exact spherical trigonometric bearing towards the Holy Kaaba in Makkah with an interactive visual compass dial.
- 🎨 **Minimalist Atmospheric Mesh**: A central `36px`-radius card blends sky blue (`#1ba4f7`) on the left, lilac (`#c084fc`) above, and midnight black (`#050812`) to the right. Pure-white clock digits, a `90px` cyan light bar and a letter-spaced signature replace the technological/neon styling. The schedule and dialogs share the same muted palette.
- ♿ **Calmer, Accessible Controls**: No decorative blinking or floating particles; reduced-motion support, visible keyboard focus, localized control labels and keyboard-friendly dialogs. Numeric time stays left-to-right in both languages.
- 🔊 **Synthesized Web Audio Chimes**: Gentle harmonic chime tone synthesized on-the-fly using the Web Audio API when prayer time arrives (no external audio files required).
- 🌍 **Full Bilingual Localization (EN / AR)**: Instant one-click language switching between English and Arabic with complete RTL (Right-to-Left) layout support.
- 📱 **100% Responsive Design**: Perfectly optimized for ultra-wide desktops, laptops, tablets, and smartphones.

---

## 📐 Visual Architecture

```text
[ Doha, Qatar ▾ ]                     [24H] [Sound] [Qibla] [AR] [Sync]
╭──────────────────────────────────────────────────────────────────╮
│                           M O N                                  │
│                        2026-09-07                                │
│                                                                  │
│                         20:01:06                                 │
│                                                                  │
│                            ─────                                 │
│                   Y O U S S E F ' S  C L O C K                    │
│  sky blue / cyan → lilac above → midnight black                   │
╰──────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────────────╮
│ Today's Prayer Schedule                         Hijri date / UTC │
│ Calculation method                                               │
│ [ NEXT PRAYER   Fajr                       in HH:MM:SS ]          │
│ [ ─────────────────────── progress ────────────────── ]           │
│                                                                  │
│   Fajr*    Sunrise    Dhuhr    Asr    Maghrib    Isha               │
│   HH:MM     HH:MM     HH:MM   HH:MM   HH:MM     HH:MM              │
│                                                                  │
│ Next Adhan · Time Remaining · Qibla Direction                      │
╰──────────────────────────────────────────────────────────────────╯
```

---

## 🛠️ Tech Stack & Structure

- **HTML5**: Semantic tags, accessible ARIA attributes, SVG vector icons.
- **CSS3**: CSS Custom Properties (Variables), CSS Grid, Flexbox, layered radial mesh gradients, Glassmorphism (`backdrop-filter`), reduced-motion support, full RTL styling.
- **JavaScript (ES6+)**: Modular Object-Oriented architecture, Web Audio API, Geolocation API, Intl API, LocalStorage persistence.
- **Typography**: `Manrope` for rounded geometric clock digits and UI, and `Cairo` for Arabic, via Google Fonts with system-font fallbacks.

### Project Files

```tree
Clock_Prayer/
├── index.html       # Semantic single-page application structure
├── style.css        # Atmospheric mesh, dark glass, accessible controls & responsive rules
├── app.js           # Live clock, Aladhan API fetcher, solar calculator, Qibla & UI handlers
├── tests/clock.spec.js # Deterministic browser regression tests
├── playwright.config.js # Desktop & mobile Chromium test configuration
├── package.json     # Optional development-only test tooling (no runtime dependencies)
└── README.md        # Documentation (EN & AR)
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

Open `http://localhost:8080` in your browser. The app is still plain HTML, CSS and JavaScript: no build step or Node.js runtime is needed to serve it.

### Regression Tests

With Node.js 20+ and Python 3 installed:

```bash
npm ci
npx playwright install --with-deps chromium
npm run check
npm test
```

The suite runs in desktop and mobile Chromium, with additional layout checks at 320, 375, 640, 850 and 1280 pixels in English and Arabic. It covers the mesh-card hierarchy, live date/time, 12/24-hour and sound preferences, prayer countdown, city search, calculation-method selection, refresh, Qibla dialogs, GPS success/denial, API fallback, keyboard focus and reduced motion.

Prayer API responses and dates are fixed for deterministic UI tests; the suite does **not** certify astronomical accuracy. Google Fonts requests are stubbed to exercise the system-font fallback. To use an already-installed Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path. Generated reports, traces and dependencies are ignored by Git.

---

<a name="arabic"></a>
## 🇸🇦 النسخة العربية (Arabic Documentation)

### نظرة عامة
**Youssef's Clock** هو تطبيق ويب حديث وأنيق ذو صفحة واحدة (Single-page) يجمع بين ساعة رقمية حية فائقة الدقة وجدول متكامل لمواقيت الصلاة الإسلامية، بتصميم فني هادئ يعتمد على بطاقة ذات تدرج لوني شبكي (Mesh Gradient) وزوايا دائرية بقياس `36px`، مع جدول صلاة وأدوات تحكم من الزجاج الداكن المصقول.

### الميزات الرئيسية:
1. **ساعة رقمية حية**: تعمل في الوقت الفعلي وتُحدّث بالثانية `HH:MM:SS` مع إمكانية التبديل بين نظامي 12 ساعة و 24 ساعة.
2. **التاريخ بتنسيق قياسي**: عرض اسم اليوم أعلى البطاقة، مختصراً بحروف متباعدة في الإنجليزية وكاملاً دون فصل الحروف في العربية، ثم التاريخ بتنسيق `YYYY-MM-DD`. يظهر التاريخ الهجري في رأس جدول الصلاة.
3. **التحديد التلقائي للموقع (GPS)**: استخدام `navigator.geolocation` لجلب إحداثيات المستخدم، مع نظام بديل فوري (Fallback) يعتمد على مدينة الدوحة، قطر (`UTC+3`)، بالإضافة إلى نافذة مدمجة للبحث والاختيار بين أكثر من 35 مدينة عالمية وإسلامية.
4. **الربط مع Aladhan API وخوارزمية فلكية احتياطية**: جلب المواقيت بدقة متناهية من Aladhan API، مع وجود محرك حسابات فلكية محلي (PrayTimes) يضمن عمل التطبيق بنسبة 100% حتى في حال انقطاع الاتصال بالإنترنت.
5. **التمييز التلقائي للصلاة القادمة**: إبراز بطاقة الصلاة القادمة بإطار متوهج، وشارة "التالي"، مع عداد تنازلي حي وشريط تقدم زمني بين الصلاتين.
6. **بوصلة اتجاه القبلة**: حساب دقيق لزاوية اتجاه الكعبة المشرفة بالنسبة للموقع الحالي مع قرص بوصلة تفاعلي.
7. **تنبيه صوتي لطيف**: نغمات إشعار متناسقة تم توليدها برمجياً عبر Web Audio API دون الحاجة إلى ملفات صوتية خارجية.
8. **دعم اللغتين العربية والإنجليزية**: واجهة ثنائية اللغة مع دعم اتجاه النص من اليمين إلى اليسار (RTL)، مع بقاء أرقام الساعة والتاريخ بترتيب صحيح من اليسار إلى اليمين.
9. **هوية بصرية هادئة**: أزرق سماوي `#1ba4f7` يسار البطاقة، وليلكي `#c084fc` أعلى الوسط، وأسود ليلي `#050812` يمينها، مع أرقام بيضاء وشريط سيان بعرض `90px` وعنوان متباعد الحروف.
10. **سهولة الاستخدام والاختبار**: تركيز مرئي للوحة المفاتيح، نوافذ تدعم التنقل بمفتاح Tab والإغلاق بمفتاح Escape، واحترام تفضيل تقليل الحركة. لتشغيل اختبارات الواجهة اتبع قسم Regression Tests أعلاه.

---

## 📄 License & Credits

Designed and developed with precision by **Youssef** & **Senior Frontend Architecture**.
Open-source under the MIT License.
