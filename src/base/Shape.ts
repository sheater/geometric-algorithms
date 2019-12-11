import Vector from "./Vector"

export default class Shape {
  render(index: number, ctx: CanvasRenderingContext2D) {}

  isVectorInside(vec: Vector): boolean {
    return false;
  }

  isDraggable() {
    return false;
  }
}
