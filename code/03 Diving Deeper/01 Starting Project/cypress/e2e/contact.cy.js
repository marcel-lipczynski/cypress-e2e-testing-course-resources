/// <reference types="Cypress" />

describe("contact form", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/about");
  });

  it("should submit the form", () => {
    cy.get('[data-cy="contact-input-message"]').type("My message");
    cy.get('[data-cy="contact-input-name"]').type("My name");
    cy.get('[data-cy="contact-input-email"]')
      .as("email-input")
      .type("mymail@mymail.com");

    cy.get('[data-cy="contact-btn-submit"]').then(($submitBtn) => {
      cy.wrap($submitBtn).should("have.text", "Send Message");
      cy.wrap($submitBtn).click().should("have.text", "Sending...");
    });
  });

  it("should validate the form input", () => {
    cy.get('[data-cy="contact-btn-submit"]')
      .click()
      .then(($el) => {
        cy.wrap($el)
          .should("not.have.text", "Sending...")
          .and("not.have.attr", "disabled");
      });
    cy.get('[data-cy="contact-btn-submit"]').contains("Send Message");

    cy.get('[data-cy="contact-input-message"]').blur();
    cy.get('[data-cy="contact-input-message"]')
      .parent()
      .should("have.attr", "class")
      .and("match", /invalid/);

    cy.get('[data-cy="contact-input-name"]').focus().blur();
    cy.get('[data-cy="contact-input-name"]')
      .parent()
      .should("have.attr", "class")
      .and("match", /invalid/);

    cy.get('[data-cy="contact-input-email"]').focus().blur();
    cy.get('[data-cy="contact-input-email"]')
      .parent()
      .should(($el) => {
        expect($el.attr('class').contains('invalid'))
      })
      .should("have.attr", "class")
      .and("match", /invalid/);
  });
});
