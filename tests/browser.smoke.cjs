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
    assert.match(await page.locator("#results .profile-pill").innerText(), /your politica profile/i);
    assert.equal(await page.locator("#results .dimension-row").count(), 7);

    // Stress-test the political tendency labels with deliberately varied profiles.
    const classifications = await page.evaluate(() => {
      const profile = (economic, social, culture=0, democracy=0, liberty=0, global=0, values=0) =>
        politicalTendencyHtml({economic,social,culture,democracy,liberty,global,values});
      return {
        left: profile(-60,-45),
        right: profile(60,45),
        centrist: profile(5,-5),
        leftEconomicsResponsibilitySocial: profile(-55,40),
        marketEconomicsSocialProtection: profile(55,-40),
        liberalDemocratic: profile(0,0,-10,-55,-50),
        culturallyConservative: profile(0,0,55,0,0)
      };
    });
    assert.match(classifications.left, /Centre-left tendency/);
    assert.match(classifications.right, /Centre-right tendency/);
    assert.match(classifications.centrist, /Centrist \/ mixed-economy tendency/);
    assert.match(classifications.leftEconomicsResponsibilitySocial, /economically left, responsibility-oriented socially/i);
    assert.match(classifications.marketEconomicsSocialProtection, /market-oriented economics, stronger social protection/i);
    assert.match(classifications.liberalDemocratic, /Liberal-democratic \/ civil-libertarian themes/);
    assert.match(classifications.culturallyConservative, /Culturally conservative \/ gradualist themes/);

    // Threshold boundaries: the inclusive cut-offs should be stable and predictable.
    const boundaryProfiles = await page.evaluate(() => {
      const profile = (economic, social) => politicalTendencyHtml({
        economic, social, culture:0, democracy:0, liberty:0, global:0, values:0
      });
      return {
        exactLeftCutoff: profile(-25,-20),
        justInsideCentre: profile(-24,-19),
        exactRightCutoff: profile(25,20),
        crossPressureLeft: profile(-26,20),
        crossPressureMarket: profile(26,-20)
      };
    });
    assert.match(boundaryProfiles.exactLeftCutoff, /Centre-left tendency/);
    assert.match(boundaryProfiles.justInsideCentre, /Centrist \/ mixed-economy tendency/);
    assert.match(boundaryProfiles.exactRightCutoff, /Centre-right tendency/);
    assert.match(boundaryProfiles.crossPressureLeft, /economically left, responsibility-oriented socially/i);
    assert.match(boundaryProfiles.crossPressureMarket, /market-oriented economics, stronger social protection/i);

    for (const html of [...Object.values(classifications), ...Object.values(boundaryProfiles)]) {
      // Check only actual displayed classification labels, not the explanatory disclaimer.
      assert.doesNotMatch(html, /<(?:h4|span class="chip")>[^<]*\\b(communist|fascist|far-right extremist)\\b/i,
        "the questionnaire must not assign unsupported extreme ideology labels");
      assert.match(html, /Important limits/);
    }

    // A completed assessment should restore its results after refresh.
    await page.reload();
    await page.locator("#results").waitFor({ state: "visible" });
    assert.match(await page.locator("#results .profile-pill").innerText(), /your politica profile/i);

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
