/// <reference types="Cypress" />

describe("tasks page", () => {
  it("should render the main image", () => {
    cy.visit("http://localhost:5173");
    cy.get(".main-header>img").should("have.length", 1);
  });

  it("should display the page title", () => {
    cy.visit("http://localhost:5173");
    cy.get("h1").as('title').should("have.length", 1);
    cy.get("@title").contains("My Cypress Course Tasks");
  });
});
