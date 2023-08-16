import { Direction } from "./enums";

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

  public static right(distance?: number): Vector {
    return this.direction(Direction.Right, distance);
  }

  public static left(distance?: number): Vector {
    return this.direction(Direction.Left, distance);
  }

  public static top(distance?: number): Vector {
    return this.direction(Direction.Top, distance);
  }

  public static topRight(distance?: number): Vector {
    return this.direction(Direction.TopRight, distance);
  }

  public static topLeft(distance?: number): Vector {
    return this.direction(Direction.TopLeft, distance);
  }

  public static bottom(distance?: number): Vector {
    return this.direction(Direction.Bottom, distance);
  }

  public static bottomRight(distance?: number): Vector {
    return this.direction(Direction.BottomRight, distance);
  }

  public static bottomLeft(distance?: number): Vector {
    return this.direction(Direction.BottomLeft, distance);
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

  public negate(): Vector {
    return new Vector(-this.x, -this.y);
  }

  public get magnitude(): number | undefined {
    let x = Math.abs(this.x);
    let y = Math.abs(this.y);

    if(x == 0)
      return y;

    else if(y == 0)
      return x;

    else if(x == y)
      return x;
  }
}