export const API_ROOT = "https://swapi.dev/api";

export function sortAlpabetically<T, X extends string>(
  xs: T[],
  sortBy: (t: T) => X
) {
  return xs.slice().sort((a, b) => sortBy(a).localeCompare(sortBy(b)));
}

export const getGenericJson = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) throw Error();

  return await res.json();
};

export const getFromSwapi = async (relativeUrl: string) =>
  getGenericJson(`${API_ROOT}/${relativeUrl}`);

export function* imageRotator(prefix: string, imagesNo: number) {
  let ind = 0;
  while (true) {
    yield `${prefix}-${ind % imagesNo}.jpeg`;
    ind += 1;
  }
}

export function isSome<T>(x: T | undefined | null): x is T {
  return x != null;
}

export const matchDigits = (url: string) => /\d+/.exec(url)?.[0];

export const tap = <T>(fn: (t: T) => void) => {
  return (t: T) => {
    fn(t);
    return t;
  };
};
