const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.booking.com",
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 12000,
    video: false,
  },
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    reportFilename: "[name]_[status]_[datetime]",
    overwrite: false,
    html: true,
    json: true,
  },
});
