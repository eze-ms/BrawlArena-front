import type { Piece } from "../types/piece";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRef } from "react";
import { useDrag } from "react-dnd";

interface Props {
  pieces: Piece[];
  onSelect: (pieceId: string) => void;
  selectedIds: string[];
  placedPieces: string[];
  
}

interface DraggablePieceProps {
  piece: Piece;
  onSelect: (id: string) => void;
  selected: boolean;
  placedPieces: string[];
}

const ItemTypes = {
  PIECE: "piece",
};

const SCROLL_AMOUNT = 120;

function DraggablePiece({ piece, onSelect, selected, placedPieces }: DraggablePieceProps) {
  const isPlaced = placedPieces.includes(piece.id) && !piece.fake;

  const [{ isDragging }, dragRef] = useDrag<
    { id: string },
    void,
    { isDragging: boolean }
  >(() => ({
    type: ItemTypes.PIECE,
    item: { id: piece.id },
    canDrag: !isPlaced, 
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(el) => {
        dragRef(el);
      }}
      className={`min-w-[96px] flex justify-center transition border border-1 ${
        selected ? "border-custom-border bg-blue-100" : "border-gray-900"
      } ${isPlaced ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isPlaced ? "#d1d5db" : "#172554",
      }}
      onClick={() => {
        if (!isPlaced) {
          onSelect(piece.id); 
        }
      }}
    >
      <img
        src={piece.imageUrl}
        alt={`Pieza ${piece.name}`}
        className="w-full h-20 object-contain"
      />
    </div>
  );
}

export default function PieceGrid({ pieces, onSelect, selectedIds, placedPieces }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    carouselRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <button
        aria-label="Desplazar carrusel a la izquierda"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-400 opacity-70 rounded-full p-2 shadow"
        onClick={handleScrollLeft}
      >
        <FiChevronLeft size={24} />
      </button>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto no-scrollbar px-10 shadow-md"
      >
        {pieces.map((piece) => (
          <DraggablePiece
            key={piece.id}
            piece={piece}
            onSelect={onSelect}
            selected={selectedIds.includes(piece.id)}
            placedPieces={placedPieces}
          />
        ))}
      </div>

      <button
        aria-label="Desplazar carrusel a la derecha"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-400 opacity-70 rounded-full p-2 shadow"
        onClick={handleScrollRight}
      >
        <FiChevronRight size={24} />
      </button>
    </div>
  );
}
