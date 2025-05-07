import { useEffect, useState } from "react";
import CharacterList from "../components/CharacterList";
import type { Character } from "../types/character";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { API } from "../constants/api";
import tokenImg from "../assets/token.webp";


export default function Dashboard() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Paso 1: Obtener todos los personajes
        const resCharacters = await fetchWithAuth(API.characters.all);
        const allCharacters: Character[] =
          resCharacters.status === 204 ? [] : await resCharacters.json();
  
        let unlockedIds: string[] = [];
  
        // Paso 2: Verificar si el usuario está autenticado
        const resUser = await fetchWithAuth(API.users.me);
        if (resUser.ok) {
          const userData = await resUser.json();
          setTokens(userData.tokens ?? 0);
  
          // Paso 3: Obtener personajes desbloqueados
          const resUnlocked = await fetchWithAuth(API.characters.unlocked);
          if (resUnlocked.status === 200) {
            const unlockedCharacters: Character[] = await resUnlocked.json();
            console.log("[Dashboard] Unlocked characters:", unlockedCharacters);

            unlockedIds = unlockedCharacters.map((c) => c.id);
          } else if (resUnlocked.status === 204) {
            unlockedIds = [];
          } else {
            console.warn("[Dashboard] Error al obtener personajes desbloqueados:", resUnlocked.status);
          }
        }
  
        // Paso 4: Fusión — marcar los desbloqueados
        const mergedCharacters = allCharacters.map((char) =>
          unlockedIds.includes(char.id)
            ? { ...char, unlocked: true }
            : { ...char, unlocked: false }
        );
  
        setCharacters(mergedCharacters);
      } catch (err) {
        console.error("[Dashboard] Error al obtener datos:", err);
        setError("No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  
  if (loading) return <p className="text-white">Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex-1 max-w-screen-2xl mx-auto p-5 mt-20 mb-16">
      {/* Nueva sección de tokens */}
      <div className="bg-purple-600 w-full md:w-1/3 font-exo p-2 rounded-sm transform -skew-x-6 flex justify-center items-center">
        <p className="text-xl font-semibold text-white shadow-text2 mr-1">
          Disponibles: {tokens}
        </p>
        <img src={tokenImg} alt="token" className="w-6 h-6" />
      </div>
     

      <div className="mt-10">
        <CharacterList
          characters={characters}
          setCharacters={setCharacters}
          tokens={tokens}
          setTokens={setTokens}
        />
      </div>
    </div>
  );
}
