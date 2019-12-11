export default class Color {
  constructor(
    public r: number = 0,
    public g: number = 0,
    public b: number = 0
  ) {}

  toHex() {
    return (
      "#" +
      ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b)
        .toString(16)
        .slice(1)
    );
  }
}
