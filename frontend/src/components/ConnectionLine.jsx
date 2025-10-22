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
      {/* Gölge efekti */}
      <path
        d={pathData}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={isHovered ? 6 : 4}
        fill="none"
        strokeLinecap="round"
        transform="translate(2, 2)"
      />
      
      {/* Ana çizgi */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth={isHovered ? 5 : 3}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={isHovered ? '0' : '8,4'}
        className="transition-all duration-200"
      />
      
      {/* Hover durumunda tıklanabilir alan */}
      {isHovered && (
        <path
          d={pathData}
          stroke="transparent"
          strokeWidth={20}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

export default ConnectionLine;