import { test, expect } from "@playwright/test";

test.describe("Portfolio E2E & Accessibility Test Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8899/");
  });

  test("Navigation & Subroute Deep Linking", async ({ page }) => {
    // 1. Check title and primary hero elements
    await expect(page).toHaveTitle(/Dibyendu Maity/);
    const heading = page.locator("h1");
    await expect(heading).toContainText("Machine-learning methods");

    // 2. Click Research navigation
    await page.click('nav.desktop-nav a[href="#research"]');
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
    await expect(mobileMenu).toHaveClass(/is-active/);
    await expect(mobileMenu).toHaveAttribute("aria-hidden", "false");

    // Press Escape key to close mobile menu
    await page.keyboard.press("Escape");
    await expect(mobileMenu).not.toHaveClass(/is-active/);
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("Hero Visual ARIA Tabs & Keyboard Navigation", async ({ page }) => {
    const tabFes = page.locator("#hero-tab-fes");
    const tabProtein = page.locator("#hero-tab-protein");

    await expect(tabFes).toHaveAttribute("aria-selected", "true");
    await expect(tabProtein).toHaveAttribute("aria-selected", "false");

    // Click Protein Cartoon tab
    await tabProtein.click();
    await expect(tabProtein).toHaveAttribute("aria-selected", "true");
    await expect(tabFes).toHaveAttribute("aria-selected", "false");

    // Verify 3Dmol container becomes visible
    const molContainer = page.locator("#protein-3dmol-container");
    await expect(molContainer).toBeVisible();

    // Use Keyboard Arrow Left to return to FES tab
    await tabProtein.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(tabFes).toHaveAttribute("aria-selected", "true");
  });

  test("Publications Search, Filter & BibTeX Copy", async ({ page }) => {
    await page.goto("http://localhost:8899/#publications");

    // 1. Search by title keyword "PathGennie"
    const searchInput = page.locator("#pub-search-input");
    await searchInput.fill("PathGennie");
    const pubCards = page.locator(".publication-card");
    await expect(pubCards).toHaveCount(1);
    await expect(pubCards.first()).toContainText("PathGennie");

    // 2. Clear search input
    await searchInput.fill("");
    await expect(pubCards).toHaveCount(10);

    // 3. Filter by 'Preprints' button
    const preprintBtn = page.locator('.filter-btn[data-filter="preprint"]');
    await preprintBtn.click();
    await expect(pubCards).toHaveCount(2);

    // 4. Reset to 'All'
    const allBtn = page.locator('.filter-btn[data-filter="all"]');
    await allBtn.click();
    await expect(pubCards).toHaveCount(10);

    // 5. Test BibTeX copy action button
    const bibtexBtn = page.locator(".cite-bibtex-btn").first();
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
    await copyCodeBtn.click();
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
    await expect(cvContainer).toContainText("Conference Awards");
    await expect(cvContainer).toContainText("American Institute of Physics");

    // Verify PDF Download button is present with correct link
    const pdfBtn = cvContainer.locator('a[download="Dibyendu_Maity_CV.pdf"]');
    await expect(pdfBtn).toBeVisible();
    await expect(pdfBtn).toHaveAttribute("href", "./assets/dibyendumaity-cv.pdf");
  });
});
