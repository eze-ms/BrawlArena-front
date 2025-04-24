import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { ROUTES } from "../constants/routes";
import { API } from "../constants/api";
import PieceGrid from "../components/PieceGrid";
import type { Piece } from "../types/piece";
import type { Character } from "../types/character"; 
import playButton from '../assets/play.webp';


export default function Game() {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const initialized = useRef(false);

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20); 
  const [result, setResult] = useState<{ score: number; errors: number } | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [hasStarted, setHasStarted] = useState(false); 

  const handleValidate = useCallback(async () => {
    const durationSec = Math.floor((Date.now() - startTime) / 1000);

    try {
      const res = await fetchWithAuth(API.builds.validate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId,
          piecesPlaced: selected,
          duration: durationSec,
        }),
      });

      if (!res.ok) {
        if (res.status === 400) throw new Error("Montaje inválido.");
        if (res.status === 403) throw new Error("Personaje no desbloqueado.");
        if (res.status === 404) throw new Error("No hay build pendiente.");
        throw new Error("Error al validar el montaje.");
      }

      const data = await res.json();
      setResult({ score: data.score, errors: data.errors });
    } catch (err) {
      console.log(err);
      setError("Error al validar montaje");
    }
  }, [startTime, characterId, selected]);

  useEffect(() => {
    if (!character || !hasStarted || result) return;

    const correctPieceIds = character.pieces
      .filter(p => !p.fake)
      .map(p => p.id)
      .sort();

    const selectedSorted = [...selected].sort();

    const isComplete =
      selectedSorted.length === correctPieceIds.length &&
      selectedSorted.every((id, index) => id === correctPieceIds[index]);

    if (isComplete) {
      handleValidate();
    }
  }, [selected, character, hasStarted, result, handleValidate]);

  // 4. useEffect de carga inicial 
  useEffect(() => {
    if (!characterId) {
      navigate(ROUTES.dashboard);
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    fetchWithAuth(API.builds.pending(characterId))
      .then(async (res) => {
        if (res.status === 200) {
          const build = await res.json();
          return build;
        }

        if (res.status === 404) {
          const resStart = await fetchWithAuth(API.builds.start + `?characterId=${characterId}`, {
            method: "POST",
          });

          if (!resStart.ok) {
            if (resStart.status === 403) throw new Error("Personaje no desbloqueado.");
            if (resStart.status === 409) throw new Error("Ya tienes un build activo.");
            throw new Error("Error al iniciar la partida.");
          }

          const build = await resStart.json();
          return build;
        }

        return null;
      })
      .then(async () => {
        const resChar = await fetchWithAuth(API.characters.detail(characterId));
        if (!resChar.ok) throw new Error("Error al obtener el personaje.");
        const character = await resChar.json();

        console.log("[Game] character completo:", character);


        setPieces(character.pieces);
        setCharacter(character);
        setStartTime(Date.now());
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [characterId, navigate]);

  const togglePiece = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  if (loading) return <p className="text-center mt-10">Cargando partida...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Montaje del personaje</h1>
  
      {character && hasStarted && (
        <img
          src={character.gameImageUrl}
          alt="Personaje montado"
          className="w-full max-w-md mx-auto mb-6 rounded-xl shadow-lg"
        />
      )}
  
      {hasStarted && (
        <div className="mt-4">
          <progress
            value={timeLeft}
            max={20}
            className="w-full h-4 bg-gray-200 rounded-lg"
            style={{
              appearance: "none",
              backgroundColor: "#ddd",
              color: "green",
            }}
          />
          <p className="text-center mt-2 text-sm text-gray-500">{timeLeft}s restantes</p>
        </div>
      )}
  
      <div className="mt-6">
        <PieceGrid pieces={pieces} onSelect={togglePiece} selectedIds={selected} />
      </div>
  
      {!hasStarted && !result && (
        <div className="mt-6 flex justify-center">
          <img
            src={playButton}
            alt="Botón Jugar"
            className="w-40 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => {
              setHasStarted(true);
              setStartTime(Date.now());
  
              const interval = setInterval(() => {
                setTimeLeft((prev) => {
                  if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
            }}
          />
        </div>
      )}
  
      {result && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50 text-center">
          <p className="font-semibold mb-2">Resultado:</p>
          <p>Puntuación: {result.score}</p>
          <p>Errores: {result.errors}</p>
        </div>
      )}
    </div>
  );
  
  
}
