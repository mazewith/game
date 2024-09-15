import Icon from "/favicon.ico";
import { CONTROLLER_URL, ROOM_ID } from "@/constants";
import { useSearchParams } from "@/hooks/useSearchParams";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export default function Header() {
  const { roomId } = useSearchParams();
  const [qrCodeUrl] = useState(
    `${CONTROLLER_URL}/?roomId=${roomId ? roomId : ROOM_ID}`
  );

  return (
    <header className="flex items-center justify-between p-4 mx-10">
      <img
        src={Icon}
        alt="Icon"
        className="w-1/3 h-1/3 max-w-[200px] max-h-[200px]"
      />
      <h2 className="text-2xl font-bold text-center text-indigo-50">
        Scan the QR code on the right to play on your mobile device!
      </h2>
      <a href={qrCodeUrl} target="_blank">
        <QRCodeSVG
          value={qrCodeUrl}
          size={200}
          className="border-8 rounded-2xl border-blue-500 max-w-[100px] max-h-[100px] md:max-w-[200px] md:max-h-[200px]"
        />
      </a>
    </header>
  );
}
