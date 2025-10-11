import { chromium } from 'playwright';

async function testAllParams() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);

    console.log('📸 1. Default Quantum');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'params-1-default.png' });

    console.log('📸 2. Change Geometry Type to 2 (Sphere)');
    await page.fill('#geometry', '2');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'params-2-geometry-sphere.png' });

    console.log('📸 3. Max Chaos');
    await page.fill('#chaos', '1.0');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'params-3-max-chaos.png' });

    console.log('📸 4. Max Intensity');
    await page.fill('#intensity', '1.0');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'params-4-max-intensity.png' });

    console.log('📸 5. Morph Factor 2.0');
    await page.fill('#morphFactor', '2.0');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'params-5-morph-2.png' });

    await browser.close();
    console.log('\n✅ All parameter tests complete');
}

testAllParams().catch(console.error);
