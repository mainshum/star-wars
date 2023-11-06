const API_ROOT = "https://swapi.dev/api";

export function sortAlpabetically<T, X extends string>(
  xs: T[],
  sortBy: (t: T) => X
) {
  return xs.slice().sort((a, b) => sortBy(a).localeCompare(sortBy(b)));
}

export function pipe<A>(value: A): A;
export function pipe<A, B>(value: A, fn1: (input: A) => B): B;
export function pipe<A, B, C>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C
): C;
export function pipe<A, B, C, D>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D
): D;
export function pipe<A, B, C, D, E>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E
): E;

export function pipe(value: any, ...fns: Function[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
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
