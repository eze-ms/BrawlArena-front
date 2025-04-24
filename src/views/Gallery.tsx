import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { API } from "../constants/api";

type GalleryModel = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function Gallery() {
  const { user } = useAuth(); 
  const [models, setModels] = useState<GalleryModel[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchModels = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}${API.users.gallery}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        

        if (!response.ok) {
          setError("No se pudieron cargar los modelos.");
          return;
        }

        const data = await response.json();
        setModels(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar la galería.");
      }
    };

    fetchModels();
  }, [user]);

  return (
    <section className="p-5 text-white">
      <h1 className="text-3xl font-exo mb-6">Galería de Modelos</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {models.length > 0 ? (
          models.map((model) => (
            <div key={model.id} className="border p-4 rounded-lg bg-gray-800">
              <img src={model.imageUrl} alt={model.name} className="w-full h-48 object-cover rounded-md" />
              <h2 className="text-lg mt-3">{model.name}</h2>
            </div>
          ))
        ) : (
          <p>No tienes modelos compartidos.</p>
        )}
      </div>
    </section>
  );
}
