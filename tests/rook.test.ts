import { Board } from "../src/board";
import { Rook } from "../src/pieces";

describe('Test rook moves', () => {
  let board = new Board('knq2R1K/pp4R1/2p4R/2pr4/3b4/2R1PP1r/8/2r5 w - - 0 1');

  test('Moves', () => {
    let rook: Rook = board.findSquare('c3')?.piece!;
    
    expect(rook).toBeInstanceOf(Rook);

    let moves = rook.availableMoves.map(m => m.key);
    expect(moves.length).toBe(7);

    expect(moves).toContain('a3');
    expect(moves).toContain('b3');
    expect(moves).toContain('d3');
    expect(moves).toContain('c5');
    expect(moves).toContain('c4');
    expect(moves).toContain('c2');
    expect(moves).toContain('c1');
  });

  test('Pin file', () => {
    let rook: Rook = board.findSquare('h6')?.piece!;
    
    expect(rook).toBeInstanceOf(Rook);

    let moves = rook.availableMoves.map(m => m.key);
    expect(moves.length).toBe(4);
    
    expect(moves).toContain('h7');
    expect(moves).toContain('h5');
    expect(moves).toContain('h4');
    expect(moves).toContain('h3');
  });

  test('Pin rank', () => {
    let rook: Rook = board.findSquare('f8')?.piece!;
    
    expect(rook).toBeInstanceOf(Rook);

    let moves = rook.availableMoves.map(m => m.key);
    expect(moves.length).toBe(4);

    expect(moves).toContain('c8');
    expect(moves).toContain('d8');
    expect(moves).toContain('e8');
    expect(moves).toContain('g8');
  });

  test('Pin diagonal', () => {
    let rook: Rook = board.findSquare('g7')?.piece!;
    
    expect(rook).toBeInstanceOf(Rook);

    let moves = rook.availableMoves.map(m => m.key);
    expect(moves.length).toBe(0);
  });
});