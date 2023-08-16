import { Board } from "../src/board";
import { Side } from "../src/enums";
import { Pawn } from "../src/pieces";

describe('Test pawn moves', () => {
  let board = new Board('k1p4R/pp4pp/4p2p/R2BNQ2/r2bnq2/4P2P/PP4PP/K1P4r w - - 0 1');
  
  test('Home rank', () => {
    {
      let pawn: Pawn = board.findSquare('g2')?.piece!;

      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.White);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(2);
      expect(moves).toContain('g3');
      expect(moves).toContain('g4');
    }
    {
      let pawn: Pawn = board.findSquare('g7')?.piece!;

      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.Black);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(2);
      expect(moves).toContain('g6');
      expect(moves).toContain('g5');
    }
  });
  
  test('Non home rank', () => {
    {
      let pawn: Pawn = board.findSquare('h3')?.piece!;

      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.White);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(1);
      expect(moves).toContain('h4');
    }
    {
      let pawn: Pawn = board.findSquare('h6')?.piece!;

      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.Black);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(1);
      expect(moves).toContain('h5');
    }
  });

  test('Blocked', () => {
    {
      let pawn: Pawn = board.findSquare('h2')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.White);

      let moves = pawn.availableMoves;
      expect(moves.length).toBe(0);
    }
    {
      let pawn: Pawn = board.findSquare('h7')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.Black);

      let moves = pawn.availableMoves;
      expect(moves.length).toBe(0);
    }
  });

  test('Capture', () => {
    {
      let pawn: Pawn = board.findSquare('e3')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.White);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(2);

      expect(moves).toContain('d4');
      expect(moves).toContain('f4');
    }
    {
      let pawn: Pawn = board.findSquare('e6')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.Black);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(2);

      expect(moves).toContain('d5');
      expect(moves).toContain('f5');
    }
  });

  test('Pinned file', () => {
    {
      let pawn: Pawn = board.findSquare('a2')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.White);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(1);

      expect(moves).toContain('a3');
    }
    {
      let pawn: Pawn = board.findSquare('a7')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.Black);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(1);

      expect(moves).toContain('a6');
    }
  });

  test('Pinned rank', () => {
    {
      let pawn: Pawn = board.findSquare('c1')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.White);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(0);
    }
    {
      let pawn: Pawn = board.findSquare('c8')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.Black);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(0);
    }
  });

  test('Pinned diagonal', () => {
    {
      let pawn: Pawn = board.findSquare('b2')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.White);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(0);
    }
    {
      let pawn: Pawn = board.findSquare('b7')?.piece!;
      
      expect(pawn).toBeInstanceOf(Pawn);
      expect(pawn.side).toBe(Side.Black);

      let moves = pawn.availableMoves.map(m => m.key);
      expect(moves.length).toBe(0);
    }
  });
});