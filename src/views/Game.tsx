// Imports principales
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { ROUTES } from "../constants/routes";
import { API } from "../constants/api";
import PieceGrid from "../components/PieceGrid";
import DropZone from "../components/DropZone";
import PowerProgressBar from "../components/PowerProgressBar";
import type { Piece } from "../types/piece";
import { Power } from "../types/piece";
import type { Character } from "../types/character";
import playButton from "../assets/play.webp";
import CullienPreview from "../assets/Baby_preview.webp";
import MeikoPreview from "../assets/Meiko_preview.webp";
import TaekwonPreview from "../assets/Taekwon_preview.webp";
import ErrantPreview from "../assets/Errant_preview.webp";
import FishbladePreview from "../assets/Fishblade_preview2.webp";
import GrishotPreview from "../assets/Gritshot_preview2.webp";
import FuriaPreview from "../assets/Furia_preview2.webp";
import GrunakPreview from "../assets/Grunak_preview.webp";
import LucyPreview from "../assets/Lucy_preview2.webp";
import RaidonPreview from "../assets/Raidon_preview.webp";
import BearzerkerPreview from "../assets/Bearzerker_preview.webp";
import ClusterPreview from "../assets/Cluster_preview.webp";
import LuffyPreview from "../assets/Luffy_preview.webp";
import tokenImg from "../assets/token.webp";
import ShareBuildModal from "../components/ShareBuildModal";
import { FaShare } from "react-icons/fa";



// Componente principal
export default function Game() {
  // --- Hooks de React: Estado y navegación ---
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const initialized = useRef(false);

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [result, setResult] = useState<{
    score: number;
    errors: number;
    powerProgress?: Record<Power, number>;
  } | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [placedPieces, setPlacedPieces] = useState<string[]>([]);
  const [progressScore, setProgressScore] = useState<number>(0);
  const [scoreFeedback, setScoreFeedback] = useState<"positive" | "negative" | null>(null);
  const scoreRef = useRef<HTMLParagraphElement>(null);
  const [bounce, setBounce] = useState(false);
  const [localPowerProgress, setLocalPowerProgress] = useState<Record<Power, number>>(
    Object.values(Power).reduce((acc, power) => {
      acc[power] = 0; // Inicializa cada poder con 0
      return acc;
    }, {} as Record<Power, number>)
  );
  const [characterPowers, setCharacterPowers] = useState<Power[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [showNeon, setShowNeon] = useState(false);


  
  //! --- Siluetas de personajes ---
  const silhouetteMap: Record<string, string> = {
    Cullien: CullienPreview,
    Meiko: MeikoPreview,
    Taekwon: TaekwonPreview,
    Errant: ErrantPreview,
    Fishblade: FishbladePreview,
    Gritshot: GrishotPreview,
    Furia: FuriaPreview,
    Grunak: GrunakPreview,
    Lucy: LucyPreview,
    Raidon: RaidonPreview,
    Bearzerker: BearzerkerPreview,
    Cluster: ClusterPreview,
    Luffy: LuffyPreview,

  }

  const getSilhouetteImage = (characterName: string) => {
    return silhouetteMap[characterName] || "";
  };

  const intervalRef = useRef<number | null>(null);

  //! --- Función para validar montaje ---
  const handleValidate = useCallback(async () => {
    const durationSec = Math.floor((Date.now() - startTime) / 1000);
  
    try {
      const res = await fetchWithAuth(API.builds.validate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, piecesPlaced: placedPieces, duration: durationSec }),
      });
  
      if (!res.ok) {
        console.error("[handleValidate] Error validando:", res.status);
        throw new Error("Error al validar montaje.");
      }
  
      const data = await res.json();
      console.log("[handleValidate] Resultado recibido:", data);

      const earned = data.score;
  
      setResult({
        score: data.score,
        errors: data.errors,
        powerProgress: data.powerProgress,
      });
      
      setShowNeon(true);
      setTimeout(() => setShowNeon(false), 2000);

  
      if (earned !== 0) {
        // Saldo actual
        const userRes = await fetchWithAuth(API.users.me);
        const userData = await userRes.json();
        const currentTokens = userData.tokens ?? 0;
  
        const totalTokens = Math.max(0, currentTokens + earned);
  
        await fetchWithAuth(API.users.tokens, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(totalTokens),
        });
  
        console.log(`[handleValidate] Tokens actualizados: ${currentTokens} + (${earned}) = ${totalTokens}`);
      }
  
    } catch (err) {
      console.error("[handleValidate] Error en validación:", err);
      setError("Error al validar montaje");
    }
  }, [startTime, characterId, placedPieces]);

   //! --- Función para compartir ---
  const handleShareConfirm = async () => {

    if (!characterId) {
      console.warn("[handleShareConfirm] characterId no definido");
      setShareError("ID de personaje no disponible.");
      return;
    }

    setIsSharing(true);
    setShareError(null);

    try {
      const res = await fetchWithAuth(API.gallery.share + `?characterId=${characterId}`, {
        method: "POST",
      });
  
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error al compartir modelo.");
      }
  
      setIsShareModalOpen(false);
    } catch (err) {
      console.error("[handleShareConfirm]", err);
      setShareError("No se pudo compartir el modelo.");
    } finally {
      setIsShareModalOpen(false);
      navigate("/gallery");
    }
  };
  
  //! --- Manejar drop de piezas ---
  const handlePieceDrop = (pieceId: string) => {
    if (!hasStarted) return;
    if (placedPieces.includes(pieceId)) return;
  
    setPlacedPieces((prev) => [...prev, pieceId]);
  
    const pieza = pieces.find((p) => p.id === pieceId);
    if (!pieza) return;
  
    // Llamar a la nueva función para actualizar la progresión
    updatePowerProgress(pieza);
  
    let incremento = 0;
  
    if (pieza.fake) {
      incremento -= 30;
    } else {
      switch (pieza.level) {
        case 1: incremento += 50; break;
        case 2: incremento += 100; break;
        case 3: incremento += 150; break;
        case 4: incremento += 200; break;
      }
      if (pieza.special) incremento += 200;
      if (pieza.comboVisual) incremento += 100;
    }
  
    if (incremento !== 0) {
      setProgressScore((prev) => prev + incremento);
      setScoreFeedback(incremento > 0 ? "positive" : "negative");
  
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
      setTimeout(() => setScoreFeedback(null), 1000);
    }
  };

    //! --- Actualizar poderes ---
  const updatePowerProgress = (pieza: Piece) => {
    if (!pieza.fake && pieza.power) {
      setLocalPowerProgress((prev) => {
        const powerKey = pieza.power as keyof typeof prev; 
        const current = prev[powerKey] ?? 0;
        const updated = Math.min(current + 33, 100);
        return { ...prev, [powerKey]: updated };
      });
    }
  };
  
  //! --- Detectar montaje completo ---
  useEffect(() => {
    if (!character || !hasStarted || result) return;
  
    const correctPieceIds = new Set(character.pieces.filter(p => !p.fake).map(p => p.id));
    const placedSet = new Set(placedPieces);
  
    const isComplete = [...correctPieceIds].every(id => placedSet.has(id));
  
    if (isComplete) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      handleValidate();
    }
  }, [placedPieces, character, hasStarted, result, handleValidate]);
  
  //! --- Carga inicial del personaje y build ---
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
          setPlacedPieces(build.piecesPlaced || []); 
          setProgressScore(0); 
          setScoreFeedback(null);
          return build;
        }
    

        if (res.status === 404) {
          const resStart = await fetchWithAuth(API.builds.start + `?characterId=${characterId}`, { method: "POST" });
          if (!resStart.ok) throw new Error("Error al iniciar la partida.");
          return resStart.json();
        }
        return null;
      })
      .then(async () => {
        const resChar = await fetchWithAuth(API.characters.detail(characterId));
        if (!resChar.ok) throw new Error("Error al obtener el personaje.");
        const character = await resChar.json();

        // Filtramos los poderes válidos del personaje
        const characterPowers = character.pieces
        .filter((pieza: Piece) => pieza.power) // Filtra las piezas que tienen un poder
        .map((pieza: Piece) => pieza.power); // Obtiene los poderes de esas piezas

        setPieces(character.pieces);
        setCharacter(character);
        setCharacterPowers(characterPowers); // Establece los poderes válidos del personaje
        setStartTime(Date.now());
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [characterId, navigate]);

  //! --- Toggle selección de pieza ---
  const togglePiece = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  //! --- Renderizado principal ---
  if (loading) return <p className="text-center mt-10 font-exo text-white">Cargando partida...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;



  return (
    <>
      <div className="flex justify-center w-full mt-24 mb-8">
        <div className="flex flex-col justify-center shadow-md max-w-xs w-full mx-4 bg-custom-interface rounded-3xl">
  
          {/* Vista previa del personaje */}
          {character && (
            <div className={`relative w-full max-w-md mx-auto ${showNeon ? "flash-neon" : ""}`}>

  
              {/* Vista progresión poderes y compartir*/}
              <div className="absolute w-full flex justify-between">

                {/* Poderes */}
                <div className="w-2/4">
                  {!result && localPowerProgress && (
                    <div className="p-4 text-white space-y-1">
                      {Object.entries(localPowerProgress).map(([power, value]) => (
                        characterPowers.includes(power as Power) && (
                          <PowerProgressBar key={power} power={power as Power} value={value} />
                        )
                      ))}
                    </div>
                  )}
    
                  {result?.powerProgress && character && (
                    <div className="p-4 text-white space-y-1">
                      {Object.entries(result.powerProgress).map(([power, value]) => (
                        character.powers.includes(power as Power) && (
                          <PowerProgressBar key={power} power={power as Power} value={value} />
                        )
                      ))}
                    </div>
                  )}
                </div>
  
                {/* Botón de compartir modelo */}
                <div className="">
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="p-4 text-blue-100 flex items-center gap-2 rounded-full text-xl hover:scale-125 transition-transform opacity-80"
                  >
                    <FaShare className="w-6 h-6" />
                  </button>
                </div>


              </div>
  
              <img
                src={result ? character.gameImageUrl : getSilhouetteImage(character.name) || ""}
                alt={character.name}
                className="rounded-tl-3xl rounded-tr-3xl"
              />
  
              {hasStarted && (
                <DropZone placedPieces={placedPieces} onDropSuccess={handlePieceDrop} hasStarted={hasStarted} />
              )}
            </div>
          )}
  
        
          {/* Bloque contador y piezas */}
          <div className="p-2 text-center text-xs text-white flex justify-between gap-4 items-center font-extrabold font-exo">
            <div className="flex items-center gap-2 bg-custom-progress border-2 border-custom-border rounded-lg">
              <div className="border-2 border-black py-1 px-4 rounded-md flex items-center">
                <p
                  ref={scoreRef}
                  className={`text-sm font-semibold ${
                    scoreFeedback === "positive"
                      ? "text-green-800"
                      : scoreFeedback === "negative"
                      ? "text-red-600"
                      : "text-white"
                  } ${bounce ? "animate-bounce" : ""}`}
                  style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
                >
                  {result ? result.score : progressScore}
                </p>
                <img src={tokenImg} alt="token" className="w-6 h-6 ml-2" />
              </div>
            </div>
  
            {/* Contador de piezas colocadas */}
            <div className="bg-red-500 border-2 border-custom-border rounded-lg">
              <div className="border-2 border-black py-2 px-6 rounded-md">
                <p style={{ textShadow: "1px 1px 1px rgba(0, 0, 0.4, 0.4)" }}>
                  {placedPieces.length}/{character?.pieces.filter((p) => !p.fake).length ?? 0}
                </p>
              </div>
            </div>
          </div>
  
          {/* Barra de progreso de tiempo */}
          <div className="relative border-2 border-gray-300 rounded-sm flex">
            <progress
              value={timeLeft}
              max={20}
              className="w-full h-4 rounded-sm border-2 border-gray-600 py-3"
              style={{
                appearance: "none",
                backgroundColor: "#bbb",
                background: `linear-gradient(to right, #51ef8e ${((timeLeft / 20) * 100)}%, #ddd 0%)`,
              }}
            />
            <p className="absolute inset-0 text-center text-white font-normal text-md" style={{ lineHeight: "25px", top: "0", textShadow: "1px 1px 1px rgba(0, 0, 0.4, 0.4)" }}>
              {timeLeft}"
            </p>
          </div>
  
          {/* Carrusel de piezas */}
          <div className="bg-custom-piece">
            <PieceGrid
              pieces={pieces}
              onSelect={togglePiece}
              selectedIds={selected}
              placedPieces={placedPieces}
            />
          </div>
  
          {/* Botón de inicio */}
          <div className="flex justify-center py-4">
            <img
              src={playButton}
              alt="Botón Jugar"
              className={`w-28 ${hasStarted ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"} transition-transform`}
              onClick={() => {
                if (hasStarted) return;
                setPlacedPieces([]);
                setProgressScore(0);
                setScoreFeedback(null);
                setTimeLeft(20);
                setLocalPowerProgress(
                  Object.values(Power).reduce((acc, power) => {
                    acc[power] = 0;
                    return acc;
                  }, {} as Record<Power, number>)
                );
  
                setHasStarted(true);
                setStartTime(Date.now());
  
                intervalRef.current = window.setInterval(() => {
                  setTimeLeft((prev) => {
                    if (prev <= 1) {
                      clearInterval(intervalRef.current!);
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }}
            />
          </div>
        </div>
      </div>
  
      {/* Modal correctamente fuera del layout */}
      <ShareBuildModal
        isOpen={isShareModalOpen}
        onConfirm={handleShareConfirm}
        onCancel={() => setIsShareModalOpen(false)}
        isLoading={isSharing}
        error={shareError ?? undefined}
      />
    </>
  );
}
