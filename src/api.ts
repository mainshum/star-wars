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
  parser: (d: unknown) => z.infer<T>
): UseQueryResult<z.infer<T>> => {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      getFromSwapi(swapiUrl)
        .then(parser)
        .then(
          tap((res) =>
            res.results.map((obj: z.infer<T>) =>
              client.setQueryData([elementKey, obj.id], obj)
            )
          )
        ),
  });

  if (query.error) throw query.error;

  return query;
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

  if (query.error) throw query.error;

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

const parseListInTwoPasses = <T extends z.ZodSchema>(
  secondPassParser: T,
  apiData: unknown
) => {
  // we need to append id (corresponding to index) to each piece in the list
  const parsed = z.object({ results: z.array(z.any()) }).parse(apiData);

  parsed.results.forEach((res, id) => {
    res.id = (id + 1).toString();
  });

  return z.object({ results: z.array(secondPassParser) }).parse(parsed);
};

const PlanetSchemaList = z.object({ results: z.array(PlanetSchema) });
const VehiclesSchemaList = z.object({ results: z.array(VehicleSchema) });
const CharactersSchemaList = z.object({ results: z.array(CharacterSchema) });

export const API = {
  // lists
  getPlanetsList: () => {
    return getList<typeof PlanetSchemaList>(
      [cacheKeys.planets],
      cacheKeys.planet,
      "/planets",
      (res) => {
        return parseListInTwoPasses(PlanetSchema, res);
      }
    );
  },
  getPeopleList: () => {
    return getList<typeof CharactersSchemaList>(
      [cacheKeys.people],
      cacheKeys.person,
      "/people",
      (res) => {
        return parseListInTwoPasses(CharacterSchema, res);
      }
    );
  },
  getVehiclesList: () => {
    return getList<typeof VehiclesSchemaList>(
      [cacheKeys.vehicles],
      cacheKeys.vehicle,
      "/vehicles",
      (res) => {
        return parseListInTwoPasses(VehicleSchema, res);
      }
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
