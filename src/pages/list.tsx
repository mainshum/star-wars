import { imageRotator, sortAlpabetically } from "../utils";
import { Tile, StarList } from "../components/layout";
import { useMemo } from "react";
import { API } from "../api";
import { Link } from "../components/link";

type ListElem = { id: string; name: string; src: string; linkTo: string };

const ListTile = ({ elem }: { elem?: ListElem }) => {
  return (
    <Tile.RootLi>
      {elem ? (
        <>
          <Tile.ImgSmall alt={elem.name} src={elem.src} />
          <Tile.LightSabre />
          <Tile.TileText>{elem.name}</Tile.TileText>
        </>
      ) : (
        <Tile.Skeleton />
      )}
    </Tile.RootLi>
  );
};

const Galery = ({ data }: { data: ListElem[] | "loading" }) => (
  <StarList>
    {data === "loading" ? (
      <>
        {Array10.map((_, ind) => (
          <ListTile key={ind} />
        ))}
      </>
    ) : (
      <>
        {data.map((d, ind) => (
          <Link key={ind} to={d.linkTo}>
            <ListTile elem={d} />
          </Link>
        ))}
      </>
    )}
  </StarList>
);

const Array10 = Array(10).fill(null);

const charsRotator = imageRotator("/images/char", 5);
const vhsRotator = imageRotator("/images/vhs", 4);
const psRotator = imageRotator("/images/ps", 7);

const Characters = () => {
  const res = API.getPeopleList();

  const data = useMemo(() => {
    if (res.isLoading) return "loading";

    return sortAlpabetically(res.data?.results || [], (d) => d.name).map(
      (d) => ({
        ...d,
        src: charsRotator.next().value!,
        linkTo: `/characters/${d.id}`,
      })
    );
  }, [res.data?.results]);

  return <Galery data={data} />;
};

const Planets = () => {
  const res = API.getPlanetsList();

  const data = useMemo(() => {
    if (res.isLoading) return "loading";

    return sortAlpabetically(res.data?.results || [], (d) => d.name).map(
      (d) => ({
        ...d,
        src: psRotator.next().value!,
        linkTo: `/planets/${d.id}`,
      })
    );
  }, [res.data?.results]);

  return <Galery data={data} />;
};

const Vehicles = () => {
  const res = API.getVehiclesList();

  const data = useMemo(() => {
    if (res.isLoading) return "loading";

    return sortAlpabetically(res.data?.results || [], (d) => d.name).map(
      (d) => ({
        ...d,
        src: vhsRotator.next().value!,
        linkTo: `/vehicles/${d.id}`,
      })
    );
  }, [res.data?.results]);

  return <Galery data={data} />;
};

export const List = {
  Characters,
  Planets,
  Vehicles,
};
