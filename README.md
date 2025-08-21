# Booking.com – Cypress E2E (Happy Path + Edge Case)

This repo demonstrates Cypress end-to-end tests with a Page Object pattern.

## Scenarios covered

### Happy Path Scenario 1

```gherkin
Given I’m on the Booking.com home page
When I select destination "Porto" from autocomplete
And I choose check-in and check-out dates (1 → 7 of next month)
And I keep the default guests option (2 adults)
And I click "Search"
Then I see a results list for Porto with the selected dates applied
```

### Steps to Follow

- Go to home
- Select destination **"Porto"** from autocomplete
- Pick check-in / check-out dates (1 → 7 next month)
- Submit the form and verify:
  - Results exist
  - Destination mentions "Porto"
  - Date range shows both days

### Edge Case Scenario

This edge case follows the same flow as the **Happy Path**,
but instead of selecting future dates, it attempts to pick **past dates**.

```gherkin
Given I’m on the Booking.com home page
When I select destination "Porto" from autocomplete
And I try to choose check-in and check-out dates in the past
Then I should not be able to select them (they are disabled)
And no search results should be returned for an invalid date range
```

## How to run

```bash
npm install
npm run cy:open
npm test
```

## Future scenarios to explore

These are not yet automated, but highlight possible extensions of the test suite:

- **Different number of guests**

  - Decrease adults from 2 → 1
  - Add children with specific ages
  - Add multiple rooms

- **Flexible dates**

  - Select a ±3 days option in the calendar
  - Verify results adjust accordingly

- **Different destinations**

  - Search for “Lisbon” or international cities
  - Validate search works across locales (pt-PT, en-US)

- **Currency & language**

  - Change currency to USD/EUR/GBP
  - Change language to English/Portuguese
  - Verify these choices persist in search results

## Edge cases

- Leave destination empty and try searching

```gherkin
Given I’m on the Booking.com home page
When I leave the destination field empty
And I select valid check-in and check-out dates
And I click "Search"
Then I should see an error or validation message
And no results should be shown
```

- Search with only check-in date selected

```gherkin
Given I’m on the Booking.com home page
When I select only a check-in date
And I leave the check-out date empty
And I click "Search"
Then I should see a validation message prompting me to select both dates
And the search should not continue
```

- Check if Booking.com adapts its interface based on the detected user location
  (IP, VPN, or browser settings). This can affect:

- **Currency** (€, $, £, etc.)
- **Language** (Portuguese, English, etc.)
- **Date format / Calendar** (DD/MM vs. MM/DD, week starting Sunday vs. Monday)

```gherkin
Given I’m on the Booking.com home page from a different region (via VPN or browser setting)
When I select destination "Porto" from autocomplete
And I choose check-in and check-out dates
Then the page should:
  - Display currency consistent with the detected country
  - Adjust the language appropriately
  - Show correct date formats and calendar behavior
```

- **Performance checks**
  - Ensure search results load under X seconds
  - Validate that no JavaScript errors are thrown in console

---

```

```
