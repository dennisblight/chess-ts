import { Board } from "../src/board";
import { Square } from "../src/square";

describe('Testing square properties', () => {
  let squares: Square[] = [];
  [...'87654321'].forEach(rank => {
    [...'abcdefgh'].forEach(file => {
      let key = file + rank;
      let square = new Square(key);
      squares.push(square);

      test(`square ${key} properties should match [${key}, ${file}, ${rank}, ${squares.indexOf(square)}]`, () => {
        expect(square.id).toBe(squares.indexOf(square));
        expect(square.key).toBe(key);
        expect(square.file).toBe(file);
        expect(square.rank).toBe(rank);
      });
    });
  });
});

describe('Testing board squares', () => {
  test(`square index should match board.square index`, () => {
    let board = new Board();
    board.squares.forEach((square, index) => {
      expect(square.id).toBe(index);
    });
  });
});