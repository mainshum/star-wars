import { Router } from "../../src/router";
import { HTTP } from "../utils";

describe("rendering", () => {
  describe("network issues", () => {});

  describe("happy path", () => {
    beforeEach(() => {
      HTTP.useMockCharacter();
      HTTP.useMockVehicle();
    });

    it("renders character with avatar, full name, planet, vehicle(s) and race", () => {
      cy.visit(Router.Character({ id: "1" }));
    });
  });
});
