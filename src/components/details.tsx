import { useQuery, useQueries } from "react-query";
import { getFromSwapi, getGenericJson } from "../utils";
import { z } from "zod";
import { Tile } from "./layout";
import { Loader } from "./loader";

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

const DetailsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h1>{title}</h1>
    {children}
  </section>
);

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
    <div>
      <Tile.RootLi rootElem="section" className="details-tile">
        <Tile.ImgLarge src="/images/char-1.jpeg" />
        <div className="details-tile__list">
          <div className="details-tile__listelem">
            <Tile.TileText>Name</Tile.TileText>
            <Tile.TileText>{character.data?.name}</Tile.TileText>
          </div>
          <Tile.Divider />
          <div className="details-tile__listelem">
            <Tile.TileText>Gender</Tile.TileText>
            <Tile.TileText>{character.data?.gender}</Tile.TileText>
          </div>
          <Tile.Divider />
          <div className="details-tile__listelem">
            <Tile.TileText>Homeworld</Tile.TileText>
            <Tile.TileText>{homeworld.data?.name}</Tile.TileText>
          </div>
        </div>
      </Tile.RootLi>
      {/* <DetailsSection title="Basic information">
        <ul style={{ display: "flex", gap: "16px" }}>
          <Tile.RootLi>
            {!character.data?.name ? (
              <Loader />
            ) : (
              <>
                <Tile.Sabre />
                <Tile.TileText>Name:</Tile.TileText>
                <Tile.TileText>{character.data.name}</Tile.TileText>
              </>
            )}
          </Tile.RootLi>
          <Tile.RootLi>
            {!character.data?.gender ? (
              <Loader />
            ) : (
              <>
                <Tile.Sabre />
                <Tile.TileText>Gender:</Tile.TileText>
                <Tile.TileText>{character.data.gender}</Tile.TileText>
              </>
            )}
          </Tile.RootLi>
        </ul>
      </DetailsSection> */}
      {/* <DetailsSection title="Homeworld data">
        <ul style={{ display: "flex", gap: "16px" }}>
          <Tile.RootLi>
            {!homeworld.data ? (
              <Loader />
            ) : (
              <>
                <Tile.Sabre />
                <Tile.TileText>Name:</Tile.TileText>
                <Tile.TileText>{homeworld.data.name}</Tile.TileText>
              </>
            )}
          </Tile.RootLi>
          <Tile.RootLi>
            {!homeworld.data ? (
              <Loader />
            ) : (
              <>
                <Tile.Sabre />
                <Tile.TileText>Period:</Tile.TileText>
                <Tile.TileText>{homeworld.data.orbital_period}</Tile.TileText>
              </>
            )}
          </Tile.RootLi>
        </ul>
      </DetailsSection>
      <DetailsSection title="Vehicles">
        <ul style={{ display: "flex", gap: "16px" }}>
          {vehicles.map((v) => (
            <Tile.RootLi>
              {!v.data ? (
                <Loader />
              ) : (
                <>
                  <Tile.Sabre />
                  <Tile.TileText>{v.data.name}</Tile.TileText>
                </>
              )}
            </Tile.RootLi>
          ))}
        </ul>
      </DetailsSection> */}
    </div>
  );
};

export const Details = {
  Character,
};
