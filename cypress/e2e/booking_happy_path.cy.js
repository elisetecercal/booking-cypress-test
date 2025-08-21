// @ts-nocheck
/// <reference types="cypress" />
import { HomePage } from "../support/pages/home.page";
import { ResultsPage } from "../support/pages/results.page";

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

describe("Booking – Happy Path (no guest changes)", () => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const checkIn = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  const checkOut = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 7);

  beforeEach(() => {
    HomePage.visit();
    HomePage.acceptCookiesIfPresent();
    HomePage.assertHeader();
  });

  it("Search Porto with future dates → see results", () => {
    HomePage.selectDestination("Porto");
    HomePage.openDatePicker();
    HomePage.pickDate(iso(checkIn));
    HomePage.pickDate(iso(checkOut));

    HomePage.submit();

    // Assert results page
    ResultsPage.waitForResults(); // waits the H1 with the count
    ResultsPage.assertDestination("Porto"); // header mentions Porto
    ResultsPage.assertCountPositive(); // > 0 results
    ResultsPage.assertDatesContain([checkIn.getDate(), checkOut.getDate()]);
    // optional:
    ResultsPage.waitForCards();
    ResultsPage.logPropertyNames();
  });
});
