import { chromium } from 'playwright';

async function finalTest() {
    console.log('🔍 FINAL VERIFICATION TEST\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error' || msg.text().includes('RENDER') || msg.text().includes('Initialized')) {
            console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
        }
    });

    // Hard reload with cache clear
    await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/', { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' });

    console.log('\n⏳ Waiting 4 seconds for initialization...');
    await page.waitForTimeout(4000);

    console.log('\n📸 Screenshot 1: Initial state (should show Faceted rendering)');
    await page.screenshot({ path: 'FINAL-1-faceted.png', fullPage: false });

    console.log('\n📸 Screenshot 2: Quantum system');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'FINAL-2-quantum-default.png' });

    console.log('\n📸 Screenshot 3: Quantum - Grid Density 10 (should be sparse)');
    await page.fill('#gridDensity', '10');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'FINAL-3-quantum-density-10.png' });

    console.log('\n📸 Screenshot 4: Quantum - Grid Density 80 (should be dense)');
    await page.fill('#gridDensity', '80');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'FINAL-4-quantum-density-80.png' });

    console.log('\n📸 Screenshot 5: Holographic system');
    await page.click('button:has-text("HOLOGRAPHIC")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'FINAL-5-holographic.png' });

    await page.waitForTimeout(3000);
    await browser.close();

    console.log('\n✅ FINAL TEST COMPLETE');
    console.log('\nCompare screenshots:');
    console.log('- FINAL-1: Should show rendering, NOT loading screen');
    console.log('- FINAL-2: Should show Quantum geometry');
    console.log('- FINAL-3 vs FINAL-4: Should show DIFFERENT patterns (density 10 vs 80)');
}

finalTest().catch(console.error);
