import { chromium } from 'playwright';

async function testLocal() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    await page.goto('http://localhost:8081');
    await page.waitForTimeout(3000);

    console.log('\n📸 1. After 3 seconds - should show Faceted rendering');
    await page.screenshot({ path: 'local-test-1-faceted.png' });

    console.log('📸 2. Switch to Quantum');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'local-test-2-quantum.png' });

    console.log('📸 3. Change Grid Density to 5');
    await page.fill('#gridDensity', '5');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'local-test-3-density-5.png' });

    await browser.close();
    console.log('\n✅ Local tests complete');
}

testLocal().catch(console.error);
