import { sortAlpabetically } from "../../src/utils";
import { HTTP } from "../utils";

describe("rendering", () => {
  describe("network issues", () => {
    it.only("renders Error when people api endpoint returns 404", () => {
      cy.on("uncaught:exception", () => false);
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
      cy.wait("@apiCall");
      cy.tick(5000);

      cy.findByTestId("error").should("exist");
    });
  });

  describe("happy path", () => {
    beforeEach(() => {
      HTTP.useMockPlanets();
      HTTP.useMockCharacters();
      HTTP.useMockVehicles();
    });
    const verifyAtLeast5ItemsInOrder = () => {
      const texts: string[] = [];

      cy.findAllByRole("listitem")
        .should("have.length.above", 5)
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
    };

    it("renders vehicles in alphabetical order", () => {
      cy.visit("/vehicles");

      verifyAtLeast5ItemsInOrder();
    });
    it("renders characters in alphabetical order", () => {
      cy.visit("/");
      verifyAtLeast5ItemsInOrder();
    });

    it("renders planets in alphabetical order", () => {
      cy.visit("/planets");
      verifyAtLeast5ItemsInOrder();
    });
  });
});
