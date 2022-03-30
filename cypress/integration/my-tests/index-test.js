// Provides auto-complete functionalities
/// <reference types="cypress"/>

describe("Empty test", () => {

    // it specifies a test case
    it("Correct text on page", () => {
        cy.visit("http://localhost:8080");
        cy.contains("Name");
        cy.contains("Submit");
    })
});

