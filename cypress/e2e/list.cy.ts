import { sortAlpabetically } from "../../src/utils";

describe("/list/characters (happy)", () => {
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
