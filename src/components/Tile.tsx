import { TILE_SIZE } from "@/constants";
import { CSSProperties } from "react";

interface TileProps {
  borders: string;
  style: CSSProperties;
}

export default function Tile({ borders, style }: TileProps) {
  return (
    <td className={borders} style={{ width: TILE_SIZE, height: TILE_SIZE }}>
      <div style={style} />
    </td>
  );
}
