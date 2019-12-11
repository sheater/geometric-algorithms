import Scene from "./base/Scene";
import Vector from "./base/Vector";
import Line from "./base/Line";
import Point from "./base/Point";

function crossProduct(a: Vector, b: Vector, c: Vector) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function getPolarAngle(p: Vector, a: Vector) {
  const dx = a.x - p.x;
  const dy = a.y - p.y;

  return Math.atan2(dy, dx);
}

export default class GrahamScan extends Scene {
  render() {
    this.calculateHull();
    super.render();
  }

  calculateHull() {
    this.clearLines();
    const points = this.getPoints();

    if (points.length < 3) {
      return;
    }

    const pivot = points.reduce((acc, x) => {
      return x.pos.y > acc.pos.y ? x : acc;
    }, points[0]);

    const sortedPoints = points.slice().sort((a, b) => {
      return getPolarAngle(b.pos, pivot.pos) - getPolarAngle(a.pos, pivot.pos);
    });

    const stack: Array<Point> = [];

    console.log("pivotIndex", points.indexOf(pivot));
    console.log(
      "sorted",
      sortedPoints.map(x => points.indexOf(x))
    );

    for (const p of sortedPoints) {
      while (
        stack.length > 1 &&
        crossProduct(
          stack[stack.length - 2].pos,
          stack[stack.length - 1].pos,
          p.pos
        ) >= 0
      ) {
        stack.pop();
      }

      stack.push(p);
    }

    console.log(
      "stack",
      stack.map(x => points.indexOf(x))
    );

    for (let i = 0; i < stack.length; i++) {
      const a = stack[i].pos;
      const b = stack[(i + 1) % stack.length].pos;

      this.addLine(new Line(a, b));
    }
  }
}
