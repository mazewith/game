import Header from "@/components/Header";
import { Scoreboard } from "@/components/Scoreboard";
import MazeView from "@/components/Maze";
import { usePlayerContext } from "@/context/PlayerContext";
import { useEffect, useState, useRef } from "react";
import FirebaseService from "@/services/FirebaseService";
import { ControlSchema, Direction, Position } from "@/interfaces";
import Maze from "@/logic/maze";
import { useRoomContext } from "@/context/RoomContext";

export default function GameScreen() {
  const { players, updatePlayerPosition, addPlayer } = usePlayerContext();
  const { id: roomId } = useRoomContext();
  const [mazeInstance] = useState(Maze.getInstance({ roomId }));

  // Using useRef to hold the latest players value without causing re-renders
  const playersRef = useRef(players);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    const dataService = new FirebaseService(roomId);

    const move = (controlSchema: ControlSchema) => {
      const player = playersRef.current[controlSchema.playerId];
      if (!player || player.progress.completed) return;
      const { row, col } = player.position;
      let newPosition: Position;

      if (mazeInstance.isMovable(player.position, controlSchema.direction)) {
        switch (controlSchema.direction) {
          case Direction.Up:
            newPosition = { row: row - 1, col: col };
            break;
          case Direction.Down:
            newPosition = { row: row + 1, col: col };
            break;
          case Direction.Left:
            newPosition = { row: row, col: col - 1 };
            break;
          case Direction.Right:
            newPosition = { row: row, col: col + 1 };
            break;
        }
        player.position = newPosition;
        player.progress.steps += 1;
        if (mazeInstance.isExit(newPosition)) {
          player.progress.completed = true;
        }
        updatePlayerPosition(player.id, player.position, player.progress);
      }
    };

    dataService.on(dataService.addPlayerEvent, addPlayer);
    dataService.on(dataService.playerMoveEvent, move);
    dataService.connect();

    return () => {
      dataService.disconnect();
    };
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-row justify-center px-10">
        <Scoreboard />
        <MazeView maze={mazeInstance.getMaze()} />
      </div>
    </div>
  );
}
