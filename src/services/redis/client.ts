import { createClient, defineScript } from "redis";
import { roomsByJoinsKey, roomsKey, roomsJoinsKey } from "./keys";

const client = createClient({
  url: import.meta.env.VITE_REDIS_URL,
  password: import.meta.env.VITE_REDIS_PASSWORD,
  scripts: {
    incrementJoin: defineScript({
      NUMBER_OF_KEYS: 2,
      SCRIPT: `
        local roomsJoinsKey = KEYS[1]
        local roomsKey = KEYS[2]
        local roomsByJoinsKey = KEYS[3]
        local roomId = ARGV[1]
        local playerId = ARGV[2]

        local inserted = redis.call('PFADD', mazesPlaysKey, playerId)

        if inserted == 1 then
          redis.call('HINCRBY', mazesKey, 'plays', 1)
          redis.call('ZINCRBY', roomsByJoinsKey, 1, roomId)
        end
      `,
      transformArguments(roomId: string, playerId: string) {
        return [
          roomsJoinsKey(roomId),
          roomsKey(roomId),
          roomsByJoinsKey(),
          roomId,
          playerId,
        ];
      },
      transformReply() {},
    }),
  },
});

client.on("error", (err) => console.error("Redis Client Error", err));
client.connect();

export { client };
