import { imageRotator, sortAlpabetically } from "../../src/utils";

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

describe("imageRotator", () => {
  it("should return 3 rotated prefixes", () => {
    const rotate = imageRotator("img", 3);

    expect(rotate.next().value).to.eq("img-0.jpeg");
    expect(rotate.next().value).to.eq("img-1.jpeg");
    expect(rotate.next().value).to.eq("img-2.jpeg");
    expect(rotate.next().value).to.eq("img-0.jpeg");
  });
});
