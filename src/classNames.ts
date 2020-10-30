interface ClassNames {
  [key: string]: boolean | undefined | null;
}
export const cn = (names: ClassNames): string =>
  Object.keys(names)
    .filter((name) => names[name])
    .join(" ");
