import { Board } from "../src/board";
const fs = require('fs');

describe("Test moves only", () => {
  let files = ['/moves/1.json'];
  for(let file of files) {
    test('Test from file ' + file, () => {
      let board = new Board();
      let content = JSON.parse(fs.readFileSync(__dirname + file));
      content.forEach((move: string) => {
        expect(() => board.move(move)).not.toThrowError();
      });
    });
  }
});