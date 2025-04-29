import { useDrop, useDragLayer } from "react-dnd";

interface DropZoneProps {
  placedPieces: string[];
  onDropSuccess: (pieceId: string) => void;
  hasStarted: boolean;
}

export default function DropZone({ placedPieces, onDropSuccess, hasStarted }: DropZoneProps) {
  const [{ isOver }, dropRef] = useDrop<
    { id: string },
    void,
    { isOver: boolean }
  >(() => ({
    accept: "piece",
    drop: (item) => {
      if (!hasStarted) return;
      if (placedPieces.includes(item.id)) return; 
      onDropSuccess(item.id); 
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  return (
    <div
      ref={(el) => {
        dropRef(el);
      }}
      className={`absolute w-52 h-52 rounded-md border-2 transition-all duration-300 ${
        isDragging ? (isOver ? "border-yellow-500" : "border-blue-400") : "border-transparent"
      }`}
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
