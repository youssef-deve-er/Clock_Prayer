const { test, expect } = require('@playwright/test');

// Synthetic, fixed API data keeps UI regressions independent of network, date
// and calculation-method changes. These are not prayer-time accuracy tests.
const timings = {
  Fajr: '04:15', Sunrise: '05:32', Dhuhr: '11:38',
  Asr: '15:05', Maghrib: '17:45', Isha: '19:15'
};
const apiResponse = {
  code: 200,
  data: {
    timings,
    date: { hijri: { day: '25', month: { en: 'Rabi al-awwal', ar: 'ربيع الأول' }, year: '1448' } }
  }
};
const defaultLocation = {
  name: 'Doha', country: 'Qatar', nameAr: 'الدوحة', countryAr: 'قطر',
  lat: 25.2854, lng: 51.5310, timezone: 'Asia/Qatar', utcOffset: 3
};

async function openApp(page) {
  await page.goto('/');
  await expect(page.locator('.prayer-item.active-next')).toHaveCount(1);
}

async function expectNoOverflow(page) {
  const overflowing = await page.evaluate(() => {
    const selectors = [
      '.app-container', '.app-header', '.header-controls', '.mesh-clock-card',
      '.clock-display', '.brand-title', '.prayer-card-container', '.banner-inner',
      '.prayers-grid', '.prayer-item', '.glass-modal-card:not(.hidden)'
    ];
    return [...document.querySelectorAll(selectors.join(','))]
      .filter(element => element.getClientRects().length)
      .filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.left < -1 || rect.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1;
      })
      .map(element => element.id || element.className);
  });
  expect(overflowing).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-07T17:00:00Z') });
  await page.clock.pauseAt(new Date('2026-09-07T17:01:06Z'));
  await page.addInitScript(location => {
    const defaults = {
      youssef_clock_loc: JSON.stringify(location),
      youssef_clock_lang: 'en',
      youssef_clock_sound: 'false'
    };
    for (const [key, value] of Object.entries(defaults)) {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, value);
    }
  }, defaultLocation);
  await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: apiResponse }));
  // Also exercise the system-font fallback; no third-party fonts are needed to run tests.
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
});

test('mesh card hierarchy, palette and live day/date/time', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openApp(page);
  await expect(page.locator('.mesh-clock-card')).toHaveCSS('border-radius', '36px');
  await expect(page.locator('.mesh-clock-card')).toHaveCSS('background-image', /radial-gradient/);
  await expect(page.locator('#currentDayName')).toHaveText('MON');
  await expect(page.locator('#currentDayName')).toHaveAttribute('title', 'Monday');
  await expect(page.locator('#currentDayName')).toHaveCSS('color', 'rgb(165, 180, 252)');
  await expect(page.locator('#currentDateFormatted')).toHaveText('2026-09-07');
  await expect(page.locator('#currentDateFormatted')).toHaveAttribute('datetime', '2026-09-07');
  await expect(page.locator('#currentDateFormatted')).toHaveCSS('color', 'rgb(203, 213, 225)');
  await expect(page.locator('#clockHours')).toHaveText('20');
  await expect(page.locator('#clockMinutes')).toHaveText('01');
  await expect(page.locator('#clockSeconds')).toHaveText('06');
  await expect(page.locator('#clockDisplay')).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.locator('.glowing-light-bar-container')).toHaveCSS('width', '90px');
  await expect(page.locator('#clockTitle')).toHaveText("YOUSSEF'S CLOCK");
  const tops = await page.locator('#currentDayName, #currentDateFormatted, #clockDisplay, .glowing-light-bar-container, #clockTitle').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top));
  expect(tops).toEqual([...tops].sort((a, b) => a - b));
  await expect(page.locator('.mesh-clock-card #nextPrayerBanner')).toHaveCount(0);
  await expect(page.locator('.prayer-card-container #nextPrayerBanner')).toBeVisible();
  await page.clock.runFor(1000);
  await expect(page.locator('#clockSeconds')).toHaveText('07');
  expect(errors).toEqual([]);
});

