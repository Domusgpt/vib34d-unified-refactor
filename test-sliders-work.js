import { chromium } from 'playwright';

async function testSlidersWork() {
    console.log('🎛️ Testing if sliders actually change visuals now\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);

    console.log('📸 1. Quantum default');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'slider-test-1-default.png' });

    console.log('📸 2. Grid Density = 10 (very sparse)');
    await page.fill('#gridDensity', '10');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'slider-test-2-density-10.png' });

    console.log('📸 3. Grid Density = 80 (very dense)');
    await page.fill('#gridDensity', '80');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'slider-test-3-density-80.png' });

    console.log('📸 4. Chaos = 1.0 (max chaos)');
    await page.fill('#chaos', '1.0');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'slider-test-4-max-chaos.png' });

    console.log('📸 5. Geometry = 3 (Torus)');
    await page.fill('#geometry', '3');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'slider-test-5-torus.png' });

    await browser.close();
    console.log('\n✅ Done - compare screenshots to see if sliders changed visuals');
}

testSlidersWork().catch(console.error);
