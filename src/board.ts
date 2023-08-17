import { Castling } from "./castling";
import { CastlingSide, Side } from "./enums";
import { Move } from "./move";
import { King, Pawn, Piece, Rook } from "./pieces";
import { Square } from "./square";

export class Board {

  private placement: string;

  private _turn: Side;

  private _castling: Castling;

  private halfMove: number;

  private fullMove: number;

  private _enPassant?: Square;

  private isChanged = false;

  private blackKing?: King;
  private blackKingRook?: Rook;
  private blackQueenRook?: Rook;

  private whiteKing?: King;
  private whiteKingRook?: Rook;
  private whiteQueenRook?: Rook;

  public readonly squares: Square[];

  public readonly activePieces: Set<Piece>;

  public readonly inactivePieces: Set<Piece> = new Set();

  public readonly pinnedPieces: Set<Piece> = new Set();

  public readonly moves: Move[] = [];

  get enPassant() {
    return this._enPassant;
  }

  get castling() {
    return this._castling;
  }

  get turn() {
    return this._turn;
  }

  get isWhiteTurn() {
    return this._turn === Side.White;
  }

  get isBlackTurn() {
    return this._turn === Side.Black;
  }

  public constructor(fenstring?: string) {
    fenstring ??= 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    let [placement, turn, castling, enPassant, halfMove, fullMove] = fenstring.split(' ');

    this.placement = placement;
    this._turn = turn === Side.Black ? Side.Black : Side.White;
    this._castling = new Castling(castling);
    this.halfMove = parseInt(halfMove);
    this.fullMove = parseInt(fullMove);

    this.squares = this.createSquares();
    this.activePieces = new Set(this.createPieces());

    if(enPassant !== '-') {
      this._enPassant = this.findSquare(enPassant);
    }

    this.blackKingRook = this.findKingRook(Side.Black);
    this.whiteKingRook = this.findKingRook(Side.White);
    this.blackQueenRook = this.findQueenRook(Side.Black);
    this.whiteQueenRook = this.findQueenRook(Side.White);

    this.updatePin();
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

    let piece = <King> this.findActivePiece((p): p is King => p instanceof King && p.side == side)!;

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
    if(side == Side.Black && this.blackQueenRook instanceof Rook)
      return this.blackQueenRook;
    else if(side == Side.White && this.whiteQueenRook instanceof Rook)
      return this.whiteQueenRook;

    let king = this.findKing(side);
    let kingSquare = king.square!;
    let rook = this.findActivePiece(
      p => p instanceof Rook
        && p.side == side
        && p.isInHomeRank
        && p.square!.column < kingSquare.column
    );

    if(side == Side.Black)
      this.blackQueenRook = rook;
    else if(side == Side.White)
      this.whiteQueenRook = rook;

    return rook;
  }

  public findKingRook(side: Side): Rook | undefined {
    if(side == Side.Black && this.blackKingRook instanceof Rook)
      return this.blackKingRook;
    else if(side == Side.White && this.whiteKingRook instanceof Rook)
      return this.whiteKingRook;

    let king = this.findKing(side);
    let kingSquare = king.square!;
    let rook = this.findActivePiece(
      p => p instanceof Rook
        && p.side == side
        && p.isInHomeRank
        && p.square!.column > kingSquare.column
    );

    if(side == Side.Black)
      this.blackKingRook = rook;
    else if(side == Side.White)
      this.whiteKingRook = rook;

    return rook;
  }

  public findActivePiece(predicate: (p: Piece) => boolean): Piece | undefined {
    for(let piece of this.activePieces) {
      if(predicate(piece))
        return piece;
    }
  }

  public findSquare(key: string): Square | undefined;
  public findSquare(row: number, column: number): Square | undefined;
  public findSquare(predicate: (value: Square, index?: number, obj?: Square[]) => value is Square): Square | undefined;
  public findSquare(arg1: any, column?: any): Square | undefined {

    if (typeof arg1 === 'string') {
      return this.squares.find(s => s.key == arg1);
    }

    else if (typeof arg1 === "number" && typeof column === 'number') {
      return this.squares.find(s => s.row == arg1 && s.column == column);
    }

    else if (typeof arg1 === 'function') {
      return this.squares.find(arg1);
    }
  }

  private unbind(piece?: Piece): void {
    if(piece instanceof Piece) {
      this.inactivePieces.add(piece);
      this.activePieces.delete(piece);
      piece.unbind();
    }
  }

  private bind(square: Square, piece?: Piece): void {
    if(piece instanceof Piece) {
      this.activePieces.add(piece);
      this.inactivePieces.delete(piece);
      square.bind(piece);
    }
  }

