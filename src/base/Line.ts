import Shape from "./Shape";
import Vector from "./Vector";
import Color from "./Color";

export default class Line extends Shape {
  constructor(
    public start: Vector,
    public end: Vector,
    public color: Color = new Color()
  ) {
    super();
  }

  render(index: number, ctx: CanvasRenderingContext2D) {
    const { start, end, color } = this;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color.toHex();
    ctx.stroke();
  }
}
