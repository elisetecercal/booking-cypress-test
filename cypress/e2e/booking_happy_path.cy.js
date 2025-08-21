// @ts-nocheck
/// <reference types="cypress" />

import { HomePage } from "../support/pages/home.page";
import { ResultsPage } from "../support/pages/results.page";

// Utility to format YYYY-MM-DD (local)
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

describe("Booking.com – Search Flow", () => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const checkIn = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  const checkOut = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 7);

  beforeEach(() => {
    HomePage.visit();
    HomePage.acceptCookiesIfPresent();
    HomePage.assertHeader();
  });

  // Happy Path
  it("Happy Path: Search Porto with valid future dates → see results", () => {
    HomePage.selectDestination("Porto");
    HomePage.openDatePicker();

    // Use data-date attribute
    HomePage.pickDate(iso(checkIn));
    HomePage.pickDate(iso(checkOut));

    HomePage.submit();

    // Assert results page
    ResultsPage.waitForResults();
    ResultsPage.assertDestination("Porto");
    ResultsPage.assertCountPositive();
    ResultsPage.assertDatesContain([checkIn.getDate(), checkOut.getDate()]);
    ResultsPage.waitForCards();
    ResultsPage.logPropertyNames();
  });

  // Edge Case
  it("Edge Case: Past dates should be disabled (cannot select yesterday)", () => {
    HomePage.selectDestination("Porto");
    HomePage.openDatePicker();

    const now = new Date();
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );
    const yIso = iso(yesterday);

    // 1) Yesterday should be disabled
    cy.get(`[data-date="${yIso}"]`, { timeout: 10000 }).should(($el) => {
      const aria = $el.attr("aria-disabled");
      const cls = $el.attr("class") || "";
      const isDisabled =
        aria === "true" || /disabled|unavailable|blocked/i.test(cls);
      expect(isDisabled, `Past date ${yIso} should be disabled`).to.be.true;
    });

    // 2) Force click should not make it "selected"
    cy.get(`[data-date="${yIso}"]`).click({ force: true });
    cy.get(`[data-date="${yIso}"]`).should(($el) => {
      const cls = $el.attr("class") || "";
      const looksSelected = /selected|range-start|range-end/i.test(cls);
      expect(looksSelected, `Past date ${yIso} should not be selectable`).to.be
        .false;
    });

    // 3) Contrast: today should be active
    const todayIso = iso(now);
    cy.get(`[data-date="${todayIso}"]`).should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
  });
});
