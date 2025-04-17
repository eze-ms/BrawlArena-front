// src/components/CharacterList.tsx

import type { Character } from "../types/character";

interface Props {
  characters: Character[];
}

export default function CharacterList({ characters }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character) => (
        <div
          key={character.id}
          className="bg-white rounded-xl overflow-hidden shadow-lg p-4 flex flex-col"
        >
          <img
            src={character.imageUrl}
            alt={character.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <h2 className="text-xl font-bold mt-3">{character.name}</h2>
          <p className="text-sm text-gray-600">Nivel: {character.difficulty}</p>
          <p className="text-sm text-gray-500">Precio: {character.cost} tokens</p>

          <button
            disabled={false}
            className={`mt-auto px-4 py-2 rounded-md text-sm font-semibold ${
              character.unlocked
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            {character.unlocked ? "Usar Personaje" : "Desbloquear"}
          </button>
        </div>
      ))}
    </div>
  );
}
