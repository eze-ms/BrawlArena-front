import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Character } from "../types/character";
import { GiPadlock } from "react-icons/gi";
import tokenImg from "../assets/token.webp";
import { API } from "../constants/api";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import UnlockCharacterModal from "../components/UnlockCharacterModal";

interface Props {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  tokens: number;
  setTokens: React.Dispatch<React.SetStateAction<number>>;
}

export default function CharacterList({ characters, setCharacters, tokens, setTokens }: Props) {
  const navigate = useNavigate();

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [errorUnlock, setErrorUnlock] = useState<string | null>(null);

  const handleCharacterClick = (character: Character) => {
    if (character.unlocked) {
      navigate(`/game/${character.id}`);
    } else {
      setSelectedCharacter(character);
      setIsModalOpen(true);
    }
  };

  const handleConfirmUnlock = async () => {
    if (!selectedCharacter) return;

    if (tokens < selectedCharacter.cost) {
      setErrorUnlock("No tienes tokens suficientes.");
      return;
    }

    setIsUnlocking(true);
    setErrorUnlock(null);

    try {
      const res = await fetchWithAuth(`${API.characters.unlock}?characterId=${selectedCharacter.id}`, { method: "POST" });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al desbloquear personaje.");
      }

      const userRes = await fetchWithAuth(API.users.me);
      if (userRes.ok) {
        const userData = await userRes.json();
        setTokens(userData.tokens ?? 0);
      }

      setCharacters((prev) =>
        prev.map((c) => (c.id === selectedCharacter.id ? { ...c, unlocked: true } : c))
      );

      setIsModalOpen(false);
      setSelectedCharacter(null);

    } catch (err) {
      console.error("[CharacterList] Error al desbloquear personaje:", err);
      setErrorUnlock("Error inesperado");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleCancelUnlock = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
    setErrorUnlock(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {characters.map((character) => (
        <div
          key={character.id}
          onClick={() => handleCharacterClick(character)}
          className={`group relative pt-72 pb-12 w-64 flex flex-col items-center card-corner-fold ${
            character.unlocked
              ? "bg-custom-hover cursor-pointer"
              : "bg-gray-600 grayscale opacity-60 backdrop-blur-sm cursor-pointer"
          } rounded-tr-lg rounded-br-lg rounded-bl-lg`}
        >
          {!character.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-7xl z-20 transition-transform duration-300 group-hover:scale-110">
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

      {/* Modal de desbloqueo */}
      {isModalOpen && selectedCharacter && (
        <UnlockCharacterModal
          isOpen={isModalOpen}
          character={selectedCharacter}
          userTokens={tokens}
          onConfirm={handleConfirmUnlock}
          onCancel={handleCancelUnlock}
          isLoading={isUnlocking}
          error={errorUnlock}
          tokenImg={tokenImg}
        />
      )}
    </div>
  );
}