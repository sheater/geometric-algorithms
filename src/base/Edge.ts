import { crossProduct } from "./utils";
import Point from "./Point";
import Vector from "./Vector";

export default class Edge {
  constructor(public from: Point, public to: Point) {}

  getCenter(): Vector {
    return this.to.pos
      .sub(this.from.pos)
      .mul(0.5)
      .add(this.from.pos);
  }

  swapEdge(): Edge {
    return new Edge(this.to, this.from);
  }

  isSameEdge = (e: Edge) => {
    return e.from === this.from && e.to === this.to;
  };

  isOppositeEdge = (e: Edge): boolean => {
    return e.from === this.to && e.to === this.from;
  };

  isCorrespondingEdge = (e: Edge): boolean => {
    return this.isSameEdge(e) || this.isOppositeEdge(e);
  };

  hasPoint(p: Point): boolean {
    return this.from === p || this.to === p;
  }

  isPointOnTheLeft = (p: Point): boolean => {
    return crossProduct(this.from.pos, p.pos, this.to.pos) > 0;
  };

  isPointOnTheRight = (p: Point): boolean => {
    return crossProduct(this.from.pos, p.pos, this.to.pos) < 0;
  };

  getPointsOnTheLeft(input: Array<Point>): Array<Point> {
    return input.filter(this.isPointOnTheLeft);
  }

  getPointsOnTheRight(input: Array<Point>): Array<Point> {
    return input.filter(this.isPointOnTheRight);
  }
}
