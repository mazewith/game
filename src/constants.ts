import { v4 as uuidv4 } from "uuid";

export const TILE_SIZE = 40;

export const MINIMUM_WIDTH = 900;
export const MINIMUM_HEIGHT = 600;

export const COLUMNS = 15;
export const ROWS = 15;
export const TICK = 300;
export const ROOM_ID = uuidv4();

export const CONTROLLER_URL = `https://controller.mazewith.me`;

// Params:
export const SEARCH_PARAMS = {
  ROOM_ID: "roomId",
  SEED: "seed",
};
