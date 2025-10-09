import { chromium } from 'playwright';

async function testParameters() {
    console.log('🎛️ Testing parameter changes affect rendering...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/');
    await page.waitForTimeout(2000);

    // Test 1: Quantum default
    console.log('📸 Test 1: Quantum default parameters');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'param-test-1-quantum-default.png' });

    // Test 2: Grid Density change
    console.log('📸 Test 2: Grid Density = 5 (sparse)');
    await page.fill('#gridDensity', '5');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'param-test-2-density-5.png' });

    console.log('📸 Test 3: Grid Density = 100 (dense)');
    await page.fill('#gridDensity', '100');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'param-test-3-density-100.png' });

    // Test 4: Speed change
    console.log('📸 Test 4: Speed = 5.0 (fast)');
    await page.fill('#gridDensity', '15'); // reset density
    await page.fill('#speed', '5.0');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'param-test-4-speed-5.png' });

    // Test 5: 4D Rotations
    console.log('📸 Test 5: 4D Rotation XW = 3.14');
    await page.fill('#speed', '1.0'); // reset speed
    await page.fill('#rot4dXW', '3.14');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'param-test-5-rotation-xw.png' });

    console.log('📸 Test 6: All rotations active');
    await page.fill('#rot4dYW', '1.57');
    await page.fill('#rot4dZW', '2.35');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'param-test-6-all-rotations.png' });

    // Test 7: Faceted system
    console.log('📸 Test 7: Faceted system');
    await page.click('button:has-text("FACETED")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'param-test-7-faceted.png' });

    // Test 8: Holographic system
    console.log('📸 Test 8: Holographic system');
    await page.click('button:has-text("HOLOGRAPHIC")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'param-test-8-holographic.png' });

    await browser.close();
    console.log('\n✅ All parameter tests complete!');
}

testParameters().catch(console.error);
