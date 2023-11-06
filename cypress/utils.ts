import type {} from "cypress";
const useMock = (
  type: Parameters<typeof cy.intercept>[0],
  fixture: string | undefined = `${type}.json`
): void => {
  cy.intercept(`https://swapi.dev/api/${type}`, { fixture });
};

export const HTTP = {
  useMockVehicles: () => useMock("vehicles"),
  useMockCharacters: () => useMock("people"),
  useMockPlanets: () => useMock("planets"),

  useMockCharacter: () => useMock("people/*", "luke.json"),
  useMockVehicle: () => useMock("vehicles/*", "snowspeeder.json"),
  useMockPlanet: () => useMock("planets/*", "tatooine.json"),
};
