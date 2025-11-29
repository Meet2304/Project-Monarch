import React from 'react';
import { Info } from 'lucide-react';

interface Props {
  text: string;
}

const Tooltip: React.FC<Props> = ({ text }) => {
  return (
    <div className="group relative inline-flex items-center ml-1 align-middle cursor-help">
      <Info size={12} className="text-gray-400 hover:text-black transition-colors" />
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <div className="bg-black text-white text-[10px] p-2 text-center leading-tight shadow-lg border border-white">
          {text}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;