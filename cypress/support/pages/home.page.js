// Page Object for Booking home

export const HomePage = {
  visit() {
    cy.visit("https://www.booking.com");
  },

  acceptCookiesIfPresent() {
    // Wait a bit for the banner to render if it exists
    cy.get("body").then(($b) => {
      if ($b.find("#onetrust-accept-btn-handler").length) {
        cy.get("#onetrust-accept-btn-handler")
          .should("be.visible")
          .click({ force: true });
      }
    });
  },

  assertHeader() {
    // use the logo testid (more stable than class names)
    cy.get('[data-testid="header-booking-logo"]', { timeout: 10000 }).should(
      "be.visible"
    );
  },

  selectDestination(city) {
    // Focus + type
    cy.get('input[name="ss"]', { timeout: 15000 })
      .as("dest")
      .scrollIntoView()
      .click({ force: true })
      .type(city, { delay: 50, force: true });

    // Wait until the combobox opens
    cy.get("@dest").should("have.attr", "aria-expanded", "true");

    // Read the listbox id from aria-controls (sometimes looks like ":rh:")
    cy.get("@dest")
      .invoke("attr", "aria-controls")
      .then((listId) => {
        cy.window().then((win) => {
          // Safely escape odd ids (e.g. ":rh:")
          const escape =
            win.CSS && win.CSS.escape
              ? win.CSS.escape.bind(win.CSS)
              : (s) => s.replace(/:/g, "\\:");

          // Fallback container if aria-controls is missing
          const listSelector = listId
            ? `#${escape(listId)}`
            : '#autocomplete_results, [data-testid="autocomplete-results"]';

          // Then click the one that contains "Porto" (or your 'city' param)
          cy.get(`${listSelector} [id^="autocomplete-result-"]`, {
            timeout: 10000,
          }).should("be.visible");

          cy.contains(
            `${listSelector} [id^="autocomplete-result-"]`,
            new RegExp(`^${city}\\b`, "i") // matches "Porto" or "Porto, Portugal"
          ).click({ force: true });
        });
      });

    // Ensure it collapsed and value stuck
    cy.get("@dest").should("have.attr", "aria-expanded", "false");
    cy.get("@dest").should(($i) => {
      expect(String($i.val()).toLowerCase()).to.include(city.toLowerCase());
    });
  },

  openDatePicker() {
    cy.get('[data-testid="searchbox-dates-container"]').click();
    cy.get('[data-testid="date-display-field-start"]', {
      timeout: 10000,
    }).should("be.visible");
  },

  pickDate(isoDate) {
    cy.get(`[data-date="${isoDate}"]`).click();
  },

  submit() {
    cy.get('button[type="submit"]').filter(":visible").first().click();
  },
};
