import { Board } from "./board";
import { Piece } from "./pieces";
import { Vector } from "./vector";

export class Square {

  public readonly file: string;

  public readonly rank: string;

  public readonly id: number;

  public readonly key: string;

  private _piece?: Piece;
  public get piece(): typeof this._piece {
    return this._piece;
  }
  private set piece(value: NonNullable<Piece>) {
    this._piece = value;
  }

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
  public displace(row: number, column: number): Square | undefined;
  public displace(arg1: any, arg2?: any): Square | undefined {
    if (typeof arg1 === 'number' && typeof arg2 === 'number')
      arg1 = new Vector(arg2, arg1);

    if (arg1 instanceof Vector)
      return this.board?.findSquare(this.row + arg1.y, this.column + arg1.y);
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

  public bind(piece: Piece): void {
    if (this.piece !== piece) {
      this.unbind();
      this.piece = piece;
      this.piece.bind(this);
    }
  }

  public unbind(): void {
    if (this.piece) {
      let piece = this.piece;
      delete this.piece;
      piece.unbind();
    }
  }

  public toString() {
    return this.key;
  }
}