const useMock = (type: "vehicles" | "planets" | "people"): void => {
  cy.intercept(`https://swapi.dev/api/${type}`, {
    fixture: `${type}.json`,
  });
};

export const HTTP = {
  useMockVehicles: () => useMock("vehicles"),
  useMockCharacters: () => useMock("people"),
  useMockPlanets: () => useMock("planets"),
};
