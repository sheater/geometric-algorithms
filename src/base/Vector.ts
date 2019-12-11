export default class Vector {
  constructor(public x: number = 0, public y: number = 0) {}

  equal(vec: Vector) {
    return vec.x === this.x && vec.y === this.y;
  }

  dotProduct(vec: Vector) {
    return vec.x * this.x + vec.y * this.y;
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(vec: Vector) {
    return new Vector(this.x + vec.x, this.y + vec.y);
  }

  mul(value: number) {
    return new Vector(this.x * value, this.y * value);
  }

  sub(vec: Vector) {
    return new Vector(this.x - vec.x, this.y - vec.y);
  }

  getDistanceToSq(b: Vector) {
    return (this.x - b.x) ** 2 + (this.y - b.y) ** 2;
  }

  getDistanceTo(b: Vector) {
    return Math.sqrt(this.getDistanceToSq(b));
  }

  makePerpendicular() {
    return new Vector(-this.y, this.x);
  }
}
