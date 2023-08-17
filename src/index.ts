import { Board } from "./board";
import { Castling } from "./castling";
import * as Enums from "./enums";
import { CastlingMove, Move } from "./move";
import * as Pieces from "./pieces";
import { Square } from "./square";
import { Vector } from "./vector";

declare global {
  interface Window { chess: any; }
}

if(typeof window !== 'undefined')
  window.chess = { Board, Pieces, Square, Enums, Castling, Vector, Move, CastlingMove };

export { Board, Pieces, Square, Enums, Castling, Vector, Move, CastlingMove }