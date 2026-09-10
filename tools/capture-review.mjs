import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await desktop.goto("http://localhost:8899/", { waitUntil: "networkidle" });
await desktop.screenshot({ path: "review-artifacts/home-desktop.png", fullPage: false });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await mobile.goto("http://localhost:8899/", { waitUntil: "networkidle" });
await mobile.screenshot({ path: "review-artifacts/home-mobile.png", fullPage: false });
await browser.close();
