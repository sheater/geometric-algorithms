import Vector from "./Vector";
import Point from "./Point";
import Line from "./Line";
import Circle from "./Circle";

const LOCAL_STORAGE_KEY = "points";

export default class Scene {
  private canvas: HTMLCanvasElement;
  private dragged: boolean = false;
  private draggedPoint: Point = null;
  // protected shapes: Array<Shape> = [];
  private points: Array<Point> = [];
  private lines: Array<Line> = [];
  private circles: Array<Circle> = [];

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById("mainCanvas");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.canvas.addEventListener("mousedown", event => {
      const mousePos = new Vector(
        event.pageX - this.canvas.offsetLeft,
        event.pageY - this.canvas.offsetTop
      );

      // const shape = this.shapes.find(x => x.isVectorInside(mousePos));
      const point = this.points.find(x => x.isVectorInside(mousePos));

      this.dragged = false;
      this.draggedPoint = point || null;
    });

    this.canvas.addEventListener("mousemove", event => {
      if (this.draggedPoint && this.draggedPoint instanceof Point) {
        const mousePos = new Vector(
          event.pageX - this.canvas.offsetLeft,
          event.pageY - this.canvas.offsetTop
        );

        this.dragged = true;
        this.draggedPoint.pos = mousePos;
        this.render();
      }
    });

    this.canvas.addEventListener("mouseup", event => {
      const mousePos = new Vector(
        event.pageX - this.canvas.offsetLeft,
        event.pageY - this.canvas.offsetTop
      );

      if (!this.dragged) {
        if (this.draggedPoint) {
          this.removePoint(this.draggedPoint);
        } else {
          this.addPoint(new Point(mousePos));
        }

        this.render();
      }

      this.draggedPoint = null;
      this.storePoints();
    });

    this.restorePoints();
  }

  private restorePoints() {
    const restoredPoints = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!restoredPoints) {
      return;
    }

    try {
      const parsedPoints = JSON.parse(restoredPoints);

      parsedPoints.forEach((p: any) => {
        this.addPoint(new Point(new Vector(p.x, p.y)));
      });

      this.render();
    } catch {}
  }

  private storePoints() {
    const points = this.getPoints().map(x => x.pos);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(points));
  }

  protected getPoints() {
    return this.points.slice(); //<Array<Point>>this.shapes.filter(x => x instanceof Point);
  }

  public clearPoints() {
    this.points = [];
    this.storePoints();
    this.render();
  }

  protected addLine(line: Line) {
    this.lines.push(line);
  }

  protected addCircle(circle: Circle) {
    this.circles.push(circle);
  }

  private addPoint(point: Point) {
    this.points.push(point);
    this.storePoints();
  }

  private removePoint(point: Point) {
    const { points } = this;

    const index = points.indexOf(point);
    points.splice(index, 1);
  }

  protected clearLines() {
    this.lines = [];
    this.circles = [];
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  protected render() {
    const { canvas } = this;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.circles.forEach((x, i) => x.render(i, ctx));
    this.lines.forEach((x, i) => x.render(i, ctx));
    this.points.forEach((x, i) => x.render(i, ctx));
  }
}
