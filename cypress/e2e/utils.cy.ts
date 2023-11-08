import {
  API,
  CharacterSchema,
  PlanetSchema,
  VehicleSchema,
} from "../..//src/api";
import Tat from "../fixtures/tatooine.json";
import Luke from "../fixtures/luke.json";
import SS from "../fixtures/snowspeeder.json";
import { imageRotator, sortAlpabetically } from "../../src/utils";
import { HTTP } from "../utils";

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

describe("api", () => {
  it("PlanetSchema should parsed resident urls into ids", () => {
    const parsed = PlanetSchema.parse({ ...Tat, id: "1" });

    expect(parsed.peopleIds.length).to.eq(10);
    expect(parsed.peopleIds[0]).to.eq("1");
    expect(parsed.peopleIds[parsed.peopleIds.length - 1]).to.eq("62");
  });

  it("Vehicle should parsed resident urls into ids", () => {
    const parsed = VehicleSchema.parse({ ...SS, id: "1" });

    expect(parsed.peopleIds.length).to.eq(2);
    expect(parsed.peopleIds[0]).to.eq("1");
    expect(parsed.peopleIds[parsed.peopleIds.length - 1]).to.eq("18");
  });

  it("Character homeworld id should be parsed", () => {
    const parsed = CharacterSchema.parse({ ...Luke, id: "1" });

    expect(parsed.planetId).to.eq("1");
  });
});
