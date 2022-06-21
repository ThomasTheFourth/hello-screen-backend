const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=3840,2160`],
    defaultViewport: {
      width: 3840,
      height: 2160,
    },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000/screens/renderer");
  setTimeout(async () => {
    await page.screenshot({ path: "example.png" });
    await browser.close();
  }, 1000);
})();
