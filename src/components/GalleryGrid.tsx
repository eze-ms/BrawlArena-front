import tokenImg from "../assets/token.webp";
import type { SharedModel } from "../types/SharedModel";


interface Props {
  models: SharedModel[];
  characterImages: Record<string, string>;
}

export default function GalleryGrid({ models, characterImages }: Props) {
  if (models.length === 0) {
    return <p className="text-pink-300 italic">No hay modelos compartidos aún.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 font-exo">
      {models.map((model) => {
        const image = characterImages[model.characterId] || "";

        return (
          <div
            key={model.id}
            className="relative w-60 h-[340px] transform hover:scale-105 transition duration-300"
            style={{
              clipPath: 'polygon(10% 0, 100% 0%, 90% 100%, 0% 100%)',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0" />
        
          {/* Nombre y subtítulo */}
          <div className="absolute top-4 left-4 transform -skew-x-6 shadow-md">
            <h2 className="bg-yellow-500 text-black text-sm font-semibold uppercase leading-tight px-3 py-1">
              {model.playerId}
            </h2>
          </div>

        
          {/* Precio */}
          <div className="absolute bottom-10 left-1 flex flex-col space-y-2 w-2/4">
            <div className="bg-custom-dateCharacter shadow-text2 text-white text-sm font-bold py-1 text-center shadow-md flex items-center justify-center gap-2 transform -skew-x-6">
              <img src={tokenImg} alt="token" className="w-4 h-4" />
              {model.score} THC
            </div>
          </div>
        
          {/* Fecha abajo a la izquierda */}
          <div className="absolute bottom-2 left-0 transform -skew-x-6 shadow-md">
            <p className="shadow-text2 bg-white bg-opacity-20 text-white text-xs px-3 py-1 transform skew-x-10">
              {new Date(model.sharedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        
        );
      })}
    </div>
  );
}
