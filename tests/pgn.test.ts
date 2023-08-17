import { Board } from "../src/board";
const fs = require('fs');

describe("Test moves", () => {
  let files = ['/pgn/1.json', '/pgn/2.json', '/pgn/3.json'];
  for(let file of files) {
    test('Test from file ' + file, () => {
      let board = new Board();
      let content = JSON.parse(fs.readFileSync(__dirname + file));
      content.forEach((item: { notation: string; fenstring: string; }) => {
        let move = item.notation;
        board.move(move);

        let expected = item.fenstring;
        let actual = board.fenstring;
        expect(actual.substring(0, expected.length)).toBe(expected);
      });
    });
  }
});