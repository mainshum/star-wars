import { useQuery, useQueries } from "react-query";
import { getFromSwapi, getGenericJson } from "../utils";
import { z } from "zod";
import { Tile } from "./tile";

const CharacterSchema = z.object({
  name: z.string(),
  homeworld: z.string(),
  vehicles: z.array(z.string()),
  // assuming gender = race :)
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

const Character = ({ id }: { id: string }) => {
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
    <section className="center-flex">
      <h1>Character details</h1>
      {!character.data ? (
        <Tile.Skeleton />
      ) : (
        <Tile.DetailSection>
          <Tile.DetailItem title="Name" value={character.data.name} />
          <Tile.DetailItem title="Gender" value={character.data.gender} />
        </Tile.DetailSection>
      )}
      <Tile.DetailSection>
        {vehicles.map(({ data }, ind) =>
          !data ? (
            <Tile.Skeleton key={ind} />
          ) : (
            <Tile.DetailItem title="Name" value={data.name} />
          )
        )}
      </Tile.DetailSection>
      <div className="details-tile__details"></div>
    </section>
  );
};
