import { ROOM_ID } from "@/constants";
import { useSearchParams } from "@/hooks/useSearchParams";
import { Room } from "@/interfaces";
import { createRoom, getRoom } from "@/services/redis/queries/rooms";
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

// Define RoomProvider Props type
interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider = ({ children }: RoomProviderProps) => {
  const searchParams = useSearchParams();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchOrCreateRoom = async () => {
      let currentRoom: Room;

      if (searchParams.roomId) {
        const result = await getRoom(searchParams.roomId);
        if (result) {
          currentRoom = result;
        } else {
          currentRoom = {
            id: searchParams.roomId,
            createdAt: new Date(),
            joins: 0,
            completes: 0,
          };
          await createRoom(currentRoom);
        }
      } else {
        currentRoom = {
          id: ROOM_ID,
          createdAt: new Date(),
          joins: 0,
          completes: 0,
        };
        await createRoom(currentRoom);
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
