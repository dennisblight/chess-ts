import { Board } from "../src/board";
import { Queen } from "../src/pieces";

describe('Test queen moves', () => {
  let board = new Board('knq2Q1K/pp4Q1/2p4Q/2pr4/3b4/2Q1PP1r/8/2r5 w - - 0 1');

  test('Moves', () => {
    let queen: Queen = board.findSquare('c3')?.piece!;
    
    expect(queen).toBeInstanceOf(Queen);

    let moves = queen.availableMoves.map(m => m.key);
    expect(moves.length).toBe(14);

    expect(moves).toContain('a3');
    expect(moves).toContain('b3');
    expect(moves).toContain('d3');
    expect(moves).toContain('c5');
    expect(moves).toContain('c4');
    expect(moves).toContain('c2');
    expect(moves).toContain('c1');
    expect(moves).toContain('a5');
    expect(moves).toContain('b4');
    expect(moves).toContain('d4');
    expect(moves).toContain('b2');
    expect(moves).toContain('a1');
    expect(moves).toContain('d2');
    expect(moves).toContain('e1');
  });

  test('Pin file', () => {
    let queen: Queen = board.findSquare('h6')?.piece!;
    
    expect(queen).toBeInstanceOf(Queen);

    let moves = queen.availableMoves.map(m => m.key);
    expect(moves.length).toBe(4);
    
    expect(moves).toContain('h7');
    expect(moves).toContain('h5');
    expect(moves).toContain('h4');
    expect(moves).toContain('h3');
  });

  test('Pin rank', () => {
    let queen: Queen = board.findSquare('f8')?.piece!;
    
    expect(queen).toBeInstanceOf(Queen);

    let moves = queen.availableMoves.map(m => m.key);
    expect(moves.length).toBe(4);

    expect(moves).toContain('c8');
    expect(moves).toContain('d8');
    expect(moves).toContain('e8');
    expect(moves).toContain('g8');
  });

  test('Pin diagonal', () => {
    let queen: Queen = board.findSquare('g7')?.piece!;
    
    expect(queen).toBeInstanceOf(Queen);

    let moves = queen.availableMoves.map(m => m.key);
    expect(moves.length).toBe(3);
    
    expect(moves).toContain('d4');
    expect(moves).toContain('e5');
    expect(moves).toContain('f6');
  });
});