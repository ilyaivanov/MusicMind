interface ClassNames {
  [key: string]: boolean | undefined | null;
}
export const cn = (names: ClassNames): string =>
  Object.keys(names)
    .filter((name) => names[name])
    .join(" ");

export interface Vector2 {
  x: number;
  y: number;
}

export const vector = (x: number, y: number): Vector2 => ({ x, y });

export const add = (v1: Vector2, v2: Vector2): Vector2 => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

export const difference = (v1: Vector2, v2: Vector2): Vector2 => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
});

export const multiply = (v1: Vector2, val: number): Vector2 => ({
  x: v1.x * val,
  y: v1.y * val,
});

export const divide = (v1: Vector2, val: number): Vector2 => ({
  x: v1.x / val,
  y: v1.y / val,
});