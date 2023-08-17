import { Board } from "./board";
import { Direction, Side } from "./enums";
import { Square } from "./square";
import { Vector } from "./vector";

class Pin {

  public readonly piece: Piece;

  public readonly direction: Direction;

  constructor(piece: Piece, direction: Direction) {
    this.piece = piece;
    this.direction = direction;
  }

  public isParallelWith(direction: Direction): boolean {

    if(direction == this.direction)
      return true;
    
    switch(this.direction) {
      case Direction.Bottom: return direction == Direction.Top;
      case Direction.Top: return direction == Direction.Bottom;
      case Direction.Left: return direction == Direction.Right;
      case Direction.Right: return direction == Direction.Left;
      case Direction.BottomLeft: return direction == Direction.TopRight;
      case Direction.BottomRight: return direction == Direction.TopLeft;
      case Direction.TopLeft: return direction == Direction.BottomRight;
      case Direction.TopRight: return direction == Direction.BottomLeft;
    }

    return false;
  }
}

export abstract class Piece {

  public readonly side: Side;

  public readonly board?: Board;

  public pin?: Pin;
  
  public square?: Square;

  public get oppositeSide() {
    return this.side === Side.Black ? Side.White : Side.Black;
  }

  public abstract get symbol(): string;

  public get isInHomeRank(): boolean {
    return this.side == Side.Black
      ? this.square?.rank == '8'
      : this.square?.rank == '1';
  }

  constructor(side: Side, board?: Board) {
    this.side = side;
    this.board = board;
  }

  public abstract get availableMoves(): Square[];

  public bind(square: Square): void {
    if (square !== this.square) {
      this.unbind();
      square.bind(this);
    }
  }

  public unbind(): void {
    if (this.square) {
      this.square.unbind();
    }
  }

  public isLineWith(piece: Piece): boolean {
    return this.isDiagonalWith(piece) || this.isStraightWith(piece);
  }

  public isDiagonalWith(piece: Piece): boolean {
    if(!this.square || !piece.square)
      return false;

    return Math.abs(this.square.row - piece.square.row)
      == Math.abs(this.square.column - piece.square.column);
  }

  public isStraightWith(piece: Piece): boolean {
    if(!this.square || !piece.square)
      return false;

    return (this.square.row - piece.square.row) == 0
      || (this.square.column - piece.square.column) == 0;
  }

  public distance(piece: Piece): Vector | undefined {
    if(this.square && piece.square) {
      let x = this.square.column - piece.square.column;
      let y = this.square.row - piece.square.row;
      return new Vector(x, y);
    }
  }

  public toString(): string {
    return this.symbol;
  }

  public static createFromSymbol(symbol: string, board?: Board): Piece | undefined {
    let side = symbol === symbol.toLowerCase() ? Side.Black : Side.White;

    switch (symbol.toUpperCase()) {
      case 'P': return new Pawn(side, board);
      case 'R': return new Rook(side, board);
      case 'N': return new Knight(side, board);
      case 'B': return new Bishop(side, board);
      case 'Q': return new Queen(side, board);
      case 'K': return new King(side, board);
    }
  }

  public static isValidPiece(symbol?: string) {
    return symbol && 'PRNBQK'.includes(symbol);
  }
}

export class Pawn extends Piece {

  public get isInHomeRank(): boolean {
    return this.side == Side.Black
      ? this.square?.rank == '7'
      : this.square?.rank == '2';
  }

  public get availableMoves(): Square[] {
    let { board, square, side, oppositeSide, pin } = this;

    if(!square || !board)
      return [];

    let moves: Square[] = [];
    let step = side == Side.Black ? 1 : -1;

    if(!pin || (pin.direction & Direction.Vertical) == pin.direction) {
      let firstStep = square.displace(step, 0);
      if(firstStep && !firstStep.piece) {
        moves.push(firstStep);
        if(this.isInHomeRank) {
          let secondStep = square.displace(2 * step, 0);
          if(secondStep && !secondStep.piece) {
            moves.push(secondStep);
          }
        }
      }
    }

    let attacking = [
      Direction.Diagonal | Direction.Left | (Side.Black == side ? Direction.Bottom : Direction.Top),
      Direction.Diagonal | Direction.Right | (Side.Black == side ? Direction.Bottom : Direction.Top),
    ]

    .filter(d => !this.pin || this.pin.isParallelWith(d))
    .map(d => square!.displace(d))
    .filter((s): s is Square => s instanceof Square && (s.piece?.side == oppositeSide || s == board!.enPassant));

    moves.push(...attacking);

    return moves;
  }

  public get symbol(): string {
    return this.side === Side.Black ? 'p' : 'P';
  }
}

export class Knight extends Piece {
  public get availableMoves(): Square[] {

    let { square, oppositeSide, pin } = this;

    if(!square || pin)
      return [];

    let directions = [
      new Vector(2, 1),
      new Vector(2, -1),
      new Vector(-2, 1),
      new Vector(-2, -1),
      new Vector(1, 2),
      new Vector(1, -2),
      new Vector(-1, 2),
      new Vector(-1, -2),
    ];

    let moves: Square[] = [];
    square.displaces(directions).forEach(s => {
      if(s && (!s.piece || s.piece.side == oppositeSide))
        moves.push(s);
    });
    
    return moves;
  }

