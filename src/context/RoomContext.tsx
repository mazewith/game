import { ROOM_ID } from "@/constants";
import { useSearchParams } from "@/hooks/useSearchParams";
import { RoomConfig } from "@/interfaces";
import { createContext, useContext, useMemo, ReactNode } from "react";

const RoomContext = createContext<RoomConfig | undefined>(undefined);

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};

// Define RoomProvider Props type
interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider = ({ children }: RoomProviderProps) => {
  const searchParams = useSearchParams();

  const roomConfig = useMemo(
    () => ({
      id: searchParams.roomId || ROOM_ID,
    }),
    [searchParams]
  );

  return (
    <RoomContext.Provider value={roomConfig}>{children}</RoomContext.Provider>
  );
};
