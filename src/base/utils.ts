import Vector from "./Vector";

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

export function isInTriangle(p: Vector, a: Vector, b: Vector, c: Vector) {
  var v0 = [c.x - a.x, c.y - a.y];
  var v1 = [b.x - a.x, b.y - a.y];
  var v2 = [p.x - a.x, p.y - a.y];

  var dot00 = v0[0] * v0[0] + v0[1] * v0[1];
  var dot01 = v0[0] * v1[0] + v0[1] * v1[1];
  var dot02 = v0[0] * v2[0] + v0[1] * v2[1];
  var dot11 = v1[0] * v1[0] + v1[1] * v1[1];
  var dot12 = v1[0] * v2[0] + v1[1] * v2[1];

  var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

  var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return u >= 0 && v >= 0 && u + v < 1;
}
