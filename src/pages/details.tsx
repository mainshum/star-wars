import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getFromSwapi,
  getGenericJson,
  imageRotator,
  isSome,
  matchDigits,
  pipe,
} from "../utils";
import { z } from "zod";
import { Polygon, LightSabre } from "@/src/components/design-system";
import { Router } from "../router";
import React, { useMemo } from "react";
import { useLinkProps } from "@swan-io/chicane";
import { API } from "../api";

const HomeworldSchema = z.object({
  name: z.string(),
  residents: z.array(z.string()),
  population: z.string(),
  climate: z.string(),
  terrain: z.string(),
});

const charGen = imageRotator("/images/char", 5);
const planetGen = imageRotator("/images/ps", 6);
const vehicleGen = imageRotator("/images/vhs", 3);

const detailTxt = `
Former Jedi Knight Ahsoka Tano once served as the Padawan learner to the Jedi
Anakin Skywalker during the Clone Wars. A respected leader and warrior attuned
to the light side of the Force, Ahsoka grew into a formidable fighter before the
Empire’s reign changed the course of galactic history. Although she walked away
from the Jedi Order, she continued to stand up for those fighting for peace and
justice in the galaxy long after the fall of the Republic.  `;

const VehicleSchema = z.object({
  name: z.string(),
  model: z.string(),
  pilots: z.array(z.string()),
});

type DetailsProps = {
  id: string;
};

const Spacer = () => <div className="w-[2px] bg-yellow-300 py-4" />;

const useImage = (gen: Generator<string, void>, id: string) =>
  useMemo(() => {
    return gen.next().value!;
  }, [id]);

const Link = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { onClick } = useLinkProps({ href: to });

  return <a onClick={onClick}>{children}</a>;
};

const Planet = ({ id: pid }: DetailsProps) => {
  const imgSrc = useImage(planetGen, pid);

  const planet = API.getPlanet(pid);

  const planetIds = planet.data?.residents.map(matchDigits).filter(isSome);

  const residents = API.getResidents(planetIds || []).map((d) => d.data);

  return (
    <div className="flex flex-col gap-8">
      <Tile>
        <TileContent header={planet.data?.name} imageSrc={imgSrc} />
      </Tile>
      <section className="px-2 flex gap-8">
        <Descriptor header="Residents">
          {residents.filter(isSome).map(({ name, id }) => (
            <Link key={name} to={Router.Character({ id })}>
              <span>{name}</span>
            </Link>
          ))}
        </Descriptor>
        <Spacer />
        <Descriptor header="Name">
          <span>{planet.data?.name}</span>
        </Descriptor>
        <Spacer />
        <Descriptor header="Population">
          <span>{planet.data?.population}</span>
        </Descriptor>
        <Spacer />
      </section>
    </div>
  );
};

const Vehicle = ({ id: vid }: DetailsProps) => {
  const imgSrc = useImage(vehicleGen, vid);
  const vehicle = useQuery({
    queryFn: () => getFromSwapi(`/vehicles/${vid}`).then(VehicleSchema.parse),
    queryKey: ["vehicle", vid],
  });

  const pilots = useQueriesAndParseIds(
    "people",
    vehicle.data?.pilots || [],
    CharacterSchema
  );

  return (
    <div className="flex flex-col gap-8">
      <Tile>
        <TileContent header={vehicle.data?.name} imageSrc={imgSrc} />
      </Tile>
      <section className="px-2 flex gap-8">
        <Descriptor header="Used by">
          {pilots
            .map((d) => d.data)
            .filter(isSome)
            .map(({ name, id }) => (
              <Link to={Router.Character({ id })}>
                <span>{name}</span>
              </Link>
            ))}
        </Descriptor>
        <Spacer />
        <Descriptor header="Name">
          <span>{vehicle.data?.name}</span>
        </Descriptor>
        <Spacer />
        <Descriptor header="Type">
          <span>{vehicle.data?.model}</span>
        </Descriptor>
        <Spacer />
      </section>
    </div>
  );
};

