/// <reference types="Cypress" />

describe("task management", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should open and close new task modal", () => {
    cy.get('[data-cy="start-add-task-button"]').as("add-task-button").click();
    cy.get(".backdrop").click({ force: true });
    cy.get(".backdrop").should("not.exist");
    cy.get(".modal").should("not.exist");

    //Second scenario - close by 'Cancel' button

    cy.get("@add-task-button").click();
    cy.contains("Cancel").click();
    cy.get(".backdrop").should("not.exist");
    cy.get(".modal").should("not.exist");
  });

  it("should create a new task", () => {
    cy.get('[data-cy="start-add-task-button"]').click(); //cy.contains('Add task') will also work
    cy.get("#title").type("My new task");
    cy.get("#summary").type("Description of my new task");
    cy.get(".modal").contains("Add Task").click();

    cy.get(".backdrop").should("not.exist");
    cy.get(".modal").should("not.exist");

    //should be possible to use .then() to omit getting the same element again and again
    cy.get("ul.task-list li.task").as("added-task").should("have.length", 1);
    cy.get("@added-task").find("h2").should("have.text", "My new task");
    cy.get("@added-task")
      .find("p")
      .should("have.text", "Description of my new task");
  });
});
