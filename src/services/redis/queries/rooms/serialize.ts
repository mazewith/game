import { CreateRoomAttrs } from "@/interfaces";

export const serialize = (attrs: CreateRoomAttrs) => {
  return {
    ...attrs,
    createdAt: Math.floor(attrs.createdAt.valueOf() / 1000),
  };
};
