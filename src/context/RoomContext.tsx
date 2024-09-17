import { ROOM_ID } from "@/constants";
import { useSearchParams } from "@/hooks/useSearchParams";
import { Room } from "@/interfaces";
import { Redis } from "@/services/Redis";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

const RoomContext = createContext<Room | undefined>(undefined);

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};

interface RoomProviderProps {
  children: ReactNode;
}

// Utility function to create a default room object
const createDefaultRoom = (roomId: string): Room => ({
  id: roomId,
  createdAt: Date.now(),
  joins: 0,
  completes: 0,
});

export const RoomProvider = ({ children }: RoomProviderProps) => {
  const searchParams = useSearchParams();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchOrCreateRoom = async () => {
      const roomId = searchParams.roomId || ROOM_ID;
      const existingRoom = await Redis.getRoom(roomId);

      const currentRoom = existingRoom || createDefaultRoom(roomId);

      if (!existingRoom) {
        await Redis.createRoom(currentRoom);
      }

      setRoom(currentRoom);
    };

    fetchOrCreateRoom();
  }, [searchParams]);

  if (!room) {
    return <div>Loading...</div>;
  }

  return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
};