  public move(notation: string): Move {
    this.updatePin();

    let move = new Move(this, notation);

    this.unbind(move.capturedPiece);
    this.unbind(move.from.piece);
    
    this.bind(move.to, move.promotesTo ?? move.piece);

    if(move.castling) {
      let rook = move.castling.rook;
      this.unbind(rook);

      let newPos = this.findSquare(
        this.turn == Side.Black ? 0 : 7,
        move.castling.side == CastlingSide.King ? 5 : 3
      )!;

      this.bind(newPos, rook);
    }

    if(this.turn == Side.Black) {
      this.fullMove++;
    }

    if(move.capturedPiece instanceof Piece || move.piece instanceof Pawn) {
      this.halfMove = 0;
    }
    else {
      this.halfMove++;
    }

    delete this._enPassant;
    if(move.piece instanceof King) {
      this.castling.unset(this.turn, CastlingSide.King, CastlingSide.Queen);
    }
    else if(move.piece instanceof Rook) {
      if(move.piece === this.findKingRook(this.turn)) {
        this.castling.unset(this.turn, CastlingSide.King);
      }
      else if(move.piece === this.findQueenRook(this.turn)) {
        this.castling.unset(this.turn, CastlingSide.Queen);
      }
    }
    else if(move.piece instanceof Pawn) {
      if(move.from.rank == '2' && move.to.rank == '4') {
        this._enPassant = this.findSquare(move.from.file + '3');
        // console.debug(`En passant at: ${this._enPassant}`);
      }
      else if(move.from.rank == '7' && move.to.rank == '5') {
        this._enPassant = this.findSquare(move.from.file + '6');
        // console.debug(`En passant at: ${this._enPassant}`);
      }
    }

    this.changeTurn();
    this.isChanged = true;

    this.moves.push(move);

    return move;
  }

  private updatePin(): void {
    this.pinnedPieces.forEach(p => delete p.pin);
    this.pinnedPieces.clear;
    this.findBlackKing().setPinnedPieces().forEach(p => this.pinnedPieces.add(p));
    this.findWhiteKing().setPinnedPieces().forEach(p => this.pinnedPieces.add(p));
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
      this._turn,
      this._castling,
      this._enPassant ?? '-',
      this.halfMove,
      this.fullMove,
    ].join(' ');
  }

  public renderString() {
      let boardString = "╔═══╤═══╤═══╤═══╤═══╤═══╤═══╤═══╗\n"
        + "║ a8 │ b8 │ c8 │ d8 │ e8 │ f8 │ g8 │ h8 ║ 8\n"
        + "╟───┼───┼───┼───┼───┼───┼───┼───╢\n"
        + "║ a7 │ b7 │ c7 │ d7 │ e7 │ f7 │ g7 │ h7 ║ 7\n"
        + "╟───┼───┼───┼───┼───┼───┼───┼───╢\n"
        + "║ a6 │ b6 │ c6 │ d6 │ e6 │ f6 │ g6 │ h6 ║ 6\n"
        + "╟───┼───┼───┼───┼───┼───┼───┼───╢\n"
        + "║ a5 │ b5 │ c5 │ d5 │ e5 │ f5 │ g5 │ h5 ║ 5\n"
        + "╟───┼───┼───┼───┼───┼───┼───┼───╢\n"
        + "║ a4 │ b4 │ c4 │ d4 │ e4 │ f4 │ g4 │ h4 ║ 4\n"
        + "╟───┼───┼───┼───┼───┼───┼───┼───╢\n"
        + "║ a3 │ b3 │ c3 │ d3 │ e3 │ f3 │ g3 │ h3 ║ 3\n"
        + "╟───┼───┼───┼───┼───┼───┼───┼───╢\n"
        + "║ a2 │ b2 │ c2 │ d2 │ e2 │ f2 │ g2 │ h2 ║ 2\n"
        + "╟───┼───┼───┼───┼───┼───┼───┼───╢\n"
        + "║ a1 │ b1 │ c1 │ d1 │ e1 │ f1 │ g1 │ h1 ║ 1\n"
        + "╚═══╧═══╧═══╧═══╧═══╧═══╧═══╧═══╝\n"
        + "  A   B   C   D   E   F   G   H";

      this.squares.forEach(c => {
        boardString = boardString.replace(c.key, c.piece?.symbol ?? ' ');
      });
      
      return boardString;
  }

  public changeTurn(): void {
    this._turn = this.turn == Side.Black ? Side.White : Side.Black;
  }
}