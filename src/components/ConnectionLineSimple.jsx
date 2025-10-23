import { useState } from 'react';

// ConnectionLineSimple: Basit HTML/CSS tabanlı bağlantı çizgisi
const ConnectionLineSimple = ({ id, from, to, color, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Çizgi hesaplama
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const handleClick = () => {
    if (window.confirm('Bu bağlantıyı silmek istiyor musunuz?')) {
      onDelete(id);
    }
  };

  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        left: `${from.x}px`,
        top: `${from.y}px`,
        width: `${length}px`,
        height: isHovered ? '12px' : '8px',
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 50%',
        zIndex: 5
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Gölge */}
      <div
        className="absolute top-1/2 left-0 right-0 rounded-full"
        style={{
          height: isHovered ? '12px' : '8px',
          transform: 'translateY(-50%) translateY(3px)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          filter: 'blur(4px)'
        }}
      />
      
      {/* Ana çizgi */}
      <div
        className="absolute top-1/2 left-0 right-0 rounded-full"
        style={{
          height: isHovered ? '10px' : '7px',
          transform: 'translateY(-50%)',
          backgroundColor: color,
          opacity: isHovered ? 1 : 0.9,
          boxShadow: `0 2px 8px ${color}40`
        }}
      />
    </div>
  );
};

export default ConnectionLineSimple;
