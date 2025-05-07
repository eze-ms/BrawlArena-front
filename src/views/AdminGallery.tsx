import { useEffect, useState } from "react";
import { API } from "../constants/api";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import AdminSharedModelRow from "../components/AdminSharedModelRow";

interface SharedModel {
  id: string;
  playerId: string;
  characterId: string;
  score: number;
  sharedAt: string;
}

export default function AdminGallery() {
  const [models, setModels] = useState<SharedModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(API.gallery.list);
        if (!res.ok) throw new Error("Error al obtener modelos compartidos");
        const data: SharedModel[] = await res.json();
        setModels(data);
      } catch {
        setError("No se pudo cargar la galería");
      } finally {
        setLoading(false);
      }
    };

    const fetchHighlighted = async () => {
      try {
        const res = await fetchWithAuth(API.gallery.highlighted);
        if (!res.ok) return;
        const data: SharedModel = await res.json();
        setHighlightedId(data.id);
      } catch {
        console.warn("No se pudo obtener el modelo destacado");
      }
    };

    fetchData();
    fetchHighlighted();
  }, []);

  const handleDeleted = (id: string) => {
    setModels(prev => prev.filter(model => model.id !== id));
    if (highlightedId === id) setHighlightedId(null);
  };

  const handleHighlighted = (id: string) => {
    setHighlightedId(id);
  };

  if (loading) return <p className="text-white">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="p-5 text-white mt-24">
      <div className="bg-purple-600 w-full md:w- font-exo p-2 rounded-sm transform -skew-x-6 flex justify-center items-center mb-6">
        <h1 className="text-3xl font-exo shadow-text2">Administración de Galería</h1>
      </div>
      
      <table className="w-full table-auto font-exo">
        <tbody>
          {models.map(model => (
            <AdminSharedModelRow
              key={model.id}
              model={model}
              highlightedId={highlightedId}
              onDeleted={handleDeleted}
              onHighlighted={handleHighlighted}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}
