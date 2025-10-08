import { chromium } from 'playwright';

async function checkConsoleErrors() {
    console.log('🔍 Checking for actual console errors...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const allMessages = [];

    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();
        allMessages.push({ type, text });

        if (type === 'error' || type === 'warning') {
            console.log(`[${type.toUpperCase()}] ${text}`);
        } else if (text.includes('❌') || text.includes('Failed') || text.includes('Error')) {
            console.log(`[LOG] ${text}`);
        }
    });

    page.on('pageerror', error => {
        console.log(`[PAGE ERROR] ${error.message}`);
        console.log(`Stack: ${error.stack}`);
    });

    await page.goto('http://localhost:8081');

    console.log('\n⏳ Waiting 5 seconds for initialization...\n');
    await page.waitForTimeout(5000);

    console.log('\n🎬 Switching to Faceted...');
    await page.click('button:has-text("FACETED")');
    await page.waitForTimeout(2000);

    console.log('\n🎬 Switching to Quantum...');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(2000);

    console.log('\n🎬 Switching to Holographic...');
    await page.click('button:has-text("HOLOGRAPHIC")');
    await page.waitForTimeout(2000);

    console.log('\n🎬 Moving sliders...');
    await page.fill('#gridDensity', '25');
    await page.waitForTimeout(500);
    await page.fill('#speed', '2');
    await page.waitForTimeout(500);

    console.log('\n📊 MESSAGE SUMMARY:');
    const errors = allMessages.filter(m => m.type === 'error');
    const warnings = allMessages.filter(m => m.type === 'warning');

    console.log(`   Total errors: ${errors.length}`);
    console.log(`   Total warnings: ${warnings.length}`);
    console.log(`   Total messages: ${allMessages.length}`);

    if (errors.length > 0) {
        console.log('\n❌ ERRORS:');
        errors.forEach(e => console.log(`   - ${e.text}`));
    }

    console.log('\n⏸️  Keeping open for 15 seconds...');
    await page.waitForTimeout(15000);

    await browser.close();
}

checkConsoleErrors().catch(console.error);
