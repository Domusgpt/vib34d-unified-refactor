import { chromium } from 'playwright';

(async () => {
    console.log('🧪 Starting VIB34D Test...\n');

    const browser = await chromium.launch({
        headless: false,
        timeout: 60000
    });

    const context = await browser.newContext({
        ignoreHTTPSErrors: true
    });

    const page = await context.newPage();

    // Collect all errors
    const errors = [];
    const failed404s = [];
    const consoleMessages = [];

    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push(`[${msg.type()}] ${text}`);
        console.log(`📝 ${msg.type()}: ${text}`);
    });

    page.on('pageerror', err => {
        errors.push(err.message);
        console.log(`💥 Page Error: ${err.message}`);
    });

    page.on('requestfailed', request => {
        const url = request.url();
        const failure = request.failure();
        failed404s.push({ url, error: failure ? failure.errorText : 'unknown' });
        console.log(`❌ Failed: ${url}`);
        console.log(`   Error: ${failure ? failure.errorText : 'unknown'}`);
    });

    page.on('response', response => {
        if (response.status() === 404) {
            const url = response.url();
            failed404s.push({ url, error: '404 Not Found' });
            console.log(`❌ 404: ${url}`);
        }
    });

    try {
        console.log('🌐 Loading https://domusgpt.github.io/vib34d-unified-refactor/\n');

        await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/', {
            waitUntil: 'load',
            timeout: 30000
        });

        console.log('✅ Page loaded\n');
        console.log('⏳ Waiting 3 seconds for initialization...\n');
        await page.waitForTimeout(3000);

        // Check elements
        const canvas = await page.$('#mainCanvas');
        console.log(canvas ? '✅ Canvas found' : '❌ Canvas NOT found');

        const loading = await page.$('#loading');
        if (loading) {
            const isHidden = await loading.evaluate(el => el.classList.contains('hidden'));
            console.log(`Loading screen: ${isHidden ? '✅ Hidden' : '❌ Still visible'}`);
        }

        // Summary
        console.log('\n📊 SUMMARY:');
        console.log(`Total errors: ${errors.length}`);
        console.log(`Total 404s: ${failed404s.length}`);
        console.log(`Console messages: ${consoleMessages.length}`);

        if (failed404s.length > 0) {
            console.log('\n❌ FAILED REQUESTS:');
            failed404s.forEach(f => console.log(`  - ${f.url}\n    ${f.error}`));
        }

        if (errors.length > 0) {
            console.log('\n💥 PAGE ERRORS:');
            errors.forEach(e => console.log(`  - ${e}`));
        }

        console.log('\n📸 Taking screenshot...');
        await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
        console.log('✅ Screenshot saved: test-screenshot.png');

        console.log('\n⏸️  Keeping browser open for 15 seconds...');
        await page.waitForTimeout(15000);

    } catch (err) {
        console.log(`\n💥 Test Error: ${err.message}`);
    } finally {
        await browser.close();
        console.log('\n✅ Test complete!');
    }
})();
