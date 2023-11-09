import { Router } from "../../src/router";
import { HTTP } from "../utils";

describe("rendering", () => {
  describe("happy path", () => {
    beforeEach(() => {
      HTTP.useMockCharacter();
      HTTP.useMockVehicle();
      HTTP.useMockPlanet();
    });
    it("renders character with avatar, full name, planet, vehicle(s) and race", () => {
      cy.visit(Router.Character({ id: "1" }));

      cy.findAllByText("Luke Skywalker").should("have.length", 2);
      cy.findAllByText("Snowspeeder").should("have.length", 2);
      cy.findByText("male").should("exist");
      cy.findByText("Tatooine").should("exist");
    });

    it("renders vehicle with name, population, characters connected", () => {
      cy.visit(Router.Vehicle({ id: "1" }));

      cy.findAllByText("Luke Skywalker").should("exist");
      cy.findAllByText("Snowspeeder").should("exist");
      cy.findByText("t-47 airspeeder").should("exist");
    });

    it("renders planet with population, name, residents", () => {
      cy.visit(Router.Planet({ id: "1" }));

      cy.findAllByText("Luke Skywalker").should("exist");
      cy.findAllByText("Tatooine").should("exist");
      cy.findByText("200000").should("exist");
    });
  });
});
