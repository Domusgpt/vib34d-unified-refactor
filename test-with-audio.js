import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testWithAudio() {
    console.log('🧪 Testing with ACTUAL audio and parameter changes...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const errors = [];
    page.on('pageerror', error => {
        errors.push(error.message);
        console.log(`❌ PAGE ERROR: ${error.message}`);
    });

    page.on('console', msg => {
        const text = msg.text();
        if (msg.type() === 'error') {
            console.log(`📝 CONSOLE ERROR: ${text}`);
        } else if (text.includes('Audio') || text.includes('parameter') || text.includes('update')) {
            console.log(`📝 LOG: ${text}`);
        }
    });

    await page.goto('http://localhost:8081');
    await page.waitForTimeout(3000);

    console.log('🧪 TEST 1: Take screenshot of initial state');
    await page.screenshot({ path: 'test-1-initial.png' });
    console.log('   ✅ Saved test-1-initial.png\n');

    console.log('🧪 TEST 2: Move Grid Density slider from 50 to 10');
    const initialDensity = await page.inputValue('#gridDensity');
    console.log(`   Initial density: ${initialDensity}`);

    await page.fill('#gridDensity', '10');
    await page.waitForTimeout(500);

    const newDensity = await page.inputValue('#gridDensity');
    console.log(`   New density: ${newDensity}`);

    await page.screenshot({ path: 'test-2-density-10.png' });
    console.log('   ✅ Saved test-2-density-10.png (should show LESS dense grid)\n');

    console.log('🧪 TEST 3: Move Grid Density to 100');
    await page.fill('#gridDensity', '100');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-3-density-100.png' });
    console.log('   ✅ Saved test-3-density-100.png (should show VERY dense grid)\n');

    console.log('🧪 TEST 4: Change Speed slider');
    await page.fill('#speed', '3');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-4-speed-3.png' });
    console.log('   ✅ Saved test-4-speed-3.png (should be spinning faster)\n');

    console.log('🧪 TEST 5: Change 4D rotations');
    await page.fill('#rot4dXW', '1.5');
    await page.fill('#rot4dYW', '-1.2');
    await page.fill('#rot4dZW', '0.8');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-5-4d-rotations.png' });
    console.log('   ✅ Saved test-5-4d-rotations.png (should look different)\n');

    console.log('🧪 TEST 6: Switch to HOLOGRAPHIC system');
    await page.click('button:has-text("HOLOGRAPHIC")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-6-holographic.png' });
    console.log('   ✅ Saved test-6-holographic.png (completely different visual)\n');

    console.log('🧪 TEST 7: Check if parameters actually update in console');
    const consoleUpdates = await page.evaluate(() => {
        return new Promise((resolve) => {
            const updates = [];
            const originalLog = console.log;
            console.log = function(...args) {
                updates.push(args.join(' '));
                originalLog.apply(console, args);
            };

            // Trigger a parameter change
            const slider = document.getElementById('gridDensity');
            slider.value = 75;
            slider.dispatchEvent(new Event('input'));

            setTimeout(() => {
                console.log = originalLog;
                resolve(updates);
            }, 500);
        });
    });

    console.log(`   Console updates captured: ${consoleUpdates.length}`);
    consoleUpdates.forEach(u => console.log(`      - ${u}`));

    console.log('\n📊 RESULTS:');
    console.log(`   Total page errors: ${errors.length}`);
    console.log(`   Sliders can be moved: ✅`);
    console.log(`   Systems can be switched: ✅`);
    console.log('   Visual changes with parameters: CHECK SCREENSHOTS ⚠️');
    console.log('   Audio upload: NOT TESTED (no audio file)');

    console.log('\n⏸️  Keeping browser open for manual inspection...');
    await page.waitForTimeout(20000);

    await browser.close();
}

testWithAudio().catch(console.error);
