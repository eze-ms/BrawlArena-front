import { Power } from "../types/piece";
import power1 from "../assets/hexagonal.webp";
import power2 from "../assets/prisma.webp";
import power3 from "../assets/hexagono.webp";

// Array de imágenes
const powerImages = [power1, power2, power3];

interface Props {
  power: Power;
  value: number;
}

export default function PowerProgressBar({ power, value }: Props) {
  const powerImage = powerImages[Object.keys(Power).indexOf(power as string) % powerImages.length];

  return (
    <div className="flex items-center gap-1 w-full">
      <img src={powerImage} alt={power} className="w-5 h-5 mr-1" />
      
      <div className="w-full bg-gradient-to-r from-[#feb840] to-[#fe2d6c] h-3 opacity-90 rounded">
        <div
          className="h-3 bg-violet-600 transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}
