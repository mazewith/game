import { PlayerSchema } from "@/interfaces";

interface PlayerProps {
  player: PlayerSchema;
}

export default function Player({ player }: PlayerProps) {
  const { color, name, progress } = player;
  const { completed, steps } = progress;

  const avatarStyle = {
    backgroundColor: color,
    filter: `brightness(${completed ? 0.5 : 1})`,
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg shadow-md">
      <div
        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-3xl"
        style={avatarStyle}
      >
        {completed && "✓"}
      </div>
      <div>
        <p className="text-lg font-semibold text-white">{name || "Player"}</p>
        <div className="text-sm text-gray-400">
          <span>Steps: {steps}</span>
          {completed && <span> - Completed!</span>}
        </div>
      </div>
    </div>
  );
}
