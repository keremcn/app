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
      style={{ pointerEvents: 'auto' }}
    >
      {/* Geniş tıklanabilir alan (görünmez) */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth={30}
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Gölge efekti */}
      <path
        d={pathData}
        stroke="rgba(0,0,0,0.5)"
        strokeWidth={isHovered ? 12 : 10}
        fill="none"
        strokeLinecap="round"
        transform="translate(4, 4)"
      />
      
      {/* Ana çizgi - kalın ip görünümü */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth={isHovered ? 10 : 8}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={isHovered ? '0' : '15,8'}
        className="transition-all duration-200"
        style={{ 
          opacity: isHovered ? 1 : 0.95
        }}
      />
    </g>
  );
};

export default ConnectionLine;