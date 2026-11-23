module.exports = {
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:8080', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'npx http-server . -p 8080 -c-1 -s', url: 'http://localhost:8080', reuseExistingServer: true },
};
