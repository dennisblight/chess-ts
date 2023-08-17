export enum Side {
  Black = 'b',
  White = 'w',
}

export enum CastlingSide {
  King = 'O-O',
  Queen = 'O-O-O',
}

export enum Direction {
  Top = 1,
  Bottom = 2,
  Vertical = Top | Bottom,

  Left = 4,
  Right = 8,
  Horizontal = Left | Right,

  Diagonal = 16,
  TopLeft = Top | Left | Diagonal,
  TopRight = Top | Right | Diagonal,
  BottomLeft = Bottom | Left | Diagonal,
  BottomRight = Bottom | Right | Diagonal,
}

export enum CheckState {
  Check = '+',
  CheckMate = '#',
}