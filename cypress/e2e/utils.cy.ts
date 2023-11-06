import { sortAlpabetically } from "../../src/utils";

describe("sortAlphabetically", () => {
  it("should put objects in array in asc order by name, not mutating original", () => {
    const objs = [{ x: "b" }, { x: "c" }, { x: "a" }];

    const sorted = sortAlpabetically(objs, (x) => x.x);

    expect(sorted[0].x).to.eq("a");
    expect(sorted[1].x).to.eq("b");
    expect(sorted[2].x).to.eq("c");

    expect(objs[0].x).to.eq("b");
  });
});
