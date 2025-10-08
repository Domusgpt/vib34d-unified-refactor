import { chromium } from 'playwright';

async function testActualFunctionality() {
    console.log('🧪 Testing ACTUAL functionality...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const errors = [];
    page.on('pageerror', error => {
        errors.push(error.message);
        console.log(`❌ ERROR: ${error.message}`);
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`📝 Console error: ${msg.text()}`);
        }
    });

    await page.goto('http://localhost:8081');
    await page.waitForTimeout(3000);

    console.log('\n🧪 TEST 1: Does the page load without errors?');
    console.log(`   ${errors.length === 0 ? '✅' : '❌'} Errors: ${errors.length}`);
    if (errors.length > 0) {
        errors.forEach(e => console.log(`      - ${e}`));
    }

    console.log('\n🧪 TEST 2: Can I switch systems?');
    try {
        await page.click('button:has-text("QUANTUM")');
        await page.waitForTimeout(1000);
        console.log('   ✅ Clicked QUANTUM button');
    } catch (e) {
        console.log(`   ❌ Failed to click QUANTUM: ${e.message}`);
    }

    console.log('\n🧪 TEST 3: Do sliders exist?');
    const sliderCount = await page.evaluate(() => {
        return document.querySelectorAll('input[type="range"]').length;
    });
    console.log(`   ${sliderCount > 0 ? '✅' : '❌'} Found ${sliderCount} sliders`);

    console.log('\n🧪 TEST 4: Can I move a slider?');
    try {
        await page.fill('#gridDensity', '75');
        const value = await page.inputValue('#gridDensity');
        console.log(`   ${value === '75' ? '✅' : '❌'} Slider value: ${value}`);
    } catch (e) {
        console.log(`   ❌ Failed to move slider: ${e.message}`);
    }

    console.log('\n🧪 TEST 5: Does audio upload exist?');
    const audioInput = await page.locator('#audioFile').count();
    console.log(`   ${audioInput > 0 ? '✅' : '❌'} Audio input exists: ${audioInput > 0}`);

    console.log('\n🧪 TEST 6: Are there any JS errors on the page?');
    const jsErrors = await page.evaluate(() => {
        return window.__errors || [];
    });
    console.log(`   ${jsErrors.length === 0 ? '✅' : '❌'} JS errors: ${jsErrors.length}`);

    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'actual-test-screenshot.png', fullPage: true });
    console.log('   ✅ Screenshot saved\n');

    console.log('⏸️  Keeping browser open for 15 seconds...');
    await page.waitForTimeout(15000);

    await browser.close();

    if (errors.length === 0) {
        console.log('\n✅ No errors detected!');
    } else {
        console.log(`\n❌ ${errors.length} errors found`);
    }
}

testActualFunctionality().catch(console.error);
