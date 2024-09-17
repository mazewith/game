import { createContext, useCallback, useContext, useState } from "react";
import { PlayersMap, Position, Progress, CreatePlayerDto } from "@/interfaces";
import { Redis } from "@/services/Redis";

type AddPlayer = (player: CreatePlayerDto) => void;

type UpdatePlayerPosition = (
  playerId: string,
  newPosition: Position,
  progress: Progress
) => void;

interface PlayerContextProps {
  players: PlayersMap;
  addPlayer: AddPlayer;
  updatePlayerPosition: UpdatePlayerPosition;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};

interface PlayerProviderProps {
  children: React.ReactNode;
  initialPlayers?: PlayersMap;
}

export const PlayerProvider = ({
  children,
  initialPlayers = {},
}: PlayerProviderProps) => {
  const [players, setPlayers] = useState<PlayersMap>(initialPlayers);

  const addPlayer: AddPlayer = useCallback((newPlayer) => {
    setPlayers((prevPlayers) => {
      if (prevPlayers[newPlayer.id]) return prevPlayers;
      return {
        ...prevPlayers,
        [newPlayer.id]: {
          ...newPlayer,
          position: { row: 0, col: 0 },
          progress: { steps: 0, completed: false },
        },
      };
    });
    Redis.incrementJoin(newPlayer.roomId, newPlayer.id);
  }, []);

  const updatePlayerPosition: UpdatePlayerPosition = useCallback(
    (playerId, newPosition, progress) => {
      setPlayers((prevPlayers) => {
        const player = prevPlayers[playerId];
        if (!player) return prevPlayers;
        return {
          ...prevPlayers,
          [playerId]: { ...player, position: newPosition, progress },
        };
      });
    },
    []
  );

  return (
    <PlayerContext.Provider
      value={{ players, addPlayer, updatePlayerPosition }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
