import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:1234",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('')
      on('task', {
        seedDatabase() {
          //Run your NodeJS code
          //e.g. send http request, edit file, run scripts and so on
        }
      });
    },
  },
});
