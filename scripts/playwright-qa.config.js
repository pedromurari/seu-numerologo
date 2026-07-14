module.exports = {
  testDir: __dirname,
  testMatch: /qa-browser-i18n\.spec\.js/,
  timeout: 60000,
  use: {
    browserName: 'chromium',
    headless: true,
  },
};
