import { Board } from "../src/board";
import { Pawn } from "../src/pieces";

describe('Test pawn move moves', () => {
  let board = new Board('k7/4r3/8/1b1nPn1q/2P3P1/8/r2PKP1r/8 w - - 0 1');

  test('Pin rank 1', () => {
    let pawn: Pawn = board.findSquare('d2')?.piece!;

    expect(pawn).toBeInstanceOf(Pawn);

    let moves = pawn.availableMoves.map(m => m.key);
    expect(moves.length).toBe(0);
  });

  test('Pin rank 2', () => {
    let pawn: Pawn = board.findSquare('f2')?.piece!;

    expect(pawn).toBeInstanceOf(Pawn);

    let moves = pawn.availableMoves.map(m => m.key);
    expect(moves.length).toBe(0);
  });

  test('Pin file', () => {
    let pawn: Pawn = board.findSquare('e5')?.piece!;

    expect(pawn).toBeInstanceOf(Pawn);

    let moves = pawn.availableMoves.map(m => m.key);
    expect(moves.length).toBe(1);
    
    expect(moves).toContain('e6');
  });

  test('Pin diagonal 1', () => {
    let pawn: Pawn = board.findSquare('c4')?.piece!;

    expect(pawn).toBeInstanceOf(Pawn);

    let moves = pawn.availableMoves.map(m => m.key);
    expect(moves.length).toBe(1);
    
    expect(moves).toContain('b5');
  });

  test('Pin diagonal 2', () => {
    let pawn: Pawn = board.findSquare('g4')?.piece!;

    expect(pawn).toBeInstanceOf(Pawn);

    let moves = pawn.availableMoves.map(m => m.key);
    expect(moves.length).toBe(1);
    
    expect(moves).toContain('h5');
  });
});