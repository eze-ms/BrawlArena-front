import { useEffect, useState } from "react";
import CharacterList from "../components/CharacterList";
import type { Character } from "../types/character";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { API } from "../constants/api";

export default function Dashboard() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener personajes
        const resCharacters = await fetchWithAuth(API.characters.all);
        const characters: Character[] =
          resCharacters.status === 204 ? [] : await resCharacters.json();
        setCharacters(characters);
  
        // Obtener perfil actualizado
        const resUser = await fetchWithAuth(API.users.me);
        if (resUser.ok) {
          const userData = await resUser.json();
          setTokens(userData.tokens ?? 0); 
        } else {
          console.error("[Dashboard] Error al obtener usuario:", resUser.status);
        }
  
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
    <>
      {/* Nueva sección de tokens */}
      <div className="bg-blue-400 w-2/5 font-exo p-4 rounded-md">
        <p className="text-xl font-semibold text-blue-100">
          Tokens disponibles: {tokens}
        </p>
      </div>
     

      <div className="mt-10">
        <CharacterList
          characters={characters}
          setCharacters={setCharacters}
          tokens={tokens}
          setTokens={setTokens}
        />
      </div>
    </>
  );
}
