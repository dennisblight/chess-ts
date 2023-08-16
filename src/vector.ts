import { Direction } from "./enums";

export class Vector {

  public readonly x;

  public readonly y;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static direction(direction: Direction, distance?: number): Vector {
    distance ??= 1;

    let x = 0;
    if(direction & Direction.Left)
      x = -1;

    else if(direction & Direction.Right)
      x = 1;

    let y = 0;
    if(direction & Direction.Top)
      y = -1;

    else if(direction & Direction.Bottom)
      y = 1;

    return new Vector(x * distance, y * distance);
  }

  public add(distance: number): Vector;
  public add(vector: Vector): Vector;
  public add(arg: any): Vector {
    if(typeof arg === 'number')
      return new Vector(this.x + arg, this.y + arg);

    if(arg instanceof Vector)
      return new Vector(this.x + arg.x, this.y + arg.y);

    throw new Error(`Unable to add vector with ${arg}`);
  }

  public mutiply(scalar: number): Vector {
    return new Vector(scalar * this.x, scalar * this.y);
  }
}