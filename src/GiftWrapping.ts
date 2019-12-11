import Scene from "./base/Scene";
import Point from "./base/Point";
import Line from "./base/Line";
import Color from "./base/Color";

export default class GiftWrapping extends Scene {
  public render() {
    this.calculateHull();
    super.render();
  }

  calculateHull() {
    // keep just points
    // const points = this.shapes = this.getPoints();
    this.clearLines();
    const points = this.getPoints();

    if (points.length >= 3) {
      const hull = [];
      const pivot = points.reduce((acc, x) => {
        if (x.pos.y > acc.pos.y) {
          return x;
        }

        return acc;
      }, points[0]);

      let currentPoint = pivot;

      do {
        hull.push(currentPoint.pos);

        let nextPoint =
          points[(points.indexOf(currentPoint) + 1) % points.length];
        for (const x of points) {
          const p = currentPoint.pos;
          const q = x.pos;
          const r = nextPoint.pos;

          const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

          if (val < 0) nextPoint = x;
        }

        currentPoint = nextPoint;
      } while (currentPoint !== pivot);

      for (let i = 0; i < hull.length; i++) {
        const start = hull[i];
        const end = hull[(i + 1) % hull.length];

        this.addLine(new Line(start, end, new Color(255, 0, 0)));
      }
    }
  }
}
