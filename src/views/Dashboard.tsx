import { useEffect, useState } from "react";
import CharacterList from "../components/CharacterList";
import type { Character } from "../types/character";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { API } from "../constants/api";

export default function Dashboard() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetchWithAuth(API.characters.all);
        const characters: Character[] =
          res.status === 204 ? [] : await res.json();
  
        setCharacters(characters);
      } catch (err) {
        console.error("[Dashboard] Error al obtener personajes:", err);
        setError("No se pudieron cargar los personajes");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCharacters();
  }, []);
  

  if (loading) return <p className="text-white">Cargando personajes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <h1 className="text-5xl font-bold">Mis personajes</h1>
      <p className="text-2xl font-light text-white mt-5">Administra tus personajes</p>
      <div className="mt-10">
        <CharacterList characters={characters} />
      </div>
    </>
  );
}
