import { imageRotator, pipe, sortAlpabetically } from "../utils";
import { z } from "zod";
import { Tile, StarList } from "./layout";
import { Router } from "../router";
import { JSONDataProvider } from "./data-provider";
import React from "react";

const pickName = <T extends { name: string }>(t: T) => t.name;

const ListResultsSchema = z.object({
  results: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

// ids that are used to identify objects are their indices in the array +1
const addHrefProperty = <T extends Record<string, any>>(
  obj: T,
  href: string
) => ({ ...obj, href });

const Galery = <T extends { name: string; href: string }>({
  elements,
  imgNo,
  imgPrefix,
}: {
  elements: T[] | undefined;
  imgPrefix: string;
  imgNo: number;
}) => {
  const rotate = imageRotator(imgPrefix, imgNo);
  return (
    <StarList>
      {elements?.map((d) => (
        <Tile.RootLi key={d.name}>
          <a href={d.href}>
            <Tile.ImgSmall src={rotate.next().value!} />
            <Tile.Sabre />
            <Tile.TileText>{d.name}</Tile.TileText>
          </a>
        </Tile.RootLi>
      ))}
    </StarList>
  );
};

export const List = {
  Characters: () => (
    <JSONDataProvider
      schema={ListResultsSchema}
      url="/people"
      queryKey={["people"]}
      selectResults={(res) =>
        pipe(
          res.results,
          (xs) =>
            xs.map((x, ind) =>
              addHrefProperty(x, Router.Character({ id: (ind + 1).toString() }))
            ),
          (xs) => sortAlpabetically(xs, pickName)
        )
      }
    >
      {(data) => <Galery elements={data} imgNo={5} imgPrefix="/images/char" />}
    </JSONDataProvider>
  ),
  Planets: () => (
    <JSONDataProvider
      schema={ListResultsSchema}
      url="/planets"
      queryKey={["planets"]}
      selectResults={(res) =>
        pipe(
          res.results,
          (xs) =>
            xs.map((x, ind) =>
              addHrefProperty(x, Router.Planet({ id: (ind + 1).toString() }))
            ),
          (xs) => sortAlpabetically(xs, pickName)
        )
      }
    >
      {(data) => (
        <StarList>
          {data?.map((d) => (
            <Tile.RootLi>
              <Tile.ImgSmall src="/aeos.jpeg" />
              <Tile.Sabre />
              <Tile.TileText>{d.name}</Tile.TileText>
            </Tile.RootLi>
          ))}
        </StarList>
      )}
    </JSONDataProvider>
  ),
  Vehicles: () => (
    <JSONDataProvider
      schema={ListResultsSchema}
      url="/vehicles"
      queryKey={["vehicles"]}
      selectResults={(res) =>
        pipe(
          res.results,
          (xs) =>
            xs.map((x, ind) =>
              addHrefProperty(x, Router.Vehicle({ id: (ind + 1).toString() }))
            ),
          (xs) => sortAlpabetically(xs, pickName)
        )
      }
    >
      {(data) => (
        <StarList>
          {data?.map((d) => (
            <Tile.RootLi>
              <Tile.ImgSmall src="/fighter.jpeg" />
              <Tile.Sabre />
              <Tile.TileText>{d.name}</Tile.TileText>
            </Tile.RootLi>
          ))}
        </StarList>
      )}
    </JSONDataProvider>
  ),
};
