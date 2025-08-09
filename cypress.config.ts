import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "support/e2e.ts",
    specPattern: "cypress/e2e/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {

    },
  },
});
