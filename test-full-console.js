import { chromium } from 'playwright';

async function checkAllConsole() {
    console.log('🔍 Capturing ALL console output...\\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    page.on('pageerror', error => {
        console.log(`[PAGE ERROR] ${error.message}`);
    });

    await page.goto('https://domusgpt.github.io/vib34d-unified-refactor/');

    console.log('\\n⏳ Waiting 3 seconds for initialization...\\n');
    await page.waitForTimeout(3000);

    console.log('\\n🎬 Switching to Quantum...');
    await page.click('button:has-text("QUANTUM")');
    await page.waitForTimeout(2000);

    await browser.close();
}

checkAllConsole().catch(console.error);
