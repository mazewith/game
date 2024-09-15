import { COLUMNS, ROWS } from "@/constants";
import {
  MazeSize,
  Maze as MazeSchema,
  Direction,
  Position,
  WallState,
} from "@/interfaces";
import prand from "pure-rand";

export default class Maze {
  private static instance: Maze;
  private maze: MazeSchema;

  private constructor(
    private size: MazeSize,
    private seed: number = Date.now() ^ (Math.random() * 0x100000000)
  ) {
    this.maze = this.generateMaze();
  }

  public static getInstance({
    size = { rows: ROWS, columns: COLUMNS },
    roomId,
  }: {
    size?: MazeSize;
    roomId?: string;
  }): Maze {
    if (!Maze.instance) {
      const seed = roomId
        ? roomId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        : undefined;
      Maze.instance = new Maze(size, seed);
    }
    return Maze.instance;
  }

  /**
   * Returns the generated maze grid.
   */
  public getMaze(): MazeSchema {
    return this.maze;
  }

  /**
   * Checks if a move is possible from the given position in the specified direction.
   * @param position The current position.
   * @param direction The direction to move.
   * @returns True if the move is possible; otherwise, false.
   */
  public isMovable(position: Position, direction: Direction): boolean {
    const { row, col } = position;
    if (!this.isInBounds(row, col)) {
      return false;
    }
    const cell = this.maze[row][col];
    return cell.walls[direction] === WallState.Open;
  }

  public isExit(position: Position): boolean {
    const { row, col } = position;
    const { rows, columns } = this.size;
    return row === rows - 1 && col === columns - 1;
  }

  // Check if the position is within maze bounds
  private isInBounds(row: number, col: number): boolean {
    const { rows, columns } = this.size;
    return row >= 0 && row < rows && col >= 0 && col < columns;
  }

  // Helper function to initialize the maze with closed walls
  private initializeMaze(rows: number, columns: number): MazeSchema {
    return Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({
        walls: {
          [Direction.Up]: WallState.Closed,
          [Direction.Down]: WallState.Closed,
          [Direction.Left]: WallState.Closed,
          [Direction.Right]: WallState.Closed,
        },
      }))
    );
  }

  // Generates the maze using the recursive backtracking algorithm.
  private generateMaze() {
    const { rows, columns } = this.size;
    let rng = prand.xoroshiro128plus(this.seed);

    const randomInt = (min = 0, max = 1) => {
      const distribution = prand.uniformIntDistribution(min, max);
      const [value, nextRng] = distribution(rng);
      rng = nextRng;
      return value;
    };

    const maze: MazeSchema = this.initializeMaze(rows, columns);
    const visited: boolean[][] = Array.from({ length: rows }, () =>
      Array(columns).fill(false)
    );

    const directions: Direction[] = [
      Direction.Up,
      Direction.Down,
      Direction.Left,
      Direction.Right,
    ];

    // Recursive Backtracking Algorithm
    const carvePassagesFrom = (currentPosition: Position) => {
      const { row, col } = currentPosition;
      visited[row][col] = true;

      const localDirections = directions.slice(); // Create a copy for shuffling

      // Shuffle localDirections
      for (let i = localDirections.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        [localDirections[i], localDirections[j]] = [
          localDirections[j],
          localDirections[i],
        ];
      }

      for (const direction of localDirections) {
        const nextPosition = this.getNextPosition(currentPosition, direction);

        if (
          this.isInBounds(nextPosition.row, nextPosition.col) &&
          !visited[nextPosition.row][nextPosition.col]
        ) {
          // Remove walls between current and next cell
          maze[row][col].walls[direction] = WallState.Open;
          const oppositeDirection = this.getOppositeDirection(direction);
          maze[nextPosition.row][nextPosition.col].walls[oppositeDirection] =
            WallState.Open;

          carvePassagesFrom(nextPosition);
        }
      }
    };

    const start: Position = { row: 0, col: 0 };
    carvePassagesFrom(start);

    return maze;
  }

  // Get the opposite direction
  private getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
      case Direction.Up:
        return Direction.Down;
      case Direction.Right:
        return Direction.Left;
      case Direction.Down:
        return Direction.Up;
      case Direction.Left:
        return Direction.Right;
      default:
        throw new Error("Invalid direction");
    }
  }

  // Calculate the next position based on the current position and direction
  private getNextPosition(position: Position, direction: Direction): Position {
    const { row, col } = position;
    switch (direction) {
      case Direction.Up:
        return { row: row - 1, col };
      case Direction.Down:
        return { row: row + 1, col };
      case Direction.Left:
        return { row, col: col - 1 };
      case Direction.Right:
        return { row, col: col + 1 };
      default:
        throw new Error("Invalid direction");
    }
  }
}
