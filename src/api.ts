import {
  UseQueryResult,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";
import { getFromSwapi, isSome, matchDigits, tap } from "./utils";

export const PlanetSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    residents: z.array(z.string()),
    population: z.string(),
    climate: z.string(),
    terrain: z.string(),
  })
  .transform(({ residents, ...rest }) => ({
    ...rest,
    peopleIds: residents.map(matchDigits).filter(isSome),
  }));

export const VehicleSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    model: z.string(),
    pilots: z.array(z.string()),
  })
  .transform(({ pilots, ...rest }) => ({
    ...rest,
    peopleIds: pilots.map(matchDigits).filter(isSome),
  }));

export const CharacterSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    homeworld: z.string(),
    hair_color: z.string(),
    vehicles: z.array(z.string()),
    gender: z.string(),
  })
  .transform(({ homeworld, vehicles, ...rest }) => ({
    planetId: matchDigits(homeworld),
    vehicleIds: vehicles.map(matchDigits).filter(isSome),
    ...rest,
  }));

const cacheKeys = {
  people: "people",
  person: "person",
  planet: "planet",
  planets: "planets",
  vehicles: "vehicles",
  vehicle: "vehicle",
};

const getList = <T extends z.ZodSchema>(
  queryKey: string[],
  elementKey: string,
  swapiUrl: string,
  parser: T
): UseQueryResult<T> => {
  const client = useQueryClient();

  return useQuery({
    queryKey: queryKey,
    queryFn: () =>
      getFromSwapi(swapiUrl)
        .then(parser.parse)
        .then(
          tap((res) =>
            res.results.map((obj: any, ind: number) =>
              client.setQueryData([elementKey, ind], obj)
            )
          )
        ),
  });
};

const getObj = <T extends z.ZodSchema>(
  id: string | null,
  cacheKey: keyof typeof cacheKeys,
  urlWithoutId: string,
  schema: T
): UseQueryResult<z.infer<T>> => {
  const query = useQuery({
    queryKey: [cacheKeys[cacheKey], id],
    enabled: !!id,
    queryFn: () =>
      getFromSwapi(`${urlWithoutId}/${id}`).then((json) =>
        schema.parse({ ...json, id })
      ),
  });

  if (query.error) throw new Error("Request error");

  return query;
};

// we ignore any requests that errored out in here
const combine = <T>(results: UseQueryResult<T>[]) => {
  return {
    data: results.map((result) => result.data),
    pending: results.some((result) => result.isPending),
  };
};

const getObjs = <T extends z.ZodSchema>(
  ids: string[],
  cacheKey: keyof typeof cacheKeys,
  urlWithoutId: string,
  schema: T
): { pending: boolean; data: z.infer<T>[] } => {
  const client = useQueryClient();

  return useQueries({
    combine: combine,
    queries: ids.map((id) => ({
      queryKey: [cacheKeys[cacheKey], id],
      queryFn: () =>
        getFromSwapi(`${urlWithoutId}/${id}`)
          .then((json) => schema.parse({ ...json, id }))
          .then(
            tap((res) => {
              client.setQueryData([cacheKeys[cacheKey], id], res);
            })
          ),
    })),
  });
};

export const API = {
  // lists
  getPlanetsList: () => {
    return getList(
      [cacheKeys.planets],
      cacheKeys.planet,
      "/planets",
      z.object({ results: z.array(PlanetSchema) })
    );
  },
  getResidentsList: () => {
    return getList(
      [cacheKeys.people],
      cacheKeys.person,
      "/people",
      z.object({ results: z.array(CharacterSchema) })
    );
  },
  getVehiclesList: () => {
    return getList(
      [cacheKeys.vehicles],
      cacheKeys.vehicle,
      "/vehicles",
      z.object({ results: z.array(CharacterSchema) })
    );
  },
  // details
  getPlanet: (id: string | null) => {
    return getObj(id, "planet", "/planets", PlanetSchema);
  },
  getVehicle: (id: string) => {
    return getObj(id, "vehicle", "/vehicles", VehicleSchema);
  },
  getPerson: (id: string) => {
    return getObj(id, "person", "/people", CharacterSchema);
  },
  getVehicles: (ids: string[]) => {
    return getObjs(ids, "vehicle", "/vehicles", VehicleSchema);
  },
  getPlanets: (ids: string[]) => {
    return getObjs(ids, "planet", "/planets", PlanetSchema);
  },
  getPeople: (ids: string[]) => {
    return getObjs(ids, "person", "/people", CharacterSchema);
  },
};
