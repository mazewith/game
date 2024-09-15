import { Room } from "@/interfaces";

export const deserialize = (id: string, room: Record<string, string>): Room => {
  return {
    id,
    createdAt: new Date(parseInt(room.createdAt) * 1000),
    joins: parseInt(room.views),
    completes: parseInt(room.completes),
  };
};
