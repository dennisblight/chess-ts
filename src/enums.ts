export const enum Side {
  Black = 'b',
  White = 'w',
}

export const enum CastlingSide {
  King = 1,
  Queen = 2,
}

export enum Direction {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
  Diagonal = 16,
  TopLeft = Top | Left | Diagonal,
  TopRight = Top | Right | Diagonal,
  BottomLeft = Bottom | Left | Diagonal,
  BottomRight = Bottom | Right | Diagonal,
}