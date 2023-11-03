describe("lists", () => {
  beforeEach(() => {});
  it("renders characters in alphabetical order", () => {
    cy.intercept("https://swapi.dev/api/people", { fixture: "people.json" });
    cy.visit("/");
  });
});