interface DescriptorProps extends React.HTMLAttributes<HTMLDivElement> {
  header: string;
}

const Tile = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded relative flex h-[310px] overflow-hidden bg-tile-root">
    {children}
    <Polygon height={12} width={128} right={8} />
  </div>
);

const Descriptor = React.forwardRef<HTMLDivElement, DescriptorProps>(
  ({ children, header }, ref) => (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="text-xl">{header}</div>
      <div className="flex flex-col font-light text-sm gap-1">{children}</div>
    </div>
  )
);

const TileContent = ({
  header,
  imageSrc,
}: {
  imageSrc: string;
  header: string | undefined;
}) => (
  <>
    <img
      width={500}
      height={310}
      className="w-[500px] h-[310px]"
      src={imageSrc}
      alt="character-details"
    />
    <div className="flex flex-col p-9 gap-4">
      <div className="flex flex-col gap-2">
        <LightSabre />
        {header && <h1 className="font-bold">{header}</h1>}
        <span className="text-sm">{detailTxt}</span>
      </div>
    </div>
  </>
);

const useQueriesAndParseIds = <T extends z.ZodSchema>(
  queryKey: string,
  urls: string[],
  objectSchema: T
) =>
  useQueries({
    queries: pipe(
      urls.reduce((acc, url) => {
        const id = matchDigits(url);
        return !id ? acc : acc.concat({ id, url });
      }, [] as { id: string; url: string }[]),
      (vhs) =>
        vhs.map(({ url, id }) => ({
          queryKey: [queryKey, id],
          queryFn: () =>
            getGenericJson(url)
              .then(objectSchema.parse)
              .then((parsed) => ({ ...parsed, id })),
        }))
    ),
  });

const Character = ({ id: charId }: DetailsProps) => {
  const imgSrc = useImage(charGen, charId);

  const character = useQuery({
    queryFn: () =>
      getFromSwapi(`/people/${charId}`).then(CharacterSchema.parse),
    queryKey: ["people", charId],
  });

  const homeworldUrl = character.data?.homeworld;
  const vehicleUrls = character.data?.vehicles;

  // it will only run when homeworldUrl defined
  const homeworld = useQuery({
    queryFn: () => {
      // we would log these errors
      if (!homeworldUrl) return Promise.reject();

      const id = matchDigits(homeworldUrl);

      if (!id) return Promise.reject();

      return getGenericJson(homeworldUrl)
        .then(HomeworldSchema.parse)
        .then((json) => ({ ...json, id }));
    },
    queryKey: ["homeworld", homeworldUrl],
    enabled: !!homeworldUrl,
  });

  const vehicles = useQueriesAndParseIds(
    "vehicle",
    vehicleUrls || [],
    VehicleSchema
  );

  return (
    <div className="flex flex-col gap-8">
      <Tile>
        <TileContent header={character.data?.name!} imageSrc={imgSrc} />
      </Tile>
      <section className="px-2 flex gap-8">
        <Descriptor header="Vehicles">
          {vehicles
            .map((d) => d.data)
            .filter(isSome)
            .map(({ name, id }) => (
              <Link key={id} to={Router.Vehicle({ id: id })}>
                <span>{name}</span>
              </Link>
            ))}
        </Descriptor>
        <Spacer />
        <Descriptor header="Gender">
          <span>{character.data?.gender}</span>
        </Descriptor>
        <Spacer />
        <Descriptor header="Name">
          <span>{character.data?.name}</span>
        </Descriptor>
        <Spacer />
        <Descriptor header="Homeworld">
          {homeworld.data && (
            <a href={Router.Planet({ id: homeworld.data?.id })}>
              <span>{homeworld.data?.name}</span>
            </a>
          )}
        </Descriptor>
      </section>
    </div>
  );
};

export const Details = {
  Character,
  Vehicle,
  Planet,
};