test('clock updates its weekday and semantic date at midnight', async ({ page }) => {
  await openApp(page);
  await page.clock.fastForward(4 * 60 * 60 * 1000);
  await expect(page.locator('#currentDayName')).toHaveText('TUE');
  await expect(page.locator('#currentDateFormatted')).toHaveText('2026-09-08');
  await expect(page.locator('#currentDateFormatted')).toHaveAttribute('datetime', '2026-09-08');
});

test('prayer times, next-prayer highlight and countdown keep updating', async ({ page }) => {
  await openApp(page);
  for (const [key, value] of Object.entries(timings)) {
    await expect(page.locator(`#time-${key}`)).toHaveText(value);
  }
  await expect(page.locator('#prayer-Fajr')).toHaveClass(/active-next/);
  await expect(page.locator('#badge-Fajr')).toBeVisible();
  await expect(page.locator('#nextPrayerNameBanner')).toHaveText('Fajr');
  await expect(page.locator('#nextPrayerCountdown')).toHaveText('in 08:13:54');
  await page.clock.runFor(1000);
  await expect(page.locator('#nextPrayerCountdown')).toHaveText('in 08:13:53');
  await expect(page.locator('#statRemainingValue')).toHaveText('08:13:53');
  const progress = await page.locator('#prayerProgressBar').evaluate(element => parseFloat(element.style.width));
  expect(progress).toBeGreaterThan(0);
  expect(progress).toBeLessThan(100);
});

test('12/24-hour and sound preferences still work and persist', async ({ page }) => {
  await openApp(page);
  await page.locator('#formatToggleBtn').click();
  await expect(page.locator('#formatBadge')).toHaveText('12H');
  await expect(page.locator('#clockHours')).toHaveText('08');
  await expect(page.locator('#ampmIndicator')).toBeVisible();
  await expect(page.locator('#ampmText')).toHaveText('PM');
  await expect(page.locator('#time-Isha')).toHaveText('07:15');
  await expect(page.locator('#ampm-Isha')).toBeVisible();
  await expect(page.locator('#soundIconOn')).toBeHidden();
  await expect(page.locator('#soundIconOff')).toBeVisible();
  await page.locator('#soundToggleBtn').click();
  await expect(page.locator('#soundIconOn')).toBeVisible();
  await expect(page.locator('#soundIconOff')).toBeHidden();
  await expect(page.locator('#soundToggleBtn')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('#formatBadge')).toHaveText('12H');
  await expect(page.locator('#soundToggleBtn')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#formatToggleBtn').click();
  await expect(page.locator('#clockHours')).toHaveText('20');
  await expect(page.locator('#ampmIndicator')).toBeHidden();
  await expect(page.locator('#ampm-Isha')).toBeHidden();
});

test('Arabic translates immediately while numeric time remains left-to-right', async ({ page }) => {
  await openApp(page);
  await page.locator('#langToggleBtn').click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('#currentDayName')).toHaveText('الإثنين');
  await expect(page.locator('#currentDayName')).toHaveCSS('letter-spacing', 'normal');
  await expect(page.locator('#prayerTimesTitle')).toHaveText('مواقيت الصلاة لهذا اليوم');
  await expect(page.locator('#locationText')).toHaveText('الدوحة, قطر');
  await expect(page.locator('#locationBtn')).toHaveAttribute('aria-label', 'تغيير الموقع');
  await expect(page.locator('#clockDisplay')).toHaveCSS('direction', 'ltr');
  await expect(page.locator('#currentDateFormatted')).toHaveCSS('direction', 'ltr');
  const boxes = await page.locator('#hoursBox, #minutesBox, #secondsBox').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().left));
  expect(boxes[0]).toBeLessThan(boxes[1]);
  expect(boxes[1]).toBeLessThan(boxes[2]);
  await expect(page.locator('#prayer-Fajr .prayer-name')).toHaveText('الفجر');
  await expect(page.locator('#prayer-Fajr .prayer-arabic-sub')).toBeHidden();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.locator('#langToggleBtn').click();
  await expect(page.locator('#currentDayName')).toHaveText('MON');
});

