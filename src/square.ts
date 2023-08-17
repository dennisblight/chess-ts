import { Board } from "./board";
import { Direction } from "./enums";
import { Piece } from "./pieces";
import { Vector } from "./vector";

export class Square {

  public readonly file: string;

  public readonly rank: string;

  public readonly id: number;

  public readonly key: string;

  public piece?: Piece;

  public readonly board?: Board;

  public get row() {
    return Math.floor(this.id / 8);
  }

  public get column() {
    return this.id % 8;
  }

  public constructor(key: string, board?: Board) {
    this.key = key;
    this.file = key[0];
    this.rank = key[1];
    this.id = this.file.charCodeAt(0) - 97 + 8 * (8 - parseInt(this.rank));
    this.board = board;
  }

  public displace(vector: Vector): Square | undefined;
  public displace(direction: Direction): Square | undefined;
  public displace(row: number, column: number): Square | undefined;
  public displace(arg1: any, arg2?: any): Square | undefined {
    if (typeof arg1 === 'number' && typeof arg2 === 'number')
      arg1 = new Vector(arg2, arg1);

    else if(Object.values(Direction).includes(arg1))
      arg1 = Vector.direction(arg1);

    if (arg1 instanceof Vector)
      return this.board?.findSquare(this.row + arg1.y, this.column + arg1.x);
  }

  /**
   * Warning, this method will delete the vector item if displaced square not found
   * @param vectors 
   * @param distance 
   * @returns 
   */
  public displaces(vectors: (Vector | undefined)[], distance?: number): (Square | undefined)[] {
    return vectors.map((vector, index) => {
      if(vector) {
        let d = distance ?? 1;
        let square = this.displace(vector.y * d, vector.x * d);
        if(!square) delete vectors[index];
        return square;
      }
    });
  }

  public scanDirection(direction: Direction, until?: (s: Square) => boolean) {
    let vector = Vector.direction(direction);
    let squares: Square[] = [];
    for(let m = 1; m < 8; m++) {
      let square = this.displace(vector.mutiply(m));
      if(square) squares.push(square);
      else break;
      if(until && until(square))
        break;
    }
    return squares;
  }

  public bind(piece: Piece): void {
    if (this.piece !== piece) {
      this.unbind();
      this.piece = piece;
      piece.square = this;
    }
  }

  public unbind(): void {
    if (this.piece) {
      delete this.piece.square;
      delete this.piece;
    }
  }

  public toString() {
    return this.key;
  }
}