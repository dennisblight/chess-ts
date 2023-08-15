import { CastlingSide, Side } from "./enums";

export class Castling {

  private whiteKing = false;

  private whiteQueen = false;

  private blackKing = false;

  private blackQueen = false;

  public constructor(castling: string) {
    this.whiteKing = castling.includes('K');
    this.whiteQueen = castling.includes('Q');
    this.blackKing = castling.includes('k');
    this.blackQueen = castling.includes('q');
  }

  public canQueenSide(side: Side): boolean {
    return side == Side.Black
      ? this.blackQueen
      : this.whiteQueen;
  }

  public canKingSide(side: Side): boolean {
    return side == Side.Black
      ? this.blackKing
      : this.whiteKing;
  }

  public getCastlingSides(side: Side): CastlingSide[] {
    let castlingSides = [];

    if(this.canKingSide(side))
      castlingSides.push(CastlingSide.King);
    
    if(this.canQueenSide(side))
      castlingSides.push(CastlingSide.Queen);

    return castlingSides;
  }

  public toString(): string {
    let str = '';

    if (this.whiteKing) str += 'K';
    if (this.whiteQueen) str += 'Q';
    if (this.blackKing) str += 'k';
    if (this.blackQueen) str += 'q';

    return str.length > 0 ? str : '-';
  }
}