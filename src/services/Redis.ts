import { Room } from "@/interfaces";

const API = import.meta.env.VITE_REDIS_URL;

export const Redis = {
  async createRoom(attrs: Room) {
    fetch(`${API}/room`, {
      method: "POST",
      body: JSON.stringify(attrs),
    });
  },
  async incrementJoin(roomId: string, playerId: string) {
    try {
      await fetch(`${API}/room/increment/${roomId}`, {
        method: "PATCH",
        body: JSON.stringify({ playerId }),
      });
    } catch (error) {
      console.error(error);
    }
  },
  async getRoom(roomId: string): Promise<Room> {
    return (await fetch(`${API}/room/${roomId}`)).json();
  },
};
