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
  
    fetchGalleryAndCharacters();
  }, []);
  
  

  if (loading) return <p className="text-white">Cargando modelos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="p-5 text-white">
      <h1 className="text-3xl font-exo mb-6">Galería Pública</h1>
      <GalleryGrid models={models} characterImages={characterImages} />
    </section>
  );
}