test('city search, calculation method, refresh and Qibla dialogs remain usable', async ({ page }) => {
  await openApp(page);
  await expect(page.locator('#locationModal')).toBeHidden();
  await expect(page.locator('#qiblaModal')).toBeHidden();
  await page.locator('#locationBtn').click();
  await expect(page.locator('#citySearchInput')).toBeFocused();
  await page.locator('#citySearchInput').fill('Dubai');
  await expect(page.locator('.city-chip')).toHaveCount(1);
  await expect(page.locator('#searchClearBtn')).toBeVisible();
  const locationRequest = page.waitForRequest(request => request.url().includes('latitude=25.2048'));
  await page.locator('.city-chip').click();
  await locationRequest;
  await expect(page.locator('#locationModal')).toBeHidden();
  await expect(page.locator('#locationText')).toHaveText('Dubai, UAE');
  await expect(page.locator('#locationBtn')).toBeFocused();
  await page.locator('#locationBtn').click();
  const methodRequest = page.waitForRequest(request => request.url().includes('method=3'));
  await page.locator('#methodSelect').selectOption('3');
  await methodRequest;
  await expect(page.locator('#calcMethodBadge')).toHaveText('Muslim World League');
  await page.keyboard.press('Escape');
  await expect(page.locator('#locationModal')).toBeHidden();
  const refreshRequest = page.waitForRequest(request => request.url().includes('api.aladhan.com'));
  await page.locator('#refreshBtn').click();
  await refreshRequest;
  await page.locator('#qiblaBtn').click();
  await expect(page.locator('#qiblaModal')).toBeVisible();
  await expect(page.locator('#qiblaCitySub')).toHaveText('from Dubai, UAE');
  await expect(page.locator('#qiblaAngleDisplay')).toHaveText(/^\d{1,3}°$/);
  await expect(page.locator('#closeQiblaModalBtn')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#closeQiblaModalBtn')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#qiblaBtn')).toBeFocused();
});

test('GPS success preserves the location, schedule and compass', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 25.2854, longitude: 51.5310 });
  await openApp(page);
  await page.locator('#locationBtn').click();
  await page.locator('#useGpsBtn').click();
  await expect(page.locator('#locationModal')).toBeHidden();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('youssef_clock_loc')).isGps)).toBe(true);
  await expect(page.locator('#locationText')).toHaveText('Doha, Qatar');
  await expect(page.locator('#prayer-Fajr')).toHaveClass(/active-next/);
  await page.locator('#qiblaBtn').click();
  await expect(page.locator('#qiblaCitySub')).toHaveText('from Doha, Qatar');
});

test('GPS denial and API failure still render the offline schedule', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition: (_success, failure) => failure({ code: 1, message: 'Test permission denied' }) }
    });
  });
  await page.route('https://api.aladhan.com/**', route => route.abort('failed'));
  await openApp(page);
  await page.locator('#locationBtn').click();
  await page.locator('#useGpsBtn').click();
  await expect(page.locator('#gpsSpinner')).toBeHidden();
  await expect(page.locator('#gpsIcon')).toBeVisible();
  await expect(page.locator('#toastMessage')).toContainText('GPS permission denied');
  await page.keyboard.press('Escape');
  for (const key of Object.keys(timings)) {
    await expect(page.locator(`#time-${key}`)).toHaveText(/^\d{2}:\d{2}$/);
  }
  await expect(page.locator('#hijriDateText')).not.toContainText('Loading');
  await expect(page.locator('#nextPrayerCountdown')).toHaveText(/^in \d{2}:\d{2}:\d{2}$/);
});

test('desktop, tablet and narrow-phone layouts fit in English and Arabic', async ({ page }) => {
  await openApp(page);
  for (const width of [320, 375, 640, 850, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    await expectNoOverflow(page);
    await page.locator('#formatToggleBtn').click();
    await expectNoOverflow(page);
    await page.locator('#langToggleBtn').click();
    await expectNoOverflow(page);
    await page.locator('#locationBtn').click();
    await expectNoOverflow(page);
    await page.keyboard.press('Escape');
    await page.locator('#qiblaBtn').click();
    await expectNoOverflow(page);
    await page.keyboard.press('Escape');
    await page.locator('#langToggleBtn').click();
    await page.locator('#formatToggleBtn').click();
  }
});

test('reduced motion removes decorative animation without stopping the clock', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  await expect(page.locator('.clock-colon').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('#prayerProgressBar')).toHaveCSS('transition-duration', '1e-05s');
  await page.clock.runFor(1000);
  await expect(page.locator('#clockSeconds')).toHaveText('07');
});
