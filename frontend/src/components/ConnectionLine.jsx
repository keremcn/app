import { useState } from 'react';

// ConnectionLine: İki not arasında ip görünümlü bağlantı çizgisi
const ConnectionLine = ({ id, from, to, color, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Çizgi için path hesapla (hafif eğimli, ip gibi)
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  // Kontrol noktası (eğim için)
  const controlY = midY + Math.abs(to.x - from.x) * 0.1;

  const pathData = `M ${from.x} ${from.y} Q ${midX} ${controlY} ${to.x} ${to.y}`;

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (window.confirm('Bu bağlantıyı silmek istiyor musunuz?')) {
          onDelete(id);
        }
      }}
      className="cursor-pointer"
      style={{ pointerEvents: 'stroke' }}
    >
      {/* Geniş tıklanabilir alan (görünmez) */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        strokeLinecap="round"
        style={{ pointerEvents: 'stroke' }}
      />
      
      {/* Gölge efekti */}
      <path
        d={pathData}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={isHovered ? 7 : 5}
        fill="none"
        strokeLinecap="round"
        transform="translate(2, 2)"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Ana çizgi - ip görünümü */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth={isHovered ? 6 : 4}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={isHovered ? '0' : '10,5'}
        className="transition-all duration-200"
        style={{ 
          pointerEvents: 'none',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}
      />
    </g>
  );
};

export default ConnectionLine;