import { client } from "../client";

export const incrementJoin = async (roomId: string, playerId: string) => {
  return client.incrementJoin(roomId, playerId);
};
