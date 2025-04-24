import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { ROUTES } from "../constants/routes";
import { API } from "../constants/api";
import PieceGrid from "../components/PieceGrid";
import type { Piece } from "../types/piece";

export default function Game() {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const initialized = useRef(false);

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<{ score: number; errors: number } | null>(null);

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
          console.log("Nuevo build iniciado:", build.id);
          return build;
        }
  
        throw new Error(`Error inesperado en GET /builds/pending: ${res.status}`);
      })
      .then(async () => {
        const resChar = await fetchWithAuth(API.characters.detail(characterId));
        if (!resChar.ok) throw new Error("Error al obtener el personaje.");
        const character = await resChar.json();
        setPieces(character.pieces);
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

  const handleValidate = async () => {
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
  };

  if (loading) return <p className="text-center mt-10">Cargando partida...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Montaje del personaje</h1>
      <PieceGrid pieces={pieces} onSelect={togglePiece} selectedIds={selected} />

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm">Tiempo: {Math.floor((Date.now() - startTime) / 1000)}s</p>
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Finalizar montaje
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
          <p className="font-semibold">Resultado:</p>
          <p>Puntuación: {result.score}</p>
          <p>Errores: {result.errors}</p>
        </div>
      )}
    </div>
  );
}
