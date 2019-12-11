import Scene from "./base/Scene";
import Point from "./base/Point";
import Line from "./base/Line";
import Vector from "./base/Vector";

const getMidPoint = (a: Array<any>) =>
  a[Math.floor(a.length / 2) - (a.length % 2 === 0 ? 1 : 0)];

class Node {
  constructor(
    public parent: Node,
    private min: Vector,
    private max: Vector,
    public points: Array<Point> = []
  ) {}

  left: Node = null;
  right: Node = null;
  line: Line = null;

  buildTree(depth: number = 0) {
    const { points } = this;

    if (points.length <= 1) {
      return this;
    }

    if (depth % 2 === 0) {
      // split with vertical line
      const sortedPoints = points.sort((a, b) => a.pos.x - b.pos.x);
      const medianPoint = getMidPoint(sortedPoints)
      this.line = new Line(
        new Vector(medianPoint.pos.x, this.min.y),
        new Vector(medianPoint.pos.x, this.max.y)
      );

      const leftPoints = points.filter(p => p.pos.x <= medianPoint.pos.x);
      const rightPoints = points.filter(p => p.pos.x > medianPoint.pos.x);

      this.left = new Node(
        this,
        new Vector(this.min.x, this.min.y),
        new Vector(medianPoint.pos.x, this.max.y),
        leftPoints
      );

      this.right = new Node(
        this,
        new Vector(medianPoint.pos.x, this.min.y),
        new Vector(this.max.x, this.max.y),
        rightPoints
      );
    } else {
      // split with horizontal line
      const sortedPoints = points.sort((a, b) => a.pos.y - b.pos.y);
      const medianPoint = getMidPoint(sortedPoints)
      this.line = new Line(
        new Vector(this.min.x, medianPoint.pos.y),
        new Vector(this.max.x, medianPoint.pos.y)
      );

      const leftPoints = points.filter(p => p.pos.y <= medianPoint.pos.y);
      const rightPoints = points.filter(p => p.pos.y > medianPoint.pos.y);

      this.left = new Node(
        this,
        new Vector(this.min.x, this.min.y),
        new Vector(this.max.x, medianPoint.pos.y),
        leftPoints
      );

      this.right = new Node(
        this,
        new Vector(this.min.x, medianPoint.pos.y),
        new Vector(this.max.x, this.max.y),
        rightPoints
      );
    }

    this.points = [];
    this.left.buildTree(depth + 1);
    this.right.buildTree(depth + 1);

    return this;
  }
}

export default class KDTree extends Scene {
  render() {
    this.compute();
    super.render();
  }

  private compute() {
    const points = this.getPoints();
    const root = new Node(
      null,
      new Vector(0, 0),
      new Vector(this.width, this.height),
      points
    ).buildTree();

    console.log("root", root)

    this.clearLines();
    this.drawLines(root);
  }

  private drawLines(node: Node | null) {
    if (!node || !node.line) {
      return;
    }

    this.addLine(node.line);

    this.drawLines(node.left);
    this.drawLines(node.right);
  }
}
