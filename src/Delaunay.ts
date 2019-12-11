import Scene from "./base/Scene";
import Line from "./base/Line";
import { triangulate } from "./base/delaunay";

export default class Delaunay extends Scene {
  render() {
    this.triangulate();
    super.render();
  }

  private triangulate() {
    this.clearLines();

    triangulate(this.getPoints()).forEach(e => {
      this.addLine(new Line(e.from.pos, e.to.pos));
    });
  }
}
