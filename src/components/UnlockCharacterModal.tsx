import { Dialog } from "@headlessui/react";
import type { Character } from "../types/character";
import tokenImg from "../assets/token.webp";


interface UnlockCharacterModalProps {
    isOpen: boolean;
    character: Character;
    userTokens: number;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
    error: string | null;
    tokenImg?: string;
  }
  

export default function UnlockCharacterModal({
  isOpen,
  character,
  userTokens,
  onConfirm,
  onCancel,
  isLoading,
  error,
}: UnlockCharacterModalProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      {/* Fondo oscuro detrás */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal principal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 text-white font-exo">
        <Dialog.Panel className="bg-custom-dateCharacter rounded-xl p-6 max-w-sm w-full space-y-4 text-center">

        <h2 id="dialog-title" className="text-xl font-medium">¿Desbloquear {character.name}?</h2>

        <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <p className="text-sm text-white flex items-center gap-1">
                Coste: {character.cost}
                <img src={tokenImg} alt="token" className="w-4 h-4" />
            </p>

            <p className="text-sm text-white flex items-center gap-1">
                Disponibles: {userTokens}
                <img src={tokenImg} alt="token" className="w-4 h-4" />
            </p>
        </div>


          {/* Mostrar error si existe */}
          {error && <p className="text-yellow-400 text-md font-semibold">{error}</p>}

          {/* Botones */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-blue-950  hover:text-blue-100"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              aria-busy={isLoading}
              className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-700 text-yellow-900  hover:text-yellow-100"
            >
              {isLoading ? "Desbloqueando..." : "Confirmar"}
            </button>
          </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
