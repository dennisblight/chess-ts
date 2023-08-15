export class Vector {

  public readonly x;

  public readonly y;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isParallelWith(vector: Vector): boolean {
    return (this.x == vector.x && this.y == vector.y)
      || (this.x == -vector.x && this.y == -vector.y);
  }
}