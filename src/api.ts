import {
  QueriesOptions,
  QueryClient,
  UseQueryResult,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";
import { getFromSwapi, tap } from "./utils";

const PlanetSchema = z.object({
  name: z.string(),
  residents: z.array(z.string()),
  population: z.string(),
  climate: z.string(),
  terrain: z.string(),
});

const CharacterSchema = z.object({
  name: z.string(),
  homeworld: z.string(),
  hair_color: z.string(),
  vehicles: z.array(z.string()),
  gender: z.string(),
});

const makeResultsSchema = <T extends z.ZodRawShape>(obj: z.ZodObject<T>) =>
  z.object({
    results: z.array(obj),
  });

type ObjectType<T> = T extends string
  ? string
  : T extends string[]
  ? string[]
  : never;

function isString(x: any): x is string {
  return true;
}

function getPlanet(id: string | string[]): string | string[] {
  if (isString(id)) return "";

  return [];
}

export const API = {
  getPlanetsList: () => {
    const client = useQueryClient();

    return useQueries({
      queries: [
        {
          queryKey: ["planets"],
          queryFn: () =>
            getFromSwapi("/planets")
              .then(makeResultsSchema(PlanetSchema).parse)
              .then(
                tap((res) =>
                  res.results.map((planet, ind) =>
                    client.setQueryData(["planet", ind], planet)
                  )
                )
              ),
        },
      ],
    });
  },
  getPlanet: (id: string) => {
    return useQuery({
      queryKey: ["planet", id],
      queryFn: () => getFromSwapi(`/planets/${id}`).then(PlanetSchema.parse),
      staleTime: 1000000000,
    });
  },
  getPlanets: (ids: string[]) => {
    const client = useQueryClient();

    return useQueries({
      queries: ids.map((id) => ({
        queryKey: ["planet", id],
        queryFn: () =>
          getFromSwapi(`/planets/${id}`)
            .then(PlanetSchema.parse)
            .then(
              tap((res) => {
                client.setQueryData(["planet", id], res);
              })
            ),
      })),
    });
  },
  getResidents: (ids: string[]) => {
    const client = useQueryClient();

    return useQueries({
      queries: ids.map((id) => ({
        queryKey: ["people", id],
        queryFn: () =>
          getFromSwapi(`/people/${id}`)
            .then(CharacterSchema.parse)
            .then((res) => ({ ...res, id }))
            .then(
              tap((x) => {
                client.setQueryData(["people", id], x);
              })
            ),
      })),
    });
  },
};
