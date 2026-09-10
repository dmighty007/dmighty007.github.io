import { test, expect } from "@playwright/test";

test.describe("Portfolio E2E & Accessibility Test Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8899/");
  });

  test("Navigation & Subroute Deep Linking", async ({ page }) => {
    // 1. Check title and primary hero elements
    await expect(page).toHaveTitle(/Dibyendu Maity/);
    const heading = page.locator('section[data-section="home"] h1');
    await expect(heading).toContainText("Machine-learning methods");

    // 2. Click Research navigation
    await page.locator('a[data-section-link="research"]:visible').first().click();
    await expect(page.locator('section[data-section="research"]')).toHaveClass(/is-active/);

    // 3. Test deep linking to subroute #research/pathgennie
    await page.goto("http://localhost:8899/#research/pathgennie");
    await expect(page.locator('section[data-section="research"]')).toHaveClass(/is-active/);
    const caseStudyCard = page.locator("#pathgennie");
    await expect(caseStudyCard).toBeVisible();

    // 4. Test unknown hash fallback
    await page.goto("http://localhost:8899/#nonexistent-route");
    await expect(page.locator('section[data-section="home"]')).toHaveClass(/is-active/);

    // 5. Test browser Back and Forward navigation
    await page.goto("http://localhost:8899/#publications");
    await expect(page.locator('section[data-section="publications"]')).toHaveClass(/is-active/);
    await page.goBack();
    await expect(page.locator('section[data-section="home"]')).toHaveClass(/is-active/);
    await page.goForward();
    await expect(page.locator('section[data-section="publications"]')).toHaveClass(/is-active/);
  });

  test("Mobile Menu Focus Lock & ARIA State", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    const toggleBtn = page.locator(".menu-toggle");
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

    // Open mobile menu
    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toHaveClass(/is-open/);
    await expect(mobileMenu).toHaveAttribute("aria-hidden", "false");
    await expect(page.locator("#main")).toHaveJSProperty("inert", true);

    // Focus stays inside the modal drawer when cycling with Shift+Tab.
    const firstLink = mobileMenu.locator("a").first();
    const lastLink = mobileMenu.locator("a").last();
    await lastLink.focus();
    await page.keyboard.press("Tab");
    await expect(firstLink).toBeFocused();

    // Press Escape key to close mobile menu
    await page.keyboard.press("Escape");
    await expect(mobileMenu).not.toHaveClass(/is-open/);
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    await expect(toggleBtn).toBeFocused();
  });

  test("Hero landscape explorer exposes usable native controls", async ({ page }) => {
    const landscape = page.locator("#hero-landscape");
    const animationToggle = page.locator("#hero-toggle-anim");
    const reset = page.locator("#hero-reset-anim");

    await expect(landscape).toBeVisible();
    await expect(landscape).toHaveAttribute("tabindex", "0");
    await expect(animationToggle).toHaveAttribute("aria-label", "Pause trajectory animation");
    await animationToggle.click();
    await expect(animationToggle).toHaveAttribute("aria-label", "Play trajectory animation");
    await reset.click();

    const proteinDot = page.locator('[data-hero-slide="protein"]');
    await proteinDot.click();
    await expect(proteinDot).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#protein-panel")).toHaveClass(/is-active/);
    await page.locator("#hero-carousel-next").click();
    await expect(page.locator("#landscape-panel")).toHaveClass(/is-active/);
  });

  test("Hero fallback, conference details, and mobile publication controls remain robust", async ({ page }) => {
    await expect(page.locator("#hero-poster img")).toHaveAttribute("src", "assets/fes-landscape.svg");
    await expect(page.locator("#hero-poster img")).toHaveAttribute("loading", "eager");
    await expect(page.locator("#stat-publications")).toHaveText("8");

    await page.goto("http://localhost:8899/#about");
    await expect(page.locator(".about-conferences-section")).toContainText("CDAM 2026");
    await expect(page.locator(".about-conferences-section")).toContainText("Best Poster Award");
    await expect(page.locator(".about-awards-section")).toContainText("INSPIRE Scholarship");
    await expect(page.locator(".about-awards-section")).toContainText("All India Rank 177");

    for (const width of [320, 360, 375, 390, 412, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("http://localhost:8899/#publications");
      const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth);
    }
  });

  test("Publications Search, Filter & BibTeX Copy", async ({ page }) => {
    await page.goto("http://localhost:8899/#publications");

    // 1. Search by title keyword "PathGennie"
    const searchInput = page.locator("#publication-search");
    await searchInput.fill("PathGennie");
    const pubCards = page.locator(".publication-card");
    await expect(pubCards).toHaveCount(1);
    await expect(pubCards.first()).toContainText("PathGennie");

    // 2. Clear search input
    await searchInput.fill("");
    await expect(pubCards).toHaveCount(8);

    // 3. Filter by 'Preprints' button
    const preprintBtn = page.locator('.filter-btn[data-filter="preprint"]');
    await preprintBtn.click();
    await expect(pubCards).toHaveCount(1);

    // 4. Reset to 'All'
    const allBtn = page.locator('.filter-btn[data-filter="all"]');
    await allBtn.click();
    await expect(pubCards).toHaveCount(8);

    // 5. Test BibTeX copy action button
    const bibtexBtn = page.locator("[data-bibtex-id]").first();
    await bibtexBtn.click();
    await expect(bibtexBtn).toContainText("Copied!");
  });

  test("Scientific Software Subtab Switching & Code Copy", async ({ page }) => {
    await page.goto("http://localhost:8899/#software");

    // 1. Inspect initial active software (TRAILS-MD)
    const activeDetail = page.locator("#software-detail-container");
    await expect(activeDetail).toContainText("TRAILS-MD");

    // 2. Click PathGennie software tab
    const pathgennieTab = page.locator('.software-tab-btn[data-software-id="pathgennie"]');
    await pathgennieTab.click();
    await expect(activeDetail).toContainText("PathGennie");

    // 3. Verify copy installation command button
    const copyCodeBtn = page.locator(".copy-code-btn");
    await expect(copyCodeBtn).toBeVisible();
    await copyCodeBtn.click({ force: true });
    await expect(copyCodeBtn).toContainText("Copied!");
  });

  test("CV Page Rendering & Action Buttons", async ({ page }) => {
    await page.goto("http://localhost:8899/#cv");

    const cvContainer = page.locator("#cv-container");
    await expect(cvContainer).toBeVisible();
    await expect(cvContainer).toContainText("Dibyendu Maity");
    await expect(cvContainer).toContainText("Ph.D.");
    await expect(cvContainer).toContainText("Conference Presentations and Participation");
    await expect(cvContainer).toContainText("Computational and Data-Driven Advanced Materials");
    await expect(cvContainer).toContainText("Workshop on Machine Learning, Enhanced Sampling");
    await expect(cvContainer).toContainText("Recent Advances in Modeling Rare Events");
    await expect(cvContainer).toContainText("CHEMDOJO 3.0");
    await expect(cvContainer).toContainText("Awards and Recognition");
    await expect(cvContainer).toContainText("INSPIRE Scholarship");

    // Verify PDF Download button is present with correct link
    const pdfBtn = cvContainer.locator('a[download="Dibyendu_Maity_CV.pdf"]');
    await expect(pdfBtn).toBeVisible();
    await expect(pdfBtn).toHaveAttribute("href", "./assets/dibyendumaity-cv.pdf");

    const thesisBtn = cvContainer.getByRole("link", { name: "View Ph.D. Thesis" });
    await expect(thesisBtn).toHaveAttribute("href", "./assets/dibyendu-maity-phd-thesis.pdf");
  });
});
