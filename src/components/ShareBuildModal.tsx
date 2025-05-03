interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  error?: string;
}

export default function ShareBuildModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
  error,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-exo">
      <div className="bg-custom-dateCharacter p-6 rounded-lg shadow-lg text-white w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">¿Deseas compartir tu personaje?</h2>

        {error && <p className="text-red-400 text-sm italic">{error}</p>}

        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-200 hover:text-pink-900"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700 hover:text-yellow-100"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Compartiendo..." : "Sí, compartir"}
          </button>
        </div>
      </div>
    </div>
  );
}
