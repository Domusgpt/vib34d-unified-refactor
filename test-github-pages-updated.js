import { chromium } from 'playwright';

async function testGitHubPages() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/?' + Date.now());
    await page.waitForTimeout(3000);

    console.log('📸 1. Faceted after initialization');
    await page.screenshot({ path: 'gh-test-1-faceted.png' });

    console.log('📸 2. Quantum');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'gh-test-2-quantum.png' });

    console.log('📸 3. Quantum - Density 5');
    await page.fill('#gridDensity', '5');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'gh-test-3-density-5.png' });

    console.log('📸 4. Quantum - Density 100');
    await page.fill('#gridDensity', '100');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'gh-test-4-density-100.png' });

    await browser.close();
    console.log('\n✅ GitHub Pages test complete - compare screenshots to verify parameters change rendering');
}

testGitHubPages().catch(console.error);
