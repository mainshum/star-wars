import { useQueries, useQuery } from "react-query";
import { getFromSwapi, getGenericJson, imageRotator } from "../utils";
import { z } from "zod";
import { Polygon, LightSabre } from "@/src/components/design-system";

type DetailsProps = { id: string };

const CharacterSchema = z.object({
  name: z.string(),
  homeworld: z.string(),
  hair_color: z.string(),
  vehicles: z.array(z.string()),
  gender: z.string(),
});

const HomeworldSchema = z.object({
  name: z.string(),
  rotation_period: z.number({ coerce: true }),
  orbital_period: z.number({ coerce: true }),
  climate: z.string(),
  terrain: z.string(),
});

const NameSchema = z.object({ name: z.string() });

const charGen = imageRotator("/images/char", 5);
const planetGen = imageRotator("/images/ps", 5);

const Tile = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded relative flex h-[310px] overflow-hidden bg-tile-root">
    {children}
    <Polygon height={12} width={128} right={8} />
  </div>
);

const detailTxt = `
Former Jedi Knight Ahsoka Tano once served as the Padawan learner to the Jedi Anakin Skywalker during the Clone Wars. A respected leader and warrior attuned to the light side of the Force, Ahsoka grew into a formidable fighter before the Empire’s reign changed the course of galactic history. Although she walked away from the Jedi Order, she continued to stand up for those fighting for peace and justice in the galaxy long after the fall of the Republic.
`;

const Character = ({ id }: DetailsProps) => {
  const character = useQuery({
    queryFn: () => getFromSwapi(`/people/${id}`).then(CharacterSchema.parse),
    queryKey: ["people", id],
  });
  const homeworldUrl = character.data?.homeworld;

  const vehicleUrls = character.data?.vehicles;

  // it will only run when homeworldUrl defined
  const homeworld = useQuery({
    queryFn: () => getGenericJson(homeworldUrl!).then(HomeworldSchema.parse),
    queryKey: ["homeworld", homeworldUrl],
    enabled: !!homeworldUrl,
  });

  const vehicles = useQueries(
    (vehicleUrls || []).map((v) => ({
      queryKey: ["vehicle", v],
      queryFn: () => getGenericJson(v).then(NameSchema.parse),
    }))
  );

  return (
    <div className="flex flex-col gap-8">
      <Tile>
        <img
          width={500}
          height={310}
          className="w-[500px] h-[310px]"
          src={charGen.next().value!}
          alt="character-details"
        />
        <div className="flex flex-col p-9 gap-4">
          <div className="flex flex-col gap-2">
            <LightSabre />
            <h1>{character.data?.name}</h1>
            <span className="text-sm">{detailTxt}</span>
          </div>
        </div>
      </Tile>
      <section className="px-2 flex gap-8">
        <Descriptor header="Vehicles">
          {vehicles.map(({ data }, ind) => (
            <a>
              <span key={ind}>{data?.name}</span>
            </a>
          ))}
          <span>{homeworld.data?.name}</span>
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
          <span>{homeworld.data?.name}</span>
        </Descriptor>
      </section>
    </div>
  );
};

const Spacer = () => <div className="w-[2px] bg-yellow-300 py-4" />;

const Descriptor = ({
  header,
  children,
}: {
  header: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <div className="text-xl">{header}</div>
    <div className="flex flex-col font-light text-sm gap-1">{children}</div>
  </div>
);

export const Details = {
  Character,
};