  public get symbol(): string {
    return this.side === Side.Black ? 'n' : 'N';
  }
}

export class Bishop extends Piece {
  public get availableMoves(): Square[] {
    let { square, pin, oppositeSide } = this;

    if(!this.square)
      return [];

    let directions = [
      Direction.TopLeft,
      Direction.TopRight,
      Direction.BottomLeft,
      Direction.BottomRight,
    ]
    
    .filter(d => !pin || pin.isParallelWith(d));

    return directions
      .flatMap(d => square!.scanDirection(d, s => s.piece instanceof Piece))
      .filter(d => !d.piece || d.piece.side == oppositeSide);
  }
  
  public get symbol(): string {
    return this.side === Side.Black ? 'b' : 'B';
  }
}

export class Rook extends Piece {
  public get availableMoves(): Square[] {

    if(!this.square)
      return [];

    let directions = [
      Direction.Top,
      Direction.Bottom,
      Direction.Left,
      Direction.Right,
    ]

    .filter(d => !this.pin || this.pin.isParallelWith(d));

    return directions
      .flatMap(d => this.square!.scanDirection(d, s => s.piece instanceof Piece))
      .filter(d => !d.piece || d.piece.side === this.oppositeSide);
  }

  public get symbol(): string {
    return this.side === Side.Black ? 'r' : 'R';
  }
}

export class Queen extends Piece {
  public get availableMoves(): Square[] {

    if(!this.square)
      return [];

    let directions = [
      Direction.Top,
      Direction.Bottom,
      Direction.Left,
      Direction.Right,
      Direction.TopLeft,
      Direction.TopRight,
      Direction.BottomLeft,
      Direction.BottomRight,
    ]

    .filter(d => !this.pin || this.pin.isParallelWith(d));

    return directions
      .flatMap(d => this.square!.scanDirection(d, s => s.piece instanceof Piece))
      .filter(d => !d.piece || d.piece.side === this.oppositeSide);
  }

  public get symbol(): string {
    return this.side === Side.Black ? 'q' : 'Q';
  }
}

export class King extends Piece {
  public get availableMoves(): Square[] {

    if(!this.square || !this.board)
      return [];

    let directions = [
      Direction.Top,
      Direction.Bottom,
      Direction.Left,
      Direction.Right,
      Direction.TopLeft,
      Direction.TopRight,
      Direction.BottomLeft,
      Direction.BottomRight,
    ];

    let moves = directions.map(d => this.square!.displace(d))
      .filter((v): v is Square => v instanceof Square && (!v.piece || v.piece.side == this.oppositeSide));
    
    if(this.isInHomeRank && this.board.castling.canKingSide(this.side)) {
      let homeRank = this.square.row;
      let rook = this.board.findKingRook(this.side);
      if(rook && rook.square) {
        let isAbleToCastling = true;
        for(let i = this.square.column + 1; i < rook.square.column; i++) {
          if(this.board.findSquare(homeRank, i)!.piece) {
            isAbleToCastling = false;
            break;
          }
        }

        if(isAbleToCastling) {
          moves.push(this.board.findSquare(homeRank, 6)!);
        }
      }
    }

    if(this.isInHomeRank && this.board.castling.canQueenSide(this.side)) {
      let homeRank = this.square.row;
      let rook = this.board.findKingRook(this.side);
      if(rook && rook.square) {
        let isAbleToCastling = true;
        for(let i = this.square.column - 1; i > rook.square.column; i--) {
          if(this.board.findSquare(homeRank, i)!.piece) {
            isAbleToCastling = false;
            break;
          }
        }

        if(isAbleToCastling) {
          moves.push(this.board.findSquare(homeRank, 2)!);
        }
      }
    }

    return moves;
  }

  public setPinnedPieces() {

    let directions = [
      Direction.Top,
      Direction.Bottom,
      Direction.Left,
      Direction.Right,
      Direction.TopLeft,
      Direction.TopRight,
      Direction.BottomLeft,
      Direction.BottomRight,
    ];

    let pieces: Piece[] = [];

    directions.forEach(dir => {
      let pinned: Piece | undefined;
      this.square!.scanDirection(dir, s => {
        if(s.piece) {
          if(s.piece.side == this.side && !pinned) {
            pinned = s.piece;
          }
          else if (s.piece.side == this.oppositeSide && pinned) {
            let validPinner = s.piece instanceof Queen
              || (s.piece instanceof Rook && !(dir & Direction.Diagonal))
              || (s.piece instanceof Bishop && (dir & Direction.Diagonal));

            if(validPinner) {
              pinned.pin = new Pin(s.piece, dir);
              pieces.push(pinned);
            }
            else return true;
          }
          else return true;
        }
        return false;
      });
    });

    return pieces;
  }

  public get symbol(): string {
    return this.side === Side.Black ? 'k' : 'K';
  }
}