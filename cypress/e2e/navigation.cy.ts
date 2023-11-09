import { HTTP } from "../utils";

describe("navbar navigation", () => {
  beforeEach(() => {
    HTTP.useMockPlanets();
    HTTP.useMockCharacters();
    HTTP.useMockVehicles();
  });

  const checkLink = (linkIndex: number, linkContains: string) => {
    cy.visit("/");
    cy.findByRole("navigation").findAllByRole("link").eq(linkIndex).click();

    cy.url().should("contain", linkContains);
  };

  it("characters link should point to /characters", () => {
    checkLink(0, "/characters");
  });

  it("vehicles link should point to /vehicles", () => {
    checkLink(1, "/vehicles");
  });

  it("planets link should point to /planets", () => {
    checkLink(2, "/planets");
  });
});
