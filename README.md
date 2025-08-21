# Booking.com – Cypress E2E (Happy Path + Edge Case)

This repo demonstrates Cypress end-to-end tests with a Page Object pattern.

## Scenarios covered

1. **Happy Path**

   - Go to home
   - Select destination "Porto" from autocomplete
   - Pick check-in/out dates (1 → 7 next month)
   - Submit and verify:
     - results exist
     - destination mentions "Porto"
     - date range shows both days

2. **Edge Case**

   - Open datepicker and verify yesterday is disabled.

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

- **Edge cases**

  - Leave destination empty and try searching
  - Search with only check-in date selected
  - Search with past dates (expect calendar block)

- **Performance checks**
  - Ensure search results load under X seconds
  - Validate that no JavaScript errors are thrown in console

---
