import Shape from "./Shape";
import Vector from "./Vector";
import Color from "./Color";

export default class Point extends Shape {
  static RADIUS = 10;
  static TEXT_SIZE = 12;

  constructor(public pos: Vector, public color: Color = new Color()) {
    super();
  }

  render(index: number, ctx: CanvasRenderingContext2D) {
    const { pos, color } = this;

    // circle
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, Point.RADIUS, 0, 2 * Math.PI, false);
    ctx.fillStyle = color.toHex();
    ctx.fill();

    // number
    const text = index.toString();
    ctx.font = `${Point.TEXT_SIZE}px Arial`;
    ctx.fillStyle = "#ffffff";
    const m = ctx.measureText(text);
    ctx.fillText(
      text,
      pos.x - m.width * 0.5,
      pos.y + Point.TEXT_SIZE * 0.5 - 2
    );
  }

  isVectorInside(vec: Vector): boolean {
    const { pos } = this;

    return (pos.x - vec.x) ** 2 + (pos.y - vec.y) ** 2 < Point.RADIUS ** 2;
  }

  isDraggable() {
    return true;
  }
}
