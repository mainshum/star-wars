import { HTTP } from "../utils";

describe("navbar navigation", () => {
  beforeEach(() => {
    HTTP.useMockPlanets();
    HTTP.useMockCharacters();
    HTTP.useMockVehicles();
  });

  const checkLink = (shouldPointTo: string, linkDisplay: string) => {
    cy.visit("/");
    cy.findByRole("navigation").findByText(linkDisplay).click();

    cy.url().should("contain", shouldPointTo);
  };

  it("characters link should point to /characters", () => {
    checkLink("/characters", "Characters");
  });

  it("vehicles link should point to /vehicles", () => {
    checkLink("/vehicles", "Vehicles");
  });

  it("planets link should point to /vehicles", () => {
    checkLink("/planets", "Planets");
  });
});
