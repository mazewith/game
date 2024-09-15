import { Maze as MazeInterface, WallState, Direction } from "@/interfaces";
import { CSSProperties, useCallback } from "react";
import Tile from "./Tile";
import { usePlayerContext } from "@/context/PlayerContext";

interface MazeProps {
  maze: MazeInterface;
}

export default function Maze({ maze }: MazeProps) {
  const { players } = usePlayerContext();

  // Create borders based on maze cell walls
  const getTileBorders = (row: number, col: number): string => {
    const borders = new Set<string>();
    const cell = maze[row][col];

    if (cell.walls[Direction.Up] === WallState.Closed)
      borders.add("border-t-2 border-white");
    if (cell.walls[Direction.Right] === WallState.Closed)
      borders.add("border-r-2 border-white");
    if (cell.walls[Direction.Down] === WallState.Closed)
      borders.add("border-b-2 border-white");
    if (cell.walls[Direction.Left] === WallState.Closed)
      borders.add("border-l-2 border-white");

    return Array.from(borders).join(" ");
  };

  // Determine style for a specific tile based on whether it's a player or destination
  const getTileStyle = (row: number, col: number): CSSProperties => {
    // Check if it's the destination
    if (isDestinationTile(row, col)) {
      return destinationTileStyle();
    }

    // Check if a player is on the current tile
    const playerOnTile = getPlayerOnTile(row, col);
    if (playerOnTile) {
      return playerTileStyle(playerOnTile.color);
    }

    // Default empty style
    return {};
  };

  // Check if a cell is the destination
  const isDestinationTile = useCallback(
    (row: number, col: number): boolean =>
      row === maze.length - 1 && col === maze[0].length - 1,
    [maze]
  );

  // Return style for destination tile
  const destinationTileStyle = useCallback(
    (): CSSProperties => ({
      backgroundColor: "rgb(34, 197, 94)",
      height: "100%",
      width: "100%",
      display: "block",
    }),
    []
  );

  // Return style for player's tile
  const playerTileStyle = useCallback(
    (color: string): CSSProperties => ({
      backgroundColor: color,
      borderRadius: "9999px",
      height: "100%",
      width: "100%",
      display: "block",
    }),
    []
  );

  // Find the player currently positioned on a given tile
  const getPlayerOnTile = useCallback(
    (row: number, col: number) =>
      Object.values(players).find(
        (player) => player.position.row === row && player.position.col === col
      ),
    [players]
  );

  return (
    <div className="flex flex-1 justify-center items-center">
      <div>
        <table className="border-collapse bg-gray-800 border-2 border-white">
          <tbody>
            {maze.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((_, colIndex) => (
                  <Tile
                    key={`cell-${rowIndex}-${colIndex}`}
                    borders={getTileBorders(rowIndex, colIndex)}
                    style={getTileStyle(rowIndex, colIndex)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
