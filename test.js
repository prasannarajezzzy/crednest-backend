const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("Crednest.html", {
    waitUntil: "networkidle0"
  });

  await page.setViewport({ width: 1080, height: 1080 });

  for (let i = 0; i < 30; i++) {
    await page.evaluate(i => {
      currentIndex = i;
      renderPost();
    }, i);

    await page.waitForTimeout(300);

    const element = await page.$("#canvas-container");
    await element.screenshot({
      path: `crednest-day-${i + 1}.png`
    });
  }

  await browser.close();
})();
