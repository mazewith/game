import { useEffect, useState } from "react";
import Instructions from "./Instructions";
import Player from "./Player";
import { usePlayerContext } from "@/context/PlayerContext";

export const Scoreboard = () => {
  const [scoreBoard, setScoreBoard] = useState<JSX.Element[]>([]);
  const { players } = usePlayerContext();

  useEffect(() => {
    // Sort by completed status first, then by steps
    const sortedPlayers = Object.values(players).sort((a, b) =>
      a.progress.completed !== b.progress.completed
        ? Number(b.progress.completed) - Number(a.progress.completed)
        : a.progress.steps - b.progress.steps
    );

    const displayList = sortedPlayers.map((player) => (
      <Player key={player.id} player={player} />
    ));
    setScoreBoard(displayList);
  }, [players]);

  return (
    <div className="overflow-hidden scrollbar-hide w-80">
      {scoreBoard.length > 0 ? scoreBoard : <Instructions />}
    </div>
  );
};
