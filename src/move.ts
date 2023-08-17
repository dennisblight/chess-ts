import { Board } from "./board";
import { CastlingSide, CheckState, Side } from "./enums";
import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from "./pieces";
import { Square } from "./square";

export class Move {
  public readonly turn: Side;

  public readonly from: Square;

  public readonly to: Square;

  public readonly piece: Piece;

  public readonly capturedPiece?: Piece;

  public readonly isEnPassant: boolean = false;

  public readonly promotesTo?: Piece;

  public readonly castling?: CastlingMove;

  public readonly checkState?: CheckState;

  public readonly notation: string;

  constructor(board: Board, notation: string) {
    this.notation = notation;
    this.turn = board.turn;

    // console.debug(`Initial: ${notation}`);
    if('+#'.includes(notation[notation.length - 1])) {
      this.checkState = <CheckState> notation[notation.length - 1];
      notation = notation.substring(0, notation.length - 1);
      // console.debug(`After check: ${notation}`);
    }


    if(notation == CastlingSide.King || notation == CastlingSide.Queen) {
      let castling = new CastlingMove(board, notation);
      this.piece = castling.king;
      this.from = castling.king.square!;
      this.to = board.findSquare(castling.king.square!.row, castling.side == CastlingSide.King ? 6 : 2)!;
      this.castling = castling;
      return;
    }

    let promotesTo: string | undefined;
    if(notation[notation.length - 2] == '=') {
      promotesTo = notation[notation.length - 1];
      notation = notation.substring(0, notation.length - 2);
      // console.debug(`After promotes: ${notation}`);
    }

    let toKey = notation.substring(notation.length - 2);
    let to = board.findSquare(toKey);
    notation = notation.substring(0, notation.length - 2);
    // console.debug(`After extract from: ${notation}`);

    if(typeof to === 'undefined')
      throw new Error(`Could not find square ${toKey}`);

    let isCapturing = false;
    if(notation[notation.length - 1] == 'x') {
      this.capturedPiece = to.piece;
      isCapturing = true;
      notation = notation.substring(0, notation.length - 1);
      // console.debug(`After capturing: ${notation}`);
    }

    let sourcePiece = Pawn;
    if(Piece.isValidPiece(notation[0])) {
      switch(notation[0]) {
        case 'R': sourcePiece = Rook; break;
        case 'N': sourcePiece = Knight; break;
        case 'B': sourcePiece = Bishop; break;
        case 'Q': sourcePiece = Queen; break;
        case 'K': sourcePiece = King; break;
      }

      notation = notation.substring(1);
      // console.debug(`After extract source: ${notation}`);
    }
    
    let from: Square | undefined;
    if(notation.length == 2) {
      from = board.findSquare(notation);
    }
    else if(notation.length <= 1) {
      let rank = '1' <= notation && notation <= '8' ? notation : null;
      let file = 'a' <= notation && notation <= 'h' ? notation : null;

      // console.debug(`Find piece ${typeof sourcePiece} to: ${toKey}`);
      // console.debug(`Squares: ${board.squares.length}`);

      let froms = board.squares.filter(c => c.piece instanceof sourcePiece);
      // console.debug(`Squares (after filter type): ${froms.length}`);

      froms = froms.filter(c => c.piece?.side == this.turn);
      // console.debug(`Squares (after filter by side): ${froms.length}`);
      
      froms = froms.filter(c => (file === null || c.file == file));
      // console.debug(`Squares (after filter by file < ${file ?? '-'} >): ${froms.length}`);
      
      froms = froms.filter(c => (rank === null || c.rank == rank));
      // console.debug(`Squares (after filter by rank < ${rank ?? '-'} >): ${froms.length}`);
      
      froms = froms.filter(c => c.piece?.availableMoves.includes(to!));
      // console.debug(`Squares (after filter by availableMoves): ${froms.length}`);

      if(froms.length > 1)
        throw new Error("This notation found > 1 moves");
      else if(froms.length == 0)
        throw new Error("This notation found no moves");
      else from = froms[0];
    }

    if(typeof from === 'undefined')
      throw new Error(`Could not find square from notation ${notation}`);

    if(typeof from.piece === 'undefined')
      throw new Error(`Could not find piece from square ${from}`);
    
    // console.debug(`Final: ${notation}`);
    this.to = to;
    this.from = from;
    this.piece = from.piece;

    if(isCapturing) {
      if(!to.piece && from.piece instanceof Pawn) {
        // En passant
        let square = to.file + (this.turn == Side.Black ? '4' : '5');
        this.capturedPiece = board.findSquare(square)!.piece;
        this.isEnPassant = true;
      }
      else this.capturedPiece = to.piece;
    }

    if(typeof promotesTo === 'string') {
      this.promotesTo = Piece.createFromSymbol(
        this.turn === Side.Black
          ? promotesTo.toLowerCase()
          : promotesTo.toUpperCase(),
        board
      );
    }
  }
}

export class CastlingMove {

  public readonly side: CastlingSide;

  public readonly rook: Rook;

  public readonly king: King;

  constructor(board: Board, side: CastlingSide) {
    this.side = side;
    this.king = board.findKing(board.turn);
    let rook = side == CastlingSide.King
      ? board.findKingRook(board.turn)
      : board.findQueenRook(board.turn);

    if(typeof rook === 'undefined')
      throw new Error(`Could not find rook from ${side} of ${this.side}`);

    this.rook = rook;
  }
}