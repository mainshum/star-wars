export function sortAlpabetically<T, X extends string>(
  xs: T[],
  sortBy: (t: T) => X
) {
  return xs.slice().sort((a, b) => sortBy(a).localeCompare(sortBy(b)));
}
