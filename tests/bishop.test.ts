import { Board } from "../src/board";
import { Bishop } from "../src/pieces";

describe('Test bishop moves', () => {
  let board = new Board('8/k2K1B1q/8/p2BPB2/8/2Br3b/3p4/4p3 w - - 0 1');

  test('Moves', () => {
    let bishop: Bishop = board.findSquare('c3')?.piece!;
    
    expect(bishop).toBeInstanceOf(Bishop);

    let moves = bishop.availableMoves.map(m => m.key);
    expect(moves.length).toBe(6);

    expect(moves).toContain('b4');
    expect(moves).toContain('a5');
    expect(moves).toContain('d4');
    expect(moves).toContain('d2');
    expect(moves).toContain('b2');
    expect(moves).toContain('a1');
  });

  test('Pin file', () => {
    let bishop: Bishop = board.findSquare('d5')?.piece!;
    
    expect(bishop).toBeInstanceOf(Bishop);

    let moves = bishop.availableMoves.map(m => m.key);
    expect(moves.length).toBe(0);
  });

  test('Pin rank', () => {
    let bishop: Bishop = board.findSquare('f7')?.piece!;
    
    expect(bishop).toBeInstanceOf(Bishop);

    let moves = bishop.availableMoves.map(m => m.key);
    expect(moves.length).toBe(0);
  });

  test('Pin diagonal', () => {
    let bishop: Bishop = board.findSquare('f5')?.piece!;
    
    expect(bishop).toBeInstanceOf(Bishop);

    let moves = bishop.availableMoves.map(m => m.key);
    expect(moves.length).toBe(3);
    
    expect(moves).toContain('e6');
    expect(moves).toContain('g4');
    expect(moves).toContain('h3');
  });
});