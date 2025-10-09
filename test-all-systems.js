import { chromium } from 'playwright';

async function testAllSystems() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Capture console errors
    page.on('console', msg => {
        if (msg.type() === 'error' || msg.text().includes('RENDER') || msg.text().includes('BLOCKED')) {
            console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
        }
    });

    await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/');
    await page.waitForTimeout(3000);

    console.log('\n📸 1. Faceted (initial)');
    await page.screenshot({ path: 'system-test-faceted.png' });

    console.log('📸 2. Quantum');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'system-test-quantum.png' });

    console.log('📸 3. Holographic');
    await page.click('button:has-text("HOLOGRAPHIC")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'system-test-holographic.png' });

    console.log('📸 4. Back to Faceted');
    await page.click('button:has-text("FACETED")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'system-test-faceted-2.png' });

    await browser.close();
    console.log('\n✅ Done!');
}

testAllSystems().catch(console.error);
