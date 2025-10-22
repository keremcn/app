import { useState, useRef, useEffect } from 'react';
import { Image, FileText } from 'lucide-react';

// StickyNote: Sürüklenebilir sarı yapışkan not bileşeni
const StickyNote = ({ 
  note, 
  onEdit, 
  onUpdatePosition, 
  onClickForConnection,
  connectMode,
  isHighlighted 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef(null);

  // Sürükleme başlat
  const handleMouseDown = (e) => {
    if (connectMode) {
      onClickForConnection(note.id);
      return;
    }

    setIsDragging(true);
    const rect = noteRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Sürükleme sırasında
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const boardRect = noteRef.current.parentElement.getBoundingClientRect();
      const newX = e.clientX - boardRect.left - dragOffset.x;
      const newY = e.clientY - boardRect.top - dragOffset.y;

      onUpdatePosition(note.id, Math.max(0, newX), Math.max(0, newY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, note.id, onUpdatePosition]);

  return (
    <div
      ref={noteRef}
      className={`absolute w-[200px] h-[200px] p-4 cursor-move transition-all duration-200 ${
        connectMode ? 'cursor-pointer hover:scale-110' : 'hover:scale-105'
      } ${
        isHighlighted ? 'ring-4 ring-blue-500 scale-110' : ''
      }`}
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        backgroundColor: '#FEFF9C',
        boxShadow: isDragging 
          ? '0 20px 30px rgba(0,0,0,0.3)' 
          : '0 8px 16px rgba(0,0,0,0.2)',
        transform: isDragging ? 'rotate(2deg)' : 'rotate(-1deg)',
        zIndex: isDragging ? 1000 : 10
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => !connectMode && onEdit(note)}
    >
      {/* Not içeriği */}
      <div className="h-full overflow-hidden flex flex-col">
        {/* Resim varsa göster */}
        {note.imageUrl && (
          <div className="mb-2 flex-shrink-0">
            <img 
              src={note.imageUrl} 
              alt="Not görseli" 
              className="w-full h-20 object-cover rounded"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}

        {/* Metin */}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words line-clamp-4">
            {note.text || 'Boş not...'}
          </p>
        </div>

        {/* Dosya ikonu */}
        {note.fileUrl && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
            <FileText className="h-3 w-3" />
            <span className="truncate">{note.fileName || 'Dosya'}</span>
          </div>
        )}
      </div>

      {/* Yapışkan not efekti için üst gölge */}
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-4 bg-yellow-300 opacity-40 rounded-sm"
        style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
      />
    </div>
  );
};

export default StickyNote;