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

const ListResultsSchema = z.object({
  results: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

const getJsonList = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) throw Error();

  return await res.json();
};

const ListWrapper = <T extends z.ZodSchema, W>({
  schema,
  url,
  processList,
  renderItem,
}: {
  schema: T;
  url: string;
  processList: (res: z.infer<T>) => W[];
  renderItem: (data: W) => React.ReactNode;
}) => {
  const { data, error, isLoading } = useQuery({
    queryFn: () => getJsonList(url).then(schema.parse).then(processList),
    queryKey: [url],
  });

  // rethrow error synchronously
  if (error) throw new Error(`error calling ${url}`);

  if (isLoading) return <Loader />;

  return <ul className="star-list">{data?.map(renderItem)}</ul>;
};

const CharacterLink = ({
  name,
  to,
  img,
}: {
  name: string;
  to: string;
  img: string;
}) => {
  const { onClick } = useLinkProps({ href: to });
  return (
    <a href={to} onClick={onClick}>
      <li className="star-list__item" key={name}>
        <img alt={name} src={img} width={300} height={300} />
        <section className="star-list__info">
          <div className="star-list__sabre" />
          <span className="star-list__itemText">{name}</span>
        </section>
      </li>
    </a>
  );
};

const pickName = <T extends { name: string }>(t: T) => t.name;

// there is no difference in data rendering, but if we want it
// changes can be introduced here

export const List = {
  Characters: () => (
    <ListErrorBoundary>
      <ListWrapper
        schema={ListResultsSchema}
        url="https://swapi.dev/api/people"
        processList={(res) => sortAlpabetically(res.results, pickName)}
        renderItem={({ name }) => (
          <CharacterLink name={name} img={"/character.jpeg"} to="" />
        )}
      />
    </ListErrorBoundary>
  ),
  Planets: () => (
    <ListErrorBoundary>
      <ListWrapper
        schema={ListResultsSchema}
        url="https://swapi.dev/api/planets"
        processList={(res) => sortAlpabetically(res.results, pickName)}
        renderItem={({ name }) => (
          <CharacterLink name={name} img="/aeos.jpeg" to="" />
        )}
      />
    </ListErrorBoundary>
  ),
  Vehicles: () => (
    <ListErrorBoundary>
      <ListWrapper
        schema={ListResultsSchema}
        url="https://swapi.dev/api/vehicles"
        processList={(res) => sortAlpabetically(res.results, pickName)}
        renderItem={({ name }) => (
          <CharacterLink name={name} img="/fighter.jpeg" to="" />
        )}
      />
    </ListErrorBoundary>
  ),
};
