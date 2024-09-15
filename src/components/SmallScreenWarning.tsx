import { MINIMUM_HEIGHT, MINIMUM_WIDTH } from "@/constants";

export default function SmallScreenWarning() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center text-white">
      <h2>Screen size is too small to display the game.</h2>
      <br />
      <p>
        Please resize your window to a width greater than {MINIMUM_WIDTH} and a
        height greater than {MINIMUM_HEIGHT} to play the game.
      </p>
    </div>
  );
}
