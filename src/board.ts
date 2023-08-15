import { Castling } from "./castling";
import { Side } from "./enums";
import { King, Piece, Rook } from "./pieces";
import { Square } from "./square";

export class Board {

  private placement: string;

  private turn: Side;

  private _castling: Castling;

  private halfMove: number;

  private fullMove: number;

  private _enPassant?: Square;

  private isChanged = false;

  private blackKing?: King;

  private whiteKing?: King;

  public readonly squares: Square[];

  public readonly activePieces: Piece[];

  public readonly inactivePieces: Piece[];

  get enPassant() {
    return this._enPassant;
  }

  get castling() {
    return this._castling;
  }

  get isWhiteTurn() {
    return this.turn === Side.White;
  }

  get isBlackTurn() {
    return this.turn === Side.Black;
  }

  public constructor(fenstring?: string) {
    fenstring ??= 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    let [placement, turn, castling, enPassant, halfMove, fullMove] = fenstring.split(' ');

    this.placement = placement;
    this.turn = turn === Side.Black ? Side.Black : Side.White;
    this._castling = new Castling(castling);
    this.halfMove = parseInt(halfMove);
    this.fullMove = parseInt(fullMove);

    this.squares = this.createSquares();
    this.activePieces = this.createPieces();
    this.inactivePieces = [];

    if(enPassant !== '-') {
      this._enPassant = this.findSquare(enPassant);
    }
  }

  private createSquares(): Square[] {
    let squares: Square[] = [];

    [...'87654321'].forEach(rank => [...'abcdefgh'].forEach(file => {
      squares.push(new Square(file + rank, this));
    }));

    return squares;
  }

  private createPieces(): Piece[] {
    let pieces: Piece[] = [];
    this.placement.split('/').forEach((row, r) => {
      let i = 0;
      [...row].forEach(c => {
        let piece = Piece.createFromSymbol(c, this);
        if(piece) {
          this.findSquare(r, i++)?.bind(piece);
          pieces.push(piece);
        }
        else {
          i += parseInt(c);
        }
      });
    });

    return pieces;
  }

  public findKing(side: Side): King {
    if(side == Side.Black && this.blackKing)
      return this.blackKing;

    else if(side == Side.White && this.whiteKing)
      return this.whiteKing;

    let piece: King = this.activePieces.find(
      p => p instanceof King && p.side == side
    )!;

    if(side == Side.Black)
      this.blackKing = piece;

    else if(side == Side.White)
      this.whiteKing = piece;
    
    return piece;
  }

  public findBlackKing() {
    return this.findKing(Side.Black);
  }

  public findWhiteKing() {
    return this.findKing(Side.White);
  }

  public findQueenRook(side: Side): Rook | undefined {
    let homeRank = side == Side.White ? '1' : '8';
    let king = this.findKing(side);
    let kingSquare = king.square!;
    return this.activePieces.find(
      p => p instanceof Rook
        && p.side == side
        && p.square?.rank == homeRank
        && p.square?.column < kingSquare.column
    );
  }

  public findKingRook(side: Side): Rook | undefined {
    let homeRank = side == Side.White ? '1' : '8';
    let king = this.findKing(side);

    let kingSquare = king.square!;
    return this.activePieces.find(
      p => p instanceof Rook
        && p.side == side
        && p.square?.rank == homeRank
        && p.square?.column > kingSquare.column
    );
  }

  public findSquare(key: string): Square | undefined;
  public findSquare(row: number, column: number): Square | undefined;
  public findSquare(predicate: (value: Square, index?: number, obj?: Square[]) => value is Square): Square | undefined;
  public findSquare(arg1: any, column?: any): Square | undefined {

    if (typeof arg1 === 'string') {
      arg1 = (s: Square) => s.key == arg1;
    }

    else if (typeof arg1 === "number" && typeof column === 'number') {
      arg1 = (s: Square) => s.row == arg1 && s.column == column;
    }

    if (typeof arg1 === 'function') {
      return this.squares.find(arg1);
    }
  }

  public get fenstring(): string {
    if (this.isChanged) {
      this.placement = this.squares
        .reduce((s, c) => s += c.piece?.symbol ?? '1', '')
        .replace(/.{8}/g, s => '/' + s)
        .replace(/1{2,}/g, s => s.length.toString())
        .substring(1);

      this.isChanged = false;
    }

    return [
      this.placement,
      this.turn,
      this._castling,
      this._enPassant ?? '-',
      this.halfMove,
      this.fullMove,
    ].join(' ');
  }
}