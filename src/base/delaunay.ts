import Point from "./Point";
import Edge from "./Edge";
import { crossProduct, getCircumcircleTriangleCenter } from "./utils";

function getDelaunayDistance(p1: Point, p2: Point, p: Point) {
  const center = getCircumcircleTriangleCenter(p1.pos, p2.pos, p.pos);

  const centerHalfPlane = crossProduct(p1.pos, center, p2.pos) > 0;
  const nextPointHalfPlane = crossProduct(p1.pos, p.pos, p2.pos) > 0;

  return (
    center.getDistanceTo(p.pos) *
    (centerHalfPlane === nextPointHalfPlane ? 1 : -1)
  );
}

function getNearestPoint(
  p1: Point,
  p2: Point,
  points: Array<Point>
): Point | null {
  const edge = new Edge(p1, p2);
  const left = edge.getPointsOnTheLeft(points);

  if (!left.length) {
    return null;
  }

  return left.reduce((acc, x) => {
    if (getDelaunayDistance(p1, p2, x) < getDelaunayDistance(p1, p2, acc)) {
      return x;
    }

    return acc;
  }, left[0]);
}

export function triangulate(points: Array<Point>): Array<Edge> {
  if (points.length < 3) {
    return [];
  }

  const p1 = points.reduce((acc, p) => {
    if (p.pos.x <= acc.pos.x) {
      return p;
    }
    return acc;
  }, points[0]);

  const p2 = points.reduce((acc, p) => {
    if (p === p1) {
      return acc;
    }

    if (!acc) {
      return p;
    }

    if (acc.pos.getDistanceToSq(p1.pos) > p.pos.getDistanceToSq(p1.pos)) {
      return p;
    }

    return acc;
  }, null);

  const dt: Array<Edge> = [];
  const ael: Array<Edge> = [];
  let nearest = getNearestPoint(p1, p2, points);

  if (nearest) {
    ael.push(new Edge(p1, p2), new Edge(p2, nearest), new Edge(nearest, p1));
  } else {
    nearest = getNearestPoint(p2, p1, points);

    ael.push(new Edge(p2, p1), new Edge(p1, nearest), new Edge(nearest, p1));
  }

  while (ael.length) {
    const currentEdge = ael.pop().swapEdge();

    const point = getNearestPoint(currentEdge.from, currentEdge.to, points);

    if (point) {
      const newEdges = [
        new Edge(currentEdge.to, point),
        new Edge(point, currentEdge.from)
      ];

      ael.push(
        ...newEdges.filter(e => {
          const isAlreadyInAel = ael.some(x => x.isCorrespondingEdge(e));
          const isAlreadyInDt = dt.some(x => x.isCorrespondingEdge(e));

          return !isAlreadyInAel && !isAlreadyInDt;
        })
      );
    }

    dt.push(currentEdge);
  }

  return dt;
}
