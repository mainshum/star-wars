import { sortAlpabetically } from "../../src/utils";

describe("rendering", () => {
  describe("network issues", () => {
    it("renders Error when people api endpoint returns 404", () => {
      cy.clock();
      cy.intercept("https://swapi.dev/api/people", { statusCode: 404 }).as(
        "apiCall"
      );
      cy.visit("/");

      // simulate time so that react-query runs its retries faster
      cy.wait("@apiCall");
      cy.tick(5000);
      cy.wait("@apiCall");
      cy.tick(5000);
      cy.wait("@apiCall");
      cy.tick(5000);

      cy.findByRole("main").findByTestId("error").should("exist");
    });
  });

  describe("happy path", () => {
    it("renders characters in alphabetical order", () => {
      cy.intercept("https://swapi.dev/api/people", { fixture: "people.json" });
      cy.visit("/");

      const texts: string[] = [];

      cy.findAllByRole("listitem")
        .should("have.length.above", 3)
        .each(($el) => {
          cy.wrap($el)
            .invoke("text")
            .then((text) => texts.push(text));
        })
        .then(() => {
          sortAlpabetically(texts, (d) => d).forEach((txt, ind) =>
            expect(txt).to.eq(texts[ind])
          );
        });
    });
  });
});
