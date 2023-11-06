import { pipe, sortAlpabetically } from "../utils";
import { z } from "zod";
import { Tile } from "./tile";
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

const StarList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>((props, ref) => <ul ref={ref} className="star-list" {...props} />);

// ids that are used to identify objects are their indices in the array +1
const addHrefProperty = <T extends Record<string, any>>(
  obj: T,
  href: string
) => ({ ...obj, href });

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
      {(data) => (
        <StarList>
          {data?.map((d) => (
            <a href={d.href}>
              <Tile.RootLi>
                <Tile.ImgSmall src="/character.jpeg" />
                <Tile.Sabre />
                <Tile.TileText>{d.name}</Tile.TileText>
              </Tile.RootLi>
            </a>
          ))}
        </StarList>
      )}
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
            <Tile.RootLi href={d.href}>
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
            <Tile.RootLi href={d.href}>
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
