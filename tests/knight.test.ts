import { Board } from "../src/board";
import { Knight } from "../src/pieces";

describe('Test knight moves', () => {
  let board = new Board('3R3R/k4N2/3P3P/1p1pP1Pq/p3pb1N/2N1N1N1/r3rN1K/1r1r4 w - - 0 1');

  test('Moves', () => {
    let knight: Knight = board.findSquare('e3')?.piece!;

    expect(knight).toBeInstanceOf(Knight);

    let moves = knight.availableMoves.map(m => m.key);
    expect(moves.length).toBe(8);

    expect(moves).toContain('c4');
    expect(moves).toContain('d5');
    expect(moves).toContain('f5');
    expect(moves).toContain('g4');
    expect(moves).toContain('g2');
    expect(moves).toContain('f1');
    expect(moves).toContain('d1');
    expect(moves).toContain('c2');
  });
  
  test('Full captures', () => {
    let knight: Knight = board.findSquare('c3')?.piece!;

    expect(knight).toBeInstanceOf(Knight);

    let moves = knight.availableMoves.map(m => m.key);
    expect(moves.length).toBe(8);

    expect(moves).toContain('a4');
    expect(moves).toContain('b5');
    expect(moves).toContain('d5');
    expect(moves).toContain('e4');
    expect(moves).toContain('e2');
    expect(moves).toContain('d1');
    expect(moves).toContain('b1');
    expect(moves).toContain('a2');
  });
  
  test('Blocked', () => {
    let knight: Knight = board.findSquare('f7')?.piece!;

    expect(knight).toBeInstanceOf(Knight);

    let moves = knight.availableMoves.map(m => m.key);
    expect(moves.length).toBe(0);
  });
  
  test('Pin file', () => {
    let knight: Knight = board.findSquare('h4')?.piece!;

    expect(knight).toBeInstanceOf(Knight);

    let moves = knight.availableMoves.map(m => m.key);
    expect(moves.length).toBe(0);
  });
  
  test('Pin rank', () => {
    let knight: Knight = board.findSquare('f2')?.piece!;

    expect(knight).toBeInstanceOf(Knight);

    let moves = knight.availableMoves.map(m => m.key);
    expect(moves.length).toBe(0);
  });
  
  test('Pin diagonal', () => {
    let knight: Knight = board.findSquare('g3')?.piece!;

    expect(knight).toBeInstanceOf(Knight);

    let moves = knight.availableMoves.map(m => m.key);
    expect(moves.length).toBe(0);
  });
});