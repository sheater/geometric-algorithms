import Scene from "./base/Scene";
import Vector from "./base/Vector";
import Line from "./base/Line";
import Point from "./base/Point";
import { crossProduct } from "./base/utils";

function isVectorGreater(p: Vector, q: Vector) {
  return p.y > q.y ? true : p.y === q.y ? p.x < q.y : false;
}

function getTopOfStack<T>(s: Array<T>): T {
  return s[s.length - 1];
}

export default class SweepLine extends Scene {
  render() {
    this.triangulate();
    super.render();
  }

  triangulate(): void {
    this.clearLines();
    const points = this.getPoints();

    if (points.length < 3) {
      return;
    }

    const sortedPoints = points.slice().sort((p, q) => {
      const d = p.pos.y - q.pos.y;
      if (d === 0) {
        return q.pos.x - p.pos.x;
      }
      return d;
    });

    const topPoint = sortedPoints[0];
    const bottomPoint = sortedPoints[sortedPoints.length - 1];
    const remainingPoints = sortedPoints.slice(1, sortedPoints.length - 1);
    console.log("topPoint", points.indexOf(topPoint));
    console.log("bottomPoint", points.indexOf(bottomPoint));
    console.log(
      "remainingPoints",
      remainingPoints.map(x => points.indexOf(x))
    );

    const leftPoints = remainingPoints.filter(
      x => crossProduct(topPoint.pos, x.pos, bottomPoint.pos) < 0
    );
    const rightPoints = remainingPoints.filter(
      x => crossProduct(topPoint.pos, x.pos, bottomPoint.pos) >= 0
    );

    console.log(
      "leftPoints",
      leftPoints.map(x => points.indexOf(x))
    );
    console.log(
      "rightPoints",
      rightPoints.map(x => points.indexOf(x))
    );

    const lines: Array<Line> = [];
    const stack: Array<Point> = [sortedPoints[0], sortedPoints[1]];

    // add middle lines
    for (let i = 2; i < sortedPoints.length; i++) {
      const vi = sortedPoints[i];

      if (
        (leftPoints.includes(vi) &&
          leftPoints.includes(getTopOfStack(stack))) ||
        (rightPoints.includes(vi) && rightPoints.includes(getTopOfStack(stack)))
      ) {
        let last = null;
        for (let j = stack.length - 1; j >= 0; j--) {
          const vj = stack[j];

          if (last && crossProduct(vi.pos, last.pos, vj.pos) < 0) {
            console.log("break");
            break;
          }

          lines.push(new Line(vi.pos, vj.pos));

          last = vj;
        }
        // }

        stack.push(vi);
      } else {
        while (stack.length) {
          const vj = stack.pop();

          lines.push(new Line(vi.pos, vj.pos));
        }

        stack.push(vi);
      }
    }

    [topPoint, ...leftPoints, bottomPoint].forEach((x, i, a) => {
      if (i === a.length - 1) {
        return;
      }

      lines.push(new Line(x.pos, a[i + 1].pos));
    });

    [topPoint, ...rightPoints, bottomPoint].forEach((x, i, a) => {
      if (i === a.length - 1) {
        return;
      }

      lines.push(new Line(x.pos, a[i + 1].pos));
    });

    lines.forEach(x => this.addLine(x));
  }
}
