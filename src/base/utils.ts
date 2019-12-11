import Vector from "./Vector"

export function crossProduct(a: Vector, b: Vector, c: Vector) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

export function getCircumcircleTriangleRadius(
  a: Vector,
  b: Vector,
  c: Vector
): number {
  const la = b.sub(a).length();
  const lb = c.sub(b).length();
  const lc = a.sub(c).length();

  return (
    (la * lb * lc) /
    Math.sqrt((la + lb + lc) * (lb + lc - la) * (lc + la - lb) * (la + lb - lc))
  );
}

export function getCircumcircleTriangleCenter(
  a: Vector,
  b: Vector,
  c: Vector
): Vector {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  const A2 = a.x ** 2 + a.y ** 2;
  const B2 = b.x ** 2 + b.y ** 2;
  const C2 = c.x ** 2 + c.y ** 2;
  const x = (A2 * (b.y - c.y) + B2 * (c.y - a.y) + C2 * (a.y - b.y)) / d;
  const y = -(A2 * (b.x - c.x) + B2 * (c.x - a.x) + C2 * (a.x - b.x)) / d;

  return new Vector(x, y);
}
