import { Board } from "../src/board";
import { Knight, Pawn } from "../src/pieces";

describe('Test enpassant move', () => {

  test('Real', () => {
    let board = new Board("r1bq1rk1/p2pbppp/2p5/2n1N3/3Pp3/P7/2P1QPPP/RNB1K2R b KQ d3 0 11");
    let pawn: Pawn = board.findSquare('e4')?.piece!;

    expect(pawn).toBeInstanceOf(Pawn);

    let moves = pawn.availableMoves.map(m => m.key);
    expect(moves.length).toBe(2);

    expect(moves).toContain('d3');
    expect(moves).toContain('e3');
  });
});