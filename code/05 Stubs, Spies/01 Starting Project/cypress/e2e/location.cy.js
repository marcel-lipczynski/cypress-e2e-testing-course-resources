/// <reference types="cypress" />

describe("share location", () => {
  beforeEach(() => {
    cy.clock();
    cy.fixture("user-location.json").as("userLocation");
    cy.visit("/").then((window) => {
      cy.get("@userLocation").then((fakePosition) => {
        cy.stub(window.navigator.geolocation, "getCurrentPosition")
          .as("getUserPosition")
          .callsFake((cb) => {
            setTimeout(() => {
              cb(fakePosition);
            }, 100); //timeout is added so the function does not execute immadietly. It takes some time to fetch cordinates from browser so we need to fake it as well
          });
      });

      cy.stub(window.navigator.clipboard, "writeText")
        .as("saveToClipboard")
        .resolves(); // function returns a promise;

      cy.spy(window.localStorage, "setItem").as("storeLocation");
      cy.spy(window.localStorage, "getItem").as("getStoredLocation");
    });
  });

  it("should fetch the user location", () => {
    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get("@getUserPosition").should("have.been.called", 1);
    cy.get('[data-cy="get-loc-btn"]').should("be.disabled");
    cy.get('[data-cy="actions"]').should("contain", "Location fetched");
  });

  it("should share a location URL", () => {
    cy.get('[data-cy="name-input"]').type("John Doe");
    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get('[data-cy="share-loc-btn"]').click();

    cy.get("@saveToClipboard").should("have.been.called");
    cy.get("@userLocation").then((fakePosition) => {
      cy.get("@saveToClipboard").should(
        "have.been.calledWithMatch",
        new RegExp(
          `${fakePosition.coords.latitude}.*${
            fakePosition.coords.longitude
          }.*${encodeURI("John Doe")}`
        )
      );
      cy.get("@storeLocation").should(
        "have.been.calledWithMatch",
        /John Doe/,
        new RegExp(
          `${fakePosition.coords.latitude}.*${
            fakePosition.coords.longitude
          }.*${encodeURI("John Doe")}`
        )
      );
    });
    cy.get('[data-cy="share-loc-btn"]').click();
    cy.get("@getStoredLocation").should("have.been.called");
    cy.get('[data-cy="info-message"]').should("be.visible"); //should('have.class', 'visible');
    cy.tick(2000); //simulate that 2 seconds has passed and the banner is not visible anymore
    cy.get('[data-cy="info-message"]').should("not.be.visible");
  });
});
