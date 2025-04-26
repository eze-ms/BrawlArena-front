// src/components/CharacterList.tsx

import { useNavigate } from "react-router-dom";
import type { Character } from "../types/character";
import { GiPadlock } from "react-icons/gi";
import tokenImg from "../assets/token.webp";

interface Props {
  characters: Character[];
}

export default function CharacterList({ characters }: Props) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {characters.map((character) => (
        <div
          key={character.id}
          onClick={() => {
            if (character.unlocked) navigate(`/game/${character.id}`);
          }}
          className={`group relative pt-72 pb-12 w-64 flex flex-col items-center shadow-lg card-corner-fold ${
            character.unlocked
              ? "bg-custom-hover cursor-pointer"
              : "bg-gray-600 grayscale opacity-60 backdrop-blur-sm"
          } rounded-tr-lg rounded-br-lg rounded-bl-lg`}
        >
          {!character.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-7xl z-20">
              <GiPadlock />
            </div>
          )}

          <img
            src={character.imageUrl}
            alt={character.name}
            className={`absolute top-0 -translate-y-12 w-full h-96 object-cover rounded-md z-10 transition-transform duration-300 ease-in-out ${
              character.unlocked 
                ? "group-hover:scale-105 overflow-hidden" 
                : "blur-xs"
            }`}
          />

          <div className="bg-custom-dateCharacter w-full p-3 flex justify-between items-center font-exo absolute z-10 opacity-85 font-bold text-pink-200">
            <h2 className="text-2xl text-pink-50 shadow-text">{character.name}</h2>
            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-400">{character.cost}</p>
              <img src={tokenImg} alt="token" className="w-7 h-7" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
