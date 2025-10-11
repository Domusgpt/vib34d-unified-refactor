import { chromium } from 'playwright';

async function testGH() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Force hard reload
    await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/', {
        waitUntil: 'networkidle',
        timeout: 10000
    });

    console.log('⏳ Waiting 3 seconds...');
    await page.waitForTimeout(3000);

    console.log('📸 Screenshot 1: Initial load');
    await page.screenshot({ path: 'gh-now-1.png' });

    console.log('📸 Screenshot 2: Quantum');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'gh-now-2.png' });

    console.log('📸 Screenshot 3: Change Geometry');
    await page.fill('#geometry', '3');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'gh-now-3.png' });

    await page.waitForTimeout(2000);
    await browser.close();
    console.log('✅ Done');
}

testGH().catch(console.error);
