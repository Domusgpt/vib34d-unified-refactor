import { chromium } from 'playwright';

async function testParamsActuallyChange() {
    console.log('🎛️ Testing if parameters ACTUALLY change the rendering...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/');
    await page.waitForTimeout(3000);

    // Switch to Quantum
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(2000);

    console.log('📸 1. Quantum - Grid Density 15 (default)');
    await page.screenshot({ path: 'param-change-1-density-15.png' });

    console.log('📸 2. Quantum - Grid Density 5 (should be VERY sparse)');
    await page.fill('#gridDensity', '5');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'param-change-2-density-5.png' });

    console.log('📸 3. Quantum - Grid Density 100 (should be VERY dense)');
    await page.fill('#gridDensity', '100');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'param-change-3-density-100.png' });

    console.log('📸 4. Reset density, change Speed to 0.1 (should be VERY slow)');
    await page.fill('#gridDensity', '15');
    await page.fill('#speed', '0.1');
    await page.waitForTimeout(2000); // Wait to see if animation is slower
    await page.screenshot({ path: 'param-change-4-speed-0.1.png' });

    console.log('📸 5. Speed to 10 (should be VERY fast)');
    await page.fill('#speed', '10');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'param-change-5-speed-10.png' });

    await browser.close();
    console.log('\n✅ Screenshots captured. Compare them to see if parameters actually change rendering.');
}

testParamsActuallyChange().catch(console.error);
