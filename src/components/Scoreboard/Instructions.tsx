import GatherImage from "@assets/Gather.jpg";
import ScanImage from "@assets/Scan.jpg";
import ControlImage from "@assets/Control.jpg";

export default function Instructions() {
  return (
    <div className="max-h-full overflow-auto text-center">
      <img
        className="max-h-[12rem] max-w-[12rem] m-auto object-contain"
        src={GatherImage}
        alt="figures in front of a screen"
        title="Gather around"
      />
      <p className="text-lg text-white">Gather everyone around this screen</p>
      <img
        className="max-h-[12rem] max-w-[12rem] m-auto object-contain"
        src={ScanImage}
        alt="qr code on a mobile screen"
        title="Scan QR code"
      />
      <p className="text-lg text-white">Scan the QR code on your phone</p>
      <img
        className="max-h-[12rem] max-w-[12rem] m-auto object-contain"
        src={ControlImage}
        alt="game controller buttons on mobile screen"
        title="Phone controller"
      />
      <p className="text-lg text-white">
        Control the character using your phone
      </p>
    </div>
  );
}
