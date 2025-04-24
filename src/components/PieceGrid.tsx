import type { Piece } from "../types/piece";

interface Props {
  pieces: Piece[];
  onSelect: (pieceId: string) => void;
  selectedIds: string[];
}

export default function PieceGrid({ pieces, onSelect, selectedIds }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {pieces.map((piece) => {
        const isSelected = selectedIds.includes(piece.id);
        return (
          <div
            key={piece.id}
            className={`cursor-pointer border-2 rounded-xl p-2 shadow-md transition
              ${isSelected ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"}`}
            onClick={() => onSelect(piece.id)}
          >
            <img
              src={piece.imageUrl}
              alt={piece.name}
              className="w-full h-24 object-contain mb-2"
            />
            <p className="font-semibold text-center text-sm">{piece.name}</p>
            {piece.fake && (
              <p className="text-xs text-red-500 text-center">Falsa</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
