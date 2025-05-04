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
    <tr className="border-b text-center">
      <td className="p-3 text-sm text-gray-100">{model.playerId}</td>
      <td className="p-3 text-sm text-gray-100">{model.characterId}</td>
      <td className="p-3 text-sm text-gray-100">{model.score}</td>
      <td className="p-3 flex flex-col sm:flex-row justify-center gap-2">
        {isHighlighted ? (
          <span className="text-xs text-gray-400 border border-gray-500 rounded px-3 py-1">Destacado</span>
        ) : (
          <button
            onClick={handleHighlight}
            disabled={isLoading}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs border-2 border-green-800 hover:bg-green-700"
          >
            Destacar
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="bg-pink-600 text-white px-3 py-1 rounded text-xs border-2 border-pink-800 hover:bg-pink-700"
        >
          Eliminar
        </button>
        {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
      </td>
    </tr>
  );
}
