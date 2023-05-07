/// <reference types="Cypress" />

describe("page navigation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("should navigate between pages", () => {
    cy.get('[data-cy="header-about-link"]').click();
    cy.location("pathname").should("eq", "/about");
    cy.url().should("include", "/about");

    cy.go("back");
    cy.location("pathname").should("eq", "/");
    cy.url().should("not.include", "/about");

    cy.get('[data-cy="header-about-link"]').click();
    cy.get('[data-cy="header-home-link"]').click();
    cy.location("pathname").should("eq", "/");
    cy.url().should("not.include", "/about");
  });
});
