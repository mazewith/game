// Direction enum with string values for better readability
export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

/**
 * Represents a player's state in the game.
 */
export interface PlayerSchema {
  id: string;
  name: string;
  color: string;
  roomId: string;
  position: Position;
  progress: Progress;
}

export interface CreatePlayerDto {
  id: string;
  name: string;
  color: string;
  roomId: string;
}

export interface ControlSchema {
  roomId: string;
  playerId: string;
  direction: Direction;
  timestamp: number;
}

export type PlayersMap = Record<string, PlayerSchema>;

export interface Position {
  row: number;
  col: number;
}

export interface Progress {
  steps: number;
  completed: boolean;
}

// WallState enum to represent the presence or absence of walls
export enum WallState {
  Open = 0,
  Closed = 1,
}

// WallState enum to represent the presence or absence of walls
export interface MazeCell {
  walls: {
    [key in Direction]: WallState;
  };
}
/**
 * Represents a 2D maze grid.
 *
 * The maze is a 2D array, where each element is a `MazeCell`, representing
 * a single cell in the maze with walls on the north, east, south, and west sides.
 */
export type Maze = MazeCell[][];

export interface MazeSize {
  rows: number;
  columns: number;
}

export interface Room {
  id: string;
  createdAt: Date;
  joins: number;
  completes: number;
}

export interface CreateRoomAttrs {
  id: string;
  createdAt: Date;
  joins: number;
  completes: number;
}
