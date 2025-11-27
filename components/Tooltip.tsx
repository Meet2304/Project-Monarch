import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

interface Props {
  text: string;
}

const Tooltip: React.FC<Props> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 10, // Just above the icon
        left: rect.left + rect.width / 2,
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Close on scroll to prevent detached floating tooltips
  useEffect(() => {
    const handleScroll = () => setIsVisible(false);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  return (
    <>
      <div 
        ref={triggerRef}
        className="inline-flex items-center ml-1 align-middle cursor-help"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Info size={12} className="text-gray-400 hover:text-black transition-colors" />
      </div>

      {isVisible && createPortal(
        <div 
          className="fixed z-[9999] pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ top: coords.top, left: coords.left }}
        >
          <div className="bg-black text-white text-[10px] p-3 text-center leading-relaxed shadow-xl border border-white max-w-[200px] mb-2">
            {text}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;