import { chromium } from 'playwright';

async function testBlendingFix() {
    console.log('🔍 Testing alpha blending fix...\\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/');

    console.log('⏳ Waiting 3 seconds for initialization...');
    await page.waitForTimeout(3000);

    // Test 1: Initial Faceted render
    console.log('📸 Test 1: Faceted initial render');
    await page.screenshot({ path: 'fix-test-1-faceted-initial.png' });

    // Test 2: Quantum with different grid density
    console.log('📸 Test 2: Switching to Quantum');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'fix-test-2-quantum-default.png' });

    // Test 3: Change grid density to see if parameter changes work
    console.log('📸 Test 3: Quantum with high grid density');
    await page.fill('#gridDensity', '50');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'fix-test-3-quantum-density-50.png' });

    // Test 4: Change 4D rotations
    console.log('📸 Test 4: Quantum with 4D rotations');
    await page.fill('#rot4dXW', '3.14');
    await page.fill('#rot4dYW', '1.57');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'fix-test-4-quantum-rotations.png' });

    // Test 5: Holographic
    console.log('📸 Test 5: Holographic system');
    await page.click('button:has-text("HOLOGRAPHIC")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'fix-test-5-holographic.png' });

    console.log('\\n✅ All screenshots captured!');
    console.log('If blending fix worked, screenshots should show actual geometry, not solid colors.');

    await page.waitForTimeout(5000);
    await browser.close();
}

testBlendingFix().catch(console.error);
