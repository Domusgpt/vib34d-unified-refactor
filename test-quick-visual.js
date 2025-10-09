import { chromium } from 'playwright';

async function quickTest() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'quick-test-faceted.png' });

    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'quick-test-quantum.png' });

    await page.fill('#gridDensity', '30');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'quick-test-quantum-density-30.png' });

    await browser.close();
    console.log('✅ Screenshots saved!');
}

quickTest().catch(console.error);
