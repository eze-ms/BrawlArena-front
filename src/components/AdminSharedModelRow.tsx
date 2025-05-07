import { useState } from "react";
import { API } from "../constants/api";
import { fetchWithAuth } from "../utils/fetchWithAuth";

interface Props {
  model: {
    id: string;
    playerId: string;
    characterId: string;
    score: number;
    sharedAt: string;
  };
  highlightedId: string | null;
  onDeleted: (id: string) => void;
  onHighlighted: (id: string) => void;
}

export default function AdminSharedModelRow({ model, highlightedId, onDeleted, onHighlighted }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isHighlighted = model.id === highlightedId;

  const handleHighlight = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(API.gallery.highlighted, {
        method: "PUT",
        headers: { "Content-Type": "text/plain" },
        body: model.id,
      });
      if (!res.ok) throw new Error("Error al destacar modelo");
      onHighlighted(model.id);
    } catch {
      setError("Error al destacar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este modelo?")) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API.gallery.delete}/${model.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar modelo");
      onDeleted(model.id);
    } catch {
      setError("Error al eliminar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr>
      <td colSpan={4}>
      <div
  className={`bg-gradient-to-br from-[#1e1e2f] via-[#2e1e355e] to-[#1e1e2f] text-white p-4 rounded shadow-md border ${
    isHighlighted ? 'border-purple-500' : 'border-gray-700'
  } flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4 transform transition-transform duration-300 hover:scale-[1.03]`}
>

          <div className="text-sm space-y-1">
            <p><span className="font-semibold">Jugador:</span> {model.playerId}</p>
            <p><span className="font-semibold">Personaje:</span> {model.characterId}</p>
            <p><span className="font-semibold">Puntaje:</span> {model.score}</p>
            <p className="text-xs text-gray-400">Compartido: {new Date(model.sharedAt).toLocaleDateString()}</p>
          </div>
  
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            {isHighlighted ? (
              <span className="text-xs text-gray-400 border border-gray-500 rounded px-3 py-2">Destacado</span>
            ) : (
              <button
                onClick={handleHighlight}
                disabled={isLoading}
                className="bg-yellow-500 text-yellow-800 px-3 py-2 rounded text-xs hover:bg-yellow-900 hover:text-yellow-200"
              >
                Destacar
              </button>
            )}
  
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-pink-600 text-white px-3 py-2 rounded text-xs hover:bg-pink-800"
            >
              Eliminar
            </button>
  
            {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
          </div>
        </div>
      </td>
    </tr>
  );
  
}
