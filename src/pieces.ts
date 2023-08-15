import { Board } from "./board";
import { Side } from "./enums";
import { Square } from "./square";
import { Vector } from "./vector";

class Pin {

  public readonly piece: Piece;

  public readonly direction: Vector;

  constructor(piece: Piece, direction: Vector) {
    this.piece = piece;
    this.direction = direction;
  }
}

export abstract class Piece {

  public readonly side: Side;

  public readonly board?: Board;

  public pin?: Pin;
  
  private _square?: Square;
  public get square(): typeof this._square {
    return this._square;
  }
  private set square(value: Square) {
    this._square = value;
  }

  public get oppositeSide() {
    return this.side === Side.Black ? Side.White : Side.Black;
  }

  public get symbol(): string {
    return this.side === Side.Black
      ? this.constructor.name[0].toLowerCase()
      : this.constructor.name[0].toUpperCase();
  }

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
      this.square = square;
      this.square.bind(this);
    }
  }

  public unbind(): void {
    if (this.square) {
      let square = this.square;
      delete this.square;
      square.unbind();
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
}

export class Pawn extends Piece {

  public get isInHomeRank(): boolean {
    return this.side == Side.Black
      ? this.square?.rank == '7'
      : this.square?.rank == '2';
  }

  public get availableMoves(): Square[] {
    let { board, square, side } = this;

    if(!square || !board)
      return [];

    let moves: Square[] = [];
    let step = side == Side.Black ? 1 : -1;

    if(!this.pin || this.pin.direction.x == 0) {
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

    let left = square.displace(step, -1);
    let right = square.displace(step, 1);

    if(left && (left.piece?.side == this.oppositeSide || left == board.enPassant)) {
      moves.push(left);
    }

    if(right && (right.piece?.side == this.oppositeSide || right == board.enPassant)) {
      moves.push(right);
    }

    return moves;
  }
}

export class Knight extends Piece {
  public get availableMoves(): Square[] {

    if(!this.square || this.pin)
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
    this.square.displaces(directions).forEach(step => {
      if(step && (!step.piece || step.piece.side == this.oppositeSide))
        moves.push(step);
    });
    
    return moves;
  }

  public get symbol(): string {
    return this.side === Side.Black ? 'n' : 'N';
  }
}

export class Bishop extends Piece {
  public get availableMoves(): Square[] {

    if(!this.square)
      return [];

    let directions = [
      new Vector(1, 1),
      new Vector(-1, 1),
      new Vector(1, -1),
      new Vector(-1, -1),
    ]
    .filter(d => !this.pin || d.isParallelWith(this.pin.direction));

    let moves: Square[] = [];
    for(let i = 1; i < 8; i++) {
      let steps = this.square.displaces(directions, i);
      if(steps.length == 0)
        break;
      for(let [index, step] of steps.entries()) {
        if(step && (!step.piece || step.piece.side == this.oppositeSide))
          moves.push(step);
        if(!step || step.piece)
          delete directions[index];
      }
    }

    return moves;
  }
}

export class Rook extends Piece {
  public get availableMoves(): Square[] {

    if(!this.square)
      return [];

    let directions = [
      new Vector(1, 0),
      new Vector(-1, 0),
      new Vector(0, 1),
      new Vector(0, -1),
    ]
    .filter(d => !this.pin || d.isParallelWith(this.pin.direction));

    let moves: Square[] = [];
    for(let i = 1; i < 8; i++) {
      let steps = this.square.displaces(directions, i);
      if(steps.length == 0)
        break;
      for(let [index, step] of steps.entries()) {
        if(step && (!step.piece || step.piece.side == this.oppositeSide))
          moves.push(step);
        if(!step || step.piece)
          delete directions[index];
      }
    }

    return moves;
  }
}

export class Queen extends Piece {
  public get availableMoves(): Square[] {

    if(!this.square)
      return [];

    let directions = [
      new Vector(1, 0),
      new Vector(-1, 0),
      new Vector(0, 1),
      new Vector(0, -1),
      new Vector(1, 1),
      new Vector(-1, 1),
      new Vector(1, -1),
      new Vector(-1, -1),
    ]
    .filter(d => !this.pin || d.isParallelWith(this.pin.direction));

    let moves: Square[] = [];
    for(let i = 1; i < 8; i++) {
      let steps = this.square.displaces(directions, i);
      if(steps.length == 0)
        break;
      for(let [index, step] of steps.entries()) {
        if(step && (!step.piece || step.piece.side == this.oppositeSide))
          moves.push(step);
        if(!step || step.piece)
          delete directions[index];
      }
    }

    return moves;
  }
}

export class King extends Piece {
  public get availableMoves(): Square[] {

    if(!this.square || !this.board)
      return [];

    let directions = [
      new Vector(1, 0),
      new Vector(-1, 0),
      new Vector(0, 1),
      new Vector(0, -1),
      new Vector(1, 1),
      new Vector(-1, 1),
      new Vector(1, -1),
      new Vector(-1, -1),
    ];

    let moves: Square[] = [];
    this.square.displaces(directions).forEach(step => {
      if(step && (!step.piece || step.piece.side == this.oppositeSide))
        moves.push(step);
    });
    
    if(this.board.castling.canKingSide(this.side)) {
      let homeRank = this.side == Side.Black ? 0 : 7;
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

    if(this.board.castling.canQueenSide(this.side)) {
      let homeRank = this.side == Side.Black ? 0 : 7;
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
}