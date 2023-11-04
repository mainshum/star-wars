import { sortAlpabetically } from "../utils";
import { useQuery } from "react-query";
import { z } from "zod";
import { ErrorBoundary } from "react-error-boundary";
import React from "react";
import { useLinkProps } from "@swan-io/chicane";

// we'd normally log it using an external service
const logError = console.error;

const ListErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary
    onError={logError}
    fallback={<div data-testid="error">Unexpected error occurred</div>}
  >
    {children}
  </ErrorBoundary>
);

const Loader = () => <div data-testid="loader">Loader</div>;

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

const getJsonList = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) throw Error();

  return await res.json();
};

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

  if (error) throw new Error(`error calling ${url}`);

  if (isLoading) return <Loader />;

  return <>{children(data)}</>;
}

const CharacterLink = ({ name, to }: { name: string; to: string }) => {
  const { onClick } = useLinkProps({ href: to });
  return (
    <a href={to} onClick={onClick}>
      <li className="star-list__item" key={name}>
        <img alt={name} src="/character.jpeg" width={300} height={300} />
        <section className="star-list__info">
          <div className="star-list__sabre" />
          <span className="star-list__itemText">{name}</span>
        </section>
      </li>
    </a>
  );
};

const Characters = ({
  data,
}: {
  data: z.infer<typeof CharactersListSchema>;
}) => (
  <ul className="star-list">
    {sortAlpabetically(data.results, (d) => d.name).map((res) => (
      <CharacterLink key={res.name} name={res.name} to={"/"} />
    ))}
  </ul>
);

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
    <ListErrorBoundary>
      <ListWrapper
        schema={CharactersListSchema}
        url="https://swapi.dev/api/people"
      >
        {(data) => <Characters data={data} />}
      </ListWrapper>
    </ListErrorBoundary>
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
