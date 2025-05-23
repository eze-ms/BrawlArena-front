import { useEffect, useState } from "react";
import { API } from "../constants/api";
import GalleryGrid from "../components/GalleryGrid";
import type { SharedModel } from "../types/SharedModel";


interface CharacterData {
  id: string;
  name: string;
  gameImageUrl: string;
}

export default function Gallery() {
  const [models, setModels] = useState<SharedModel[]>([]);
  const [characterImages, setCharacterImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);


  useEffect(() => {
    const fetchGalleryAndCharacters = async () => {
      try {
        const [galleryRes, charactersRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}${API.gallery.list}`),
          fetch(`${import.meta.env.VITE_API_URL}${API.characters.all}`),
        ]);
  
        if (!galleryRes.ok || !charactersRes.ok) throw new Error("Error al cargar datos");
  
        const galleryText = await galleryRes.text();
        const charactersText = await charactersRes.text();
  
        const galleryData: SharedModel[] = galleryText ? JSON.parse(galleryText) : [];
        const charactersData: CharacterData[] = charactersText ? JSON.parse(charactersText) : [];

        const imageMap: Record<string, string> = {};
        charactersData.forEach((char) => {
          imageMap[char.id] = char.gameImageUrl;
        });
    
        setCharacterImages(imageMap);
        setModels(galleryData);
      } catch (err) {
        console.error("[Gallery]", err);
        setError("No se pudo cargar la galería.");
      } finally {
        setLoading(false);
      }
    };

    const fetchHighlighted = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}${API.gallery.highlighted}`);
        if (!res.ok) return;
        const data: SharedModel = await res.json();
        setHighlightedId(data.id);
      } catch {
        console.warn("No se pudo obtener el modelo destacado");
      }
    };

    fetchGalleryAndCharacters();
    fetchHighlighted();
  }, []);
  
  if (loading) return <p className="text-white">Cargando modelos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="p-5 text-white mt-16 mb-8">
      <div className="bg-purple-600 w-full md:w-2/5 font-exo p-2 rounded-sm transform -skew-x-6 flex justify-center items-center mb-6">
        <h1 className="text-3xl font-exo font-medium text-white shadow-text2">Galería Pública</h1>
      </div>
      
      <GalleryGrid models={models} characterImages={characterImages} highlightedId={highlightedId} />
    </section>
  );
}
