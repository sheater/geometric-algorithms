import Shape from "./Shape";
import Vector from "./Vector";
import Color from "./Color";

export default class Circle extends Shape {
  constructor(
    public center: Vector,
    public radius: number,
    public color: Color = new Color(0, 0, 255)
  ) {
    super();
  }

  render(index: number, ctx: CanvasRenderingContext2D) {
    const { center, radius, color } = this;

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color.toHex();
    ctx.stroke();
  }
}
