// import * as R from "ramda";

import Scene from "./base/Scene";
import Line from "./base/Line";
import Color from "./base/Color";
import Circle from "./base/Circle";
import Edge from "./base/Edge";
import { triangulate } from "./base/delaunay";
import { getCircumcircleTriangleCenter, isInTriangle } from "./base/utils";

const DEBUG = true;

export default class Voronoi extends Scene {
  render() {
    this.triangulate();
    super.render();
  }

  private triangulate() {
    this.clearLines();
    const points = this.getPoints();
    const dt = triangulate(points);

    if (DEBUG) {
      dt.forEach(e => {
        this.addLine(new Line(e.from.pos, e.to.pos, new Color(170, 170, 255)));

        const center = e.getCenter();
        const s = e.to.pos.sub(e.from.pos);
        const p = s.makePerpendicular().mul(0.2);
        this.addCircle(new Circle(center, 5, new Color(255, 170, 170)));
        this.addLine(
          new Line(center.sub(p), center.add(p), new Color(255, 170, 255))
        );
      });
    }

    // const triangles: Array<Array<Edge>> = [];
    const edges: Array<[number, number]> = dt.map(x => [
      points.indexOf(x.from),
      points.indexOf(x.to)
    ]);

    // console.log("edges", edges);

    const triangles: Array<[number, number, number]> = [];

    for (const e of edges) {
      const otherEdges = edges.filter(
        x =>
          (x.includes(e[0]) || x.includes(e[1])) &&
          !(x.includes(e[0]) && x.includes(e[1]))
      );

      const as = otherEdges.filter(x => x.includes(e[0]));
      const bs = otherEdges.filter(x => x.includes(e[1]));

      const rem: Array<number> = [];

      as.forEach(a => {
        bs.forEach(b => {
          const aa = a.filter(x => !e.includes(x))[0];
          const bb = b.filter(x => !e.includes(x))[0];

          if (aa === bb) {
            rem.push(aa);
          }
        });
      });

      rem.forEach(r => {
        const newTriangle: [number, number, number] = [e[0], e[1], r];

        const alreadyExists = triangles.some(t => {
          return newTriangle.every(p => t.includes(p));
        });

        if (!alreadyExists) {
          triangles.push(newTriangle);
        }
      });
    }

    const centeredTriangles = triangles.map(x => {
      const a = points[x[0]].pos;
      const b = points[x[1]].pos;
      const c = points[x[2]].pos;

      const center = getCircumcircleTriangleCenter(a, b, c);

      return {
        indices: x,
        center
      };
    });

    for (const triangle of centeredTriangles) {
      this.addCircle(new Circle(triangle.center, 7, new Color(255, 0, 0)));

      const ind = triangle.indices;

      let standaloneEdges = [
        [ind[0], ind[1]],
        [ind[1], ind[2]],
        [ind[2], ind[0]]
      ];

      for (const neighbour of centeredTriangles) {
        const sharedVertices = triangle.indices.filter(v =>
          neighbour.indices.includes(v)
        );

        if (sharedVertices.length === 2) {
          this.addLine(new Line(triangle.center, neighbour.center));

          standaloneEdges = standaloneEdges.filter(
            x =>
              !(
                (x[0] === sharedVertices[0] && x[1] === sharedVertices[1]) ||
                (x[0] === sharedVertices[1] && x[1] === sharedVertices[0])
              )
          );
        }
      }

      for (const se of standaloneEdges) {
        const a = points[se[0]];
        const b = points[se[1]];

        const ed = new Edge(a, b);

        const c = ed.getCenter();

        if (
          isInTriangle(
            triangle.center,
            points[ind[0]].pos,
            points[ind[1]].pos,
            points[ind[2]].pos
          )
        ) {
          this.addLine(new Line(triangle.center, c));
        } else {
          const dir = triangle.center.sub(c).mul(4);
          this.addLine(new Line(triangle.center, triangle.center.add(dir)));
        }
      }

      // console.log("standaloneEdges", standaloneEdges);
    }

    // console.log("triangles", triangles);
  }
}
