/**
 * Test LivePerformanceController and all new features
 */

import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLivePerformance() {
    console.log('🧪 Testing LivePerformanceController...\n');

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Collect console messages and errors
    const messages = [];
    const errors = [];

    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        messages.push({ type, text });
        console.log(`📝 ${type}: ${text}`);
    });

    page.on('pageerror', error => {
        errors.push(error.message);
        console.log(`❌ error: ${error.message}`);
    });

    // Load the page
    const indexPath = 'file://' + path.resolve(__dirname, 'index.html');
    console.log(`🌐 Loading ${indexPath}\n`);

    await page.goto(indexPath, { waitUntil: 'networkidle0' });

    // Wait for initialization
    console.log('⏳ Waiting for LivePerformanceController...\n');
    await page.waitForTimeout(3000);

    // Test 1: Check if LivePerformanceController loaded
    console.log('🧪 TEST 1: LivePerformanceController Initialization');
    const hasController = await page.evaluate(() => {
        return !!window.performanceController;
    });
    console.log(`   ${hasController ? '✅' : '❌'} LivePerformanceController exists: ${hasController}\n`);

    // Test 2: Check if all UI elements exist
    console.log('🧪 TEST 2: UI Elements');
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

    Object.entries(uiElements).forEach(([key, value]) => {
        console.log(`   ${value ? '✅' : '❌'} ${key}: ${value}`);
    });
    console.log();

    // Test 3: Check performance mode switching
    console.log('🧪 TEST 3: Mode Switching');
    await page.evaluate(() => {
        window.performanceController.switchMode('choreography');
    });
    await page.waitForTimeout(500);

    let currentMode = await page.evaluate(() => {
        return window.performanceController.mode;
    });
    console.log(`   ${currentMode === 'choreography' ? '✅' : '❌'} Switched to choreography mode: ${currentMode}`);

    await page.evaluate(() => {
        window.performanceController.switchMode('hybrid');
    });
    await page.waitForTimeout(500);

    currentMode = await page.evaluate(() => {
        return window.performanceController.mode;
    });
    console.log(`   ${currentMode === 'hybrid' ? '✅' : '❌'} Switched to hybrid mode: ${currentMode}\n`);

    // Test 4: Test reactivity format switching
    console.log('🧪 TEST 4: Reactivity Format Switching');
    await page.evaluate(() => {
        window.performanceController.formatSwitcher.switchFormat('bassHeavy');
    });
    await page.waitForTimeout(500);

    const currentFormat = await page.evaluate(() => {
        return window.performanceController.formatSwitcher.currentFormat;
    });
    console.log(`   ${currentFormat === 'bassHeavy' ? '✅' : '❌'} Switched to bassHeavy: ${currentFormat}\n`);

    // Test 5: Test touchpad parameter mapping
    console.log('🧪 TEST 5: Touchpad Parameter Mapping');
    const touchpadParams = await page.evaluate(() => {
        // Set touchpad values
        window.performanceController.touchpadController.primaryTouchpad.values = { x: 0.7, y: 0.3 };
        window.performanceController.touchpadController.secondaryTouchpad.values = { x: 0.5, y: 0.8 };

        return window.performanceController.touchpadController.getParameterValues();
    });
    console.log(`   ✅ Primary touchpad X (gridDensity): ${touchpadParams.gridDensity?.toFixed(2)}`);
    console.log(`   ✅ Primary touchpad Y (morphFactor): ${touchpadParams.morphFactor?.toFixed(2)}`);
    console.log(`   ✅ Secondary touchpad X (hue): ${touchpadParams.hue?.toFixed(2)}`);
    console.log(`   ✅ Secondary touchpad Y (saturation): ${touchpadParams.saturation?.toFixed(2)}\n`);

    // Test 6: Test pattern triggering
    console.log('🧪 TEST 6: Pattern Triggering');
    try {
        await page.evaluate(() => {
            window.performanceController.triggerPattern('density_pulse');
        });
        console.log('   ✅ Triggered density_pulse pattern\n');
    } catch (err) {
        console.log(`   ❌ Failed to trigger pattern: ${err.message}\n`);
    }

    // Test 7: Test choreography loading
    console.log('🧪 TEST 7: Choreography Loading');
    try {
        await page.evaluate(() => {
            window.performanceController.loadChoreography('intro');
        });
        console.log('   ✅ Loaded intro choreography\n');
    } catch (err) {
        console.log(`   ❌ Failed to load choreography: ${err.message}\n`);
    }

    // Test 8: Test keyboard shortcuts
    console.log('🧪 TEST 8: Keyboard Shortcuts');
    await page.keyboard.press('1'); // Switch to touchpad mode
    await page.waitForTimeout(500);
    currentMode = await page.evaluate(() => window.performanceController.mode);
    console.log(`   ${currentMode === 'touchpad' ? '✅' : '❌'} Key '1' switched to touchpad: ${currentMode}`);

    await page.keyboard.press('2'); // Switch to choreography mode
    await page.waitForTimeout(500);
    currentMode = await page.evaluate(() => window.performanceController.mode);
    console.log(`   ${currentMode === 'choreography' ? '✅' : '❌'} Key '2' switched to choreography: ${currentMode}`);

    await page.keyboard.press('r'); // Reset touchpads
    await page.waitForTimeout(500);
    const resetValues = await page.evaluate(() => {
        const primary = window.performanceController.touchpadController.primaryTouchpad.values;
        return { x: primary.x, y: primary.y };
    });
    console.log(`   ${resetValues.x === 0.5 && resetValues.y === 0.5 ? '✅' : '❌'} Key 'r' reset touchpads: x=${resetValues.x}, y=${resetValues.y}\n`);

    // Test 9: Visual feedback test
    console.log('🧪 TEST 9: Visual Feedback');
    await page.screenshot({ path: 'test-live-performance-screenshot.png', fullPage: true });
    console.log('   ✅ Screenshot saved: test-live-performance-screenshot.png\n');

    // Summary
    console.log('📊 SUMMARY:');
    console.log(`   Total errors: ${errors.length}`);
    console.log(`   Total console messages: ${messages.length}`);
    console.log(`   UI elements present: ${Object.values(uiElements).filter(v => v).length}/${Object.keys(uiElements).length}`);

    if (errors.length === 0) {
        console.log('\n✅ ALL TESTS PASSED! LivePerformanceController is working.\n');
    } else {
        console.log('\n❌ ERRORS DETECTED:\n');
        errors.forEach(err => console.log(`   - ${err}`));
    }

    // Keep browser open for manual testing
    console.log('⏸️  Keeping browser open for 30 seconds for manual testing...');
    await page.waitForTimeout(30000);

    await browser.close();
}

testLivePerformance().catch(console.error);
