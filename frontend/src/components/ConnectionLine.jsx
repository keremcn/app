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
      style={{ pointerEvents: 'all' }}
    >
      {/* Geniş tıklanabilir alan (görünmez) */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth={25}
        fill="none"
        strokeLinecap="round"
        style={{ pointerEvents: 'stroke' }}
      />
      
      {/* Gölge efekti */}
      <path
        d={pathData}
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={isHovered ? 10 : 8}
        fill="none"
        strokeLinecap="round"
        transform="translate(3, 3)"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Ana çizgi - kalın ip görünümü */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth={isHovered ? 9 : 7}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={isHovered ? '0' : '12,6'}
        className="transition-all duration-200"
        style={{ 
          pointerEvents: 'none',
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
          opacity: 0.9
        }}
      />
    </g>
  );
};

export default ConnectionLine;