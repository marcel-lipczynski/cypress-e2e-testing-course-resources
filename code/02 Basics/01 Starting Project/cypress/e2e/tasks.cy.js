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

  it("should validate user input", () => {
    cy.get('[data-cy="start-add-task-button"]').click(); //cy.contains('Add task') will also work
    cy.get(".modal").contains("Add Task").click();

    cy.contains("Please provide values").should("exist");
  });

  it("should filter tasks", () => {
    //Add some task under urgent category
    cy.get('[data-cy="start-add-task-button"]').click(); //cy.contains('Add task') will also work
    cy.get("#title").type("My new task");
    cy.get("#summary").type("Description of my new task");
    cy.get("#category").select("urgent");
    cy.get(".modal").contains("Add Task").click();

    cy.get("ul.task-list li.task")
      .should("exist")
      .then(($li) => {
        //for some reason when you swap those checks places it will not find $li for the second time
        //found out why - when you filter it out it will disapear from dom tree. When you filter it in then it will appear but it will be different dom element (different pointer)      cy.get("#filter").select("urgent");
        cy.wrap($li).should("exist");

        cy.get("#filter").select("moderate");
        cy.wrap($li).should("not.exist");
      });

    //Choose moderate filter from filters dropdown
    // cy.get("#filter").select("moderate");
  });

  it("should add multiple tasks", () => {
    cy.get('[data-cy="start-add-task-button"]').click(); //cy.contains('Add task') will also work
    cy.get("#title").type("Task 1");
    cy.get("#summary").type("First task");
    cy.get(".modal").contains("Add Task").click();
    cy.get(".task").should("have.length", 1);

    cy.get('[data-cy="start-add-task-button"]').click(); //cy.contains('Add task') will also work
    cy.get("#title").type("Task 2");
    cy.get("#summary").type("Second task");
    cy.get(".modal").contains("Add Task").click();
    cy.get(".task").should("have.length", 2);

    cy.get(".task").eq(0).contains("First task");
    cy.get(".task").eq(1).contains("Second task");
  });
});
