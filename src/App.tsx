import BackgroundImage from "@assets/Background_2.jpg";
import { useEffect, useState } from "react";
import { MINIMUM_HEIGHT, MINIMUM_WIDTH } from "./constants";
import SmallScreenWarning from "./components/SmallScreenWarning";
import { PlayerProvider } from "./context/PlayerContext";
import GameScreen from "./components/GameScreen";

export default function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isScreenBigEnough =
    windowSize.width >= MINIMUM_WIDTH && windowSize.height >= MINIMUM_HEIGHT;

  return (
    <div className="min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 blur-sm"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />
      <div className="relative">
        {isScreenBigEnough ? (
          <PlayerProvider>
            <GameScreen />
          </PlayerProvider>
        ) : (
          <SmallScreenWarning />
        )}
      </div>
    </div>
  );
}
