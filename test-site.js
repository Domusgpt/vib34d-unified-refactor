import { chromium } from 'playwright';

(async () => {
    console.log('🧪 Starting VIB34D Test with Playwright...\n');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen for console logs
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error') {
            console.log(`❌ Console Error: ${text}`);
        } else if (type === 'warn') {
            console.log(`⚠️  Console Warning: ${text}`);
        } else {
            console.log(`📝 Console: ${text}`);
        }
    });

    // Listen for page errors
    page.on('pageerror', err => {
        console.log(`💥 Page Error: ${err.message}`);
        console.log(err.stack);
    });

    // Listen for failed requests
    page.on('requestfailed', request => {
        console.log(`❌ Failed Request: ${request.url()}`);
        console.log(`   Method: ${request.method()}`);
        console.log(`   Failure: ${request.failure().errorText}`);
    });

    // Listen for successful requests
    page.on('requestfinished', request => {
        const url = request.url();
        if (url.includes('.js') || url.includes('.html')) {
            console.log(`✅ Loaded: ${url.split('/').pop()}`);
        }
    });

    try {
        console.log('🌐 Navigating to https://domusgpt.github.io/vib34d-unified-refactor/\n');

        await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        console.log('\n⏳ Waiting 5 seconds for initialization...\n');
        await page.waitForTimeout(5000);

        // Check if canvas exists
        const canvas = await page.$('#mainCanvas');
        if (canvas) {
            console.log('✅ Canvas element found');
        } else {
            console.log('❌ Canvas element NOT found');
        }

        // Check if loading is hidden
        const loading = await page.$('#loading');
        if (loading) {
            const isHidden = await page.evaluate(el => {
                return el.classList.contains('hidden');
            }, loading);
            console.log(`Loading screen: ${isHidden ? 'Hidden ✅' : 'Still visible ❌'}`);
        }

        // Check system buttons
        const buttons = await page.$$('.system-btn');
        console.log(`System buttons found: ${buttons.length}`);

        // Get all network errors
        console.log('\n📊 Taking screenshot...');
        await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
        console.log('✅ Screenshot saved to test-screenshot.png');

        console.log('\n⏸️  Keeping browser open for 30 seconds for inspection...');
        await page.waitForTimeout(30000);

    } catch (err) {
        console.log(`\n💥 Test Error: ${err.message}`);
        console.log(err.stack);
    } finally {
        await browser.close();
        console.log('\n✅ Test complete!');
    }
})();
