import { sortAlpabetically } from "../utils";
import { useQuery } from "react-query";
import { z } from "zod";

function Error() {
  return <div>Error</div>;
}

function Loader() {
  return <div>Loader</div>;
}

const CharactersListSchema = z.object({
  results: z.array(
    z.object({
      name: z.string(),
    })
  ),
});
const PlanetsListSchema = z.object({
  results: z.array(
    z.object({
      name: z.string(),
      rotation_period: z.string(),
    })
  ),
});

const getJsonList = async (url: string) => fetch(url).then((res) => res.json());

function ListWrapper<T extends z.ZodSchema>({
  schema,
  url,
  children,
}: {
  schema: T;
  url: string;
  children: (data: z.infer<T>) => React.ReactNode;
}) {
  const { data, error, isLoading } = useQuery({
    queryFn: () => getJsonList(url).then(schema.parse),
    queryKey: [url],
  });

  console.log(data);

  if (error) return <Error />;
  if (isLoading) return <Loader />;

  return <>{children(data)}</>;
}

function Characters({ data }: { data: z.infer<typeof CharactersListSchema> }) {
  const sorted = sortAlpabetically(data.results, (d) => d.name);

  return (
    <ul>
      {sorted.map((res) => (
        <li key={res.name}>{res.name}</li>
      ))}
    </ul>
  );
}

function Planets({ data }: { data: z.infer<typeof PlanetsListSchema> }) {
  return (
    <ul>
      {data.results.map((res) => (
        <li key={res.name}>
          {res.name}: {res.rotation_period}
        </li>
      ))}
    </ul>
  );
}

export const List = {
  Characters: () => (
    <ListWrapper
      schema={CharactersListSchema}
      url="https://swapi.dev/api/people"
    >
      {(data) => <Characters data={data} />}
    </ListWrapper>
  ),
  Planets: () => (
    <ListWrapper schema={PlanetsListSchema} url="https://swapi.dev/api/planets">
      {(data) => <Planets data={data} />}
    </ListWrapper>
  ),
  Vehicles: () => (
    <ListWrapper
      schema={PlanetsListSchema}
      url="https://swapi.dev/api/vehicles"
    >
      {(data) => <Planets data={data} />}
    </ListWrapper>
  ),
};
