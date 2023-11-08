import { imageRotator, isSome } from "../utils";
import { Polygon, LightSabre } from "@/src/components/design-system";
import { Router } from "../router";
import React, { useMemo } from "react";
import { API } from "../api";
import { Link } from "../components/link";

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

type DetailsProps = {
  id: string;
};

interface DescriptorProps extends React.HTMLAttributes<HTMLDivElement> {
  header: string;
}

const Spacer = () => <div className="w-[2px] bg-yellow-300 py-4" />;

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
      <div className="flex flex-col font-light text-sm gap-1">
        {children ? children : <span>Dupa</span>}
      </div>
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

const useImage = (gen: Generator<string, void>, id: string) =>
  useMemo(() => {
    return gen.next().value!;
  }, [id]);

const Planet = ({ id: pid }: DetailsProps) => {
  const imgSrc = useImage(planetGen, pid);

  const planet = API.getPlanet(pid);

  const planetReturned = planet.data;
  const peopleIds = planet.data?.peopleIds;

  const people = API.getPeople(peopleIds || []);

  return (
    <div className="flex flex-col gap-8">
      <Tile>
        <TileContent header={planet.data?.name} imageSrc={imgSrc} />
      </Tile>
      <section className="px-2 flex gap-8">
        <Descriptor header="Residents">
          {planetReturned && !people.pending && people.data.length === 0 && (
            <span>Nobody</span>
          )}
          {people.data.filter(isSome).map(({ name, id }) => (
            <Link key={id} to={Router.Character({ id })}>
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

  const vehicle = API.getVehicle(vid);

  const peopleIds = vehicle.data?.peopleIds;

  const vehicleReturned = vehicle.data;

  const pilots = API.getPeople(peopleIds || []);

  return (
    <div className="flex flex-col gap-8">
      <Tile>
        <TileContent header={vehicle.data?.name} imageSrc={imgSrc} />
      </Tile>
      <section className="px-2 flex gap-8">
        <Descriptor header="Used by">
          {vehicleReturned && !pilots.pending && pilots.data.length === 0 && (
            <span>Nobody</span>
          )}
          {pilots.data.filter(isSome).map(({ name, id }) => (
            <Link key={id} to={Router.Character({ id })}>
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

const Character = ({ id: charId }: DetailsProps) => {
  const imgSrc = useImage(charGen, charId);

  const person = API.getPerson(charId);

  const planet = API.getPlanet(person.data?.planetId || null);

  const personReturned = person.data;

  const vehicles = API.getVehicles(person.data?.vehicleIds || []);

  return (
    <div className="flex flex-col gap-8">
      <Tile>
        <TileContent header={person.data?.name!} imageSrc={imgSrc} />
      </Tile>
      <section className="px-2 flex gap-8">
        <Descriptor header="Vehicles">
          {personReturned &&
            !vehicles.pending &&
            vehicles.data.length === 0 && <span>No vehicles</span>}
          {vehicles.data.filter(isSome).map(({ name, id }) => (
            <Link key={id} to={Router.Vehicle({ id: id })}>
              <span>{name}</span>
            </Link>
          ))}
        </Descriptor>
        <Spacer />
        <Descriptor header="Gender">
          <span>{person.data?.gender}</span>
        </Descriptor>
        <Spacer />
        <Descriptor header="Name">
          <span>{person.data?.name}</span>
        </Descriptor>
        <Spacer />
        <Descriptor header="Homeworld">
          {planet.data && (
            <Link to={Router.Planet({ id: planet.data.id })}>
              <span>{planet.data.name}</span>
            </Link>
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
