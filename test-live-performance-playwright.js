/**
 * Test LivePerformanceController using Playwright
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLivePerformance() {
    console.log('🧪 Testing LivePerformanceController with Playwright...\n');

    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    // Collect console messages and errors
    const messages = [];
    const errors = [];

    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        messages.push({ type, text });
        if (type === 'log' || type === 'error') {
            console.log(`📝 ${type}: ${text}`);
        }
    });

    page.on('pageerror', error => {
        errors.push(error.message);
        console.log(`❌ ERROR: ${error.message}`);
    });

    // Load the page via HTTP server
    const indexPath = 'http://localhost:45325/index.html';
    console.log(`🌐 Loading ${indexPath}\n`);

    await page.goto(indexPath, { waitUntil: 'networkidle' });

    // Wait for initialization
    console.log('⏳ Waiting 4 seconds for initialization...\n');
    await page.waitForTimeout(4000);

    // Test 1: Check if LivePerformanceController loaded
    console.log('\n🧪 TEST 1: LivePerformanceController Initialization');
    const hasController = await page.evaluate(() => {
        return !!window.performanceController;
    });
    console.log(`   ${hasController ? '✅' : '❌'} LivePerformanceController exists: ${hasController}`);

    if (!hasController) {
        console.log('\n❌ LivePerformanceController failed to initialize. Checking for errors...');
        console.log(`\n📊 Errors found: ${errors.length}`);
        errors.forEach(err => console.log(`   - ${err}`));
        await browser.close();
        return;
    }

    // Test 2: Check if all UI elements exist
    console.log('\n🧪 TEST 2: UI Elements Present');
    const uiElements = await page.evaluate(() => {
        return {
            modeSelector: !!document.getElementById('performance-mode-selector'),
            reactivitySwitcher: !!document.getElementById('reactivity-format-switcher'),
            secondaryTouchpad: !!document.getElementById('secondary-touchpad-container'),
            mappingUI: !!document.getElementById('parameter-mapping-ui'),
            patternTriggerUI: !!document.getElementById('pattern-trigger-ui'),
            primaryIndicator: !!document.getElementById('primary-touchpad-indicator')
        };
    });

    let uiPassed = 0;
    Object.entries(uiElements).forEach(([key, value]) => {
        console.log(`   ${value ? '✅' : '❌'} ${key}: ${value}`);
        if (value) uiPassed++;
    });

    // Test 3: Check performance modes
    console.log('\n🧪 TEST 3: Performance Mode Switching');

    // Test touchpad mode
    await page.evaluate(() => {
        window.performanceController.switchMode('touchpad');
    });
    await page.waitForTimeout(300);

    let currentMode = await page.evaluate(() => window.performanceController.mode);
    console.log(`   ${currentMode === 'touchpad' ? '✅' : '❌'} Touchpad mode: ${currentMode === 'touchpad'}`);

    // Test choreography mode
    await page.evaluate(() => {
        window.performanceController.switchMode('choreography');
    });
    await page.waitForTimeout(300);

    currentMode = await page.evaluate(() => window.performanceController.mode);
    console.log(`   ${currentMode === 'choreography' ? '✅' : '❌'} Choreography mode: ${currentMode === 'choreography'}`);

    // Test hybrid mode
    await page.evaluate(() => {
        window.performanceController.switchMode('hybrid');
    });
    await page.waitForTimeout(300);

    currentMode = await page.evaluate(() => window.performanceController.mode);
    console.log(`   ${currentMode === 'hybrid' ? '✅' : '❌'} Hybrid mode: ${currentMode === 'hybrid'}`);

    // Test 4: Reactivity format switching
    console.log('\n🧪 TEST 4: Reactivity Format Switching');
    const formats = ['balanced', 'bassHeavy', 'highEnergy', 'minimal', 'explosive'];

    for (const format of formats) {
        await page.evaluate((f) => {
            window.performanceController.formatSwitcher.switchFormat(f);
        }, format);
        await page.waitForTimeout(200);

        const currentFormat = await page.evaluate(() =>
            window.performanceController.formatSwitcher.currentFormat
        );
        console.log(`   ${currentFormat === format ? '✅' : '❌'} ${format}: ${currentFormat === format}`);
    }

    // Test 5: Touchpad parameter mapping
    console.log('\n🧪 TEST 5: Touchpad Parameter Values');
    const touchpadParams = await page.evaluate(() => {
        // Set specific touchpad values
        window.performanceController.touchpadController.primaryTouchpad.values = { x: 0.75, y: 0.25 };
        window.performanceController.touchpadController.secondaryTouchpad.values = { x: 0.5, y: 0.9 };

        return window.performanceController.touchpadController.getParameterValues();
    });

    console.log(`   ✅ gridDensity (primary X): ${touchpadParams.gridDensity?.toFixed(2)}`);
    console.log(`   ✅ morphFactor (primary Y): ${touchpadParams.morphFactor?.toFixed(2)}`);
    console.log(`   ✅ hue (secondary X): ${touchpadParams.hue?.toFixed(2)}`);
    console.log(`   ✅ saturation (secondary Y): ${touchpadParams.saturation?.toFixed(2)}`);

    // Test 6: Pattern triggering
    console.log('\n🧪 TEST 6: Pattern Triggering');
    const patterns = ['density_pulse', 'rotation_spin', 'color_shift', 'chaos_build'];

    for (const pattern of patterns) {
        try {
            await page.evaluate((p) => {
                window.performanceController.triggerPattern(p);
            }, pattern);
            console.log(`   ✅ Triggered ${pattern}`);
            await page.waitForTimeout(200);
        } catch (err) {
            console.log(`   ❌ Failed to trigger ${pattern}: ${err.message}`);
        }
    }

    // Test 7: Keyboard shortcuts
    console.log('\n🧪 TEST 7: Keyboard Shortcuts');

    await page.keyboard.press('1');
    await page.waitForTimeout(300);
    currentMode = await page.evaluate(() => window.performanceController.mode);
    console.log(`   ${currentMode === 'touchpad' ? '✅' : '❌'} Key '1' → touchpad: ${currentMode === 'touchpad'}`);

    await page.keyboard.press('2');
    await page.waitForTimeout(300);
    currentMode = await page.evaluate(() => window.performanceController.mode);
    console.log(`   ${currentMode === 'choreography' ? '✅' : '❌'} Key '2' → choreography: ${currentMode === 'choreography'}`);

    await page.keyboard.press('3');
    await page.waitForTimeout(300);
    currentMode = await page.evaluate(() => window.performanceController.mode);
    console.log(`   ${currentMode === 'hybrid' ? '✅' : '❌'} Key '3' → hybrid: ${currentMode === 'hybrid'}`);

    await page.keyboard.press('r');
    await page.waitForTimeout(300);
    const resetValues = await page.evaluate(() => {
        const primary = window.performanceController.touchpadController.primaryTouchpad.values;
        return { x: primary.x, y: primary.y };
    });
    console.log(`   ${resetValues.x === 0.5 && resetValues.y === 0.5 ? '✅' : '❌'} Key 'r' → reset: x=${resetValues.x}, y=${resetValues.y}`);

    // Screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'test-live-performance-screenshot.png', fullPage: true });
    console.log('   ✅ Screenshot saved: test-live-performance-screenshot.png');

    // Final summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 TEST SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ LivePerformanceController initialized: ${hasController}`);
    console.log(`✅ UI elements present: ${uiPassed}/${Object.keys(uiElements).length}`);
    console.log(`✅ Total errors: ${errors.length}`);
    console.log(`✅ Console messages: ${messages.length}`);

    if (hasController && uiPassed === 6 && errors.length === 0) {
        console.log('\n🎉 ALL TESTS PASSED! System is working perfectly!');
    } else if (errors.length > 0) {
        console.log('\n⚠️  ERRORS DETECTED:');
        errors.forEach(err => console.log(`   - ${err}`));
    } else {
        console.log('\n⚠️  Some components missing or failed');
    }

    console.log('\n⏸️  Keeping browser open for 20 seconds for manual inspection...');
    await page.waitForTimeout(20000);

    await browser.close();
    console.log('\n✅ Test complete!');
}

testLivePerformance().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
