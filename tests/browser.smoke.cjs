/* Browser smoke test for POLITICA's critical assessment journey.
   Run with: npm install --no-save playwright && npx playwright install chromium && node tests/browser.smoke.cjs */
const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");

(async () => {
  const server = spawn("python3", ["-m", "http.server", "4173", "--bind", "127.0.0.1"], {
    cwd: process.cwd(), stdio: "ignore"
  });
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 40; i++) {
      try { const r = await fetch("http://127.0.0.1:4173/assessment.html"); if (r.ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    assert.equal(ready, true, "local static server should start");

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));

    await page.goto("http://127.0.0.1:4173/assessment.html");
    await page.locator("#quizCard").waitFor();
    assert.match(await page.locator(".counter").innerText(), /QUESTION 1 OF 35/);
    assert.equal(await page.locator('input[name="answer"]').count(), 5);

    // Save one answer, reload, and confirm that it is restored.
    await page.locator('input[name="answer"][value="4"]').check({ force: true });
    assert.match(await page.locator("#progressCopy").innerText(), /1 of 35 answered/);
    await page.reload();
    assert.equal(await page.locator('input[name="answer"][value="4"]').isChecked(), true);
    assert.match(await page.locator("#progressCopy").innerText(), /1 of 35 answered/);

    // Complete the assessment using the normal controls.
    for (let i = 0; i < 35; i++) {
      const selected = await page.locator('input[name="answer"]:checked').count();
      if (!selected) await page.locator('input[name="answer"][value="3"]').check({ force: true });
      const button = page.getByRole("button", { name: i === 34 ? /View my profile/ : /Continue/ });
      await button.click();
    }
    await page.locator("#results").waitFor({ state: "visible" });
    assert.equal(await page.locator("#results .profile-pill").innerText(), "Your POLITICA profile");
    assert.equal(await page.locator("#results .dimension-row").count(), 7);

    // A completed assessment should restore its results after refresh.
    await page.reload();
    await page.locator("#results").waitFor({ state: "visible" });
    assert.equal(await page.locator("#results .profile-pill").innerText(), "Your POLITICA profile");

    // Retaking should return to question one and clear the completed save.
    await page.getByRole("button", { name: /Retake assessment/ }).click();
    await page.locator("#assessment").waitFor({ state: "visible" });
    assert.match(await page.locator(".counter").innerText(), /QUESTION 1 OF 35/);
    assert.equal(await page.evaluate(() => localStorage.getItem("politica.progress.v1")), null);

    // Basic narrow-screen overflow check.
    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobile.goto("http://127.0.0.1:4173/assessment.html");
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert.equal(overflow, false, "assessment should not overflow horizontally at 375px");
    await mobile.close();

    assert.deepEqual(pageErrors, [], "browser should not emit uncaught JavaScript errors");
    console.log("PASS: resume, complete, results restore, retake, 7 dimensions, and 375px layout");
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
