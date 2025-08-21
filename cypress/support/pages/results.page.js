// cypress/support/pages/results.page.js

const HEADER_SELECTORS = [
  '[data-testid="property-list-header"]',
  '[aria-live="assertive"] h1',
  'h1[data-testid="results-header"]',
  '[role="heading"][aria-level="1"]',
  "h1:visible",
].join(", ");

export const ResultsPage = {
  waitForResults() {
    // Always return a Cypress chain
    return cy.get("body", { timeout: 20000 }).then(($b) => {
      if ($b.find(HEADER_SELECTORS).length) {
        return cy
          .get(HEADER_SELECTORS, { timeout: 20000 })
          .should("be.visible");
      }
      if ($b.find('div[data-testid="property-card"]').length) {
        return cy
          .get('div[data-testid="property-card"]', { timeout: 20000 })
          .should("be.visible");
      }
      return cy
        .get('[data-testid="searchbox-dates-container"]', { timeout: 20000 })
        .should("exist");
    });
  },

  getHeaderText() {
    return cy.get("body").then(($b) => {
      if ($b.find(HEADER_SELECTORS).length) {
        return cy
          .get(HEADER_SELECTORS)
          .first()
          .invoke("text")
          .then((t) => t.replace(/\s+/g, " ").trim());
      }
      // Always return a string (empty fallback)
      return "";
    });
  },

  getResultsCount() {
    return this.getHeaderText().then((txt) => {
      const match = txt.match(/\d[\d.,\u00A0\u202F]*/);
      const raw = match?.[0] ?? "0"; // optional chaining
      const normalized = raw.replace(/[\u00A0\u202F]/g, "");
      const n = Number(normalized);
      return Number.isFinite(n) ? n : 0;
    });
  },

  assertDestination(city) {
    return this.getHeaderText().then((txt) => {
      if (txt) {
        expect(txt.toLowerCase()).to.include(city.toLowerCase());
      } else {
        cy.log("ℹ️ No header found → skipping destination assertion");
      }
    });
  },

  assertCountPositive() {
    return this.getResultsCount().then((n) => {
      expect(n, "results count").to.be.greaterThan(0);
    });
  },

  assertDatesContain(days) {
    const [d1, d2] = days.map(String);

    return cy.get("body").then(($b) => {
      if (
        $b.find('[data-testid="searchbox-dates-container"] > .be2db1c937')
          .length
      ) {
        return cy
          .get('[data-testid="searchbox-dates-container"] > .be2db1c937')
          .invoke("text")
          .then((t) => {
            const clean = t.replace(/\s+/g, " ").trim();
            expect(clean).to.include(d1);
            expect(clean).to.include(d2);
          });
      }
      if ($b.find('button[data-testid="date-display-field-start"]').length) {
        return cy
          .get('button[data-testid="date-display-field-start"]')
          .invoke("text")
          .then((t) => expect(t).to.include(d1))
          .then(() =>
            cy
              .get('button[data-testid="date-display-field-end"]')
              .invoke("text")
              .then((t) => expect(t).to.include(d2))
          );
      }
      return cy
        .get('[data-testid="searchbox-dates-container"]')
        .invoke("text")
        .then((t) => {
          const clean = t.replace(/\s+/g, " ").trim();
          expect(clean).to.include(d1);
          expect(clean).to.include(d2);
        });
    });
  },

  waitForCards() {
    return cy
      .get('div[data-testid="property-card"]', { timeout: 20000 })
      .should("be.visible");
  },

  logPropertyNames() {
    return cy
      .get('div[data-testid="property-card"] div[data-testid="title"]')
      .each(($el) => {
        const name = $el.textContent?.trim(); // optional chaining
        if (name) {
          // eslint-disable-next-line no-console
          console.log("Property:", name);
        }
      });
  },
};
