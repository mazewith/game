import { CreateRoomAttrs } from "@/interfaces";
import { client } from "../../client";
import { roomsByJoinsKey, roomsKey } from "../../keys";
import { deserialize } from "./deserialize";
import { serialize } from "./serialize";

export const getRoom = async (roomId: string) => {
  const room = await client.hGetAll(roomsKey(roomId));

  if (Object.keys(room).length === 0) {
    return null;
  }

  return deserialize(roomId, room);
};

export const getRooms = async (roomIds: string[]) => {
  const commands = roomIds.map((id) => client.hGetAll(roomsKey(id)));
  const results = await Promise.all(commands);

  return results.map((result, index) => {
    if (Object.keys(result).length === 0) {
      return null;
    }

    return deserialize(roomIds[index], result);
  });
};

export const createRoom = async (attrs: CreateRoomAttrs) => {
  const { id } = attrs;
  const serialized = serialize(attrs);

  await Promise.all([
    client.hSet(roomsKey(id), serialized),
    client.zAdd(roomsByJoinsKey(), {
      value: id,
      score: 0,
    }),
  ]);
};
