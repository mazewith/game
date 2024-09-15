import { Room } from "@/interfaces";
import { client } from "../../client";
import { roomsByJoinsKey, roomsKey } from "../../keys";
import { deserialize } from "./deserialize";

// Return a list of mazes sorted by the number of plays
export const roomsByJoins = async (
  order: "ASC" | "DESC" = "DESC",
  offset = 0,
  count = 5
) => {
  let results = await client.sort(roomsByJoinsKey(), {
    GET: [
      "#", // roomId
      `${roomsKey("*")}->id`,
      `${roomsKey("*")}->joins`,
    ],
    BY: "nosort",
    DIRECTION: order,
    LIMIT: { offset, count },
  });

  const rooms: Room[] = [];
  while (results.length) {
    const [roomId, plays, ...rest] = results;
    const room = deserialize(roomId, { roomId, plays });
    rooms.push(room);
    results = rest;
  }

  return rooms;
};
