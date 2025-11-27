import React, { useState, useMemo } from 'react';
import { Scenario, Component, CostType } from '../types';
import { CARD_STYLE, HELP_TEXT } from '../constants';
import Tooltip from './Tooltip';
import { AlertCircle, CheckSquare, Square } from 'lucide-react';

interface Props {
  scenarios: Scenario[];
  currencySymbol: string;
}

const formatCurrency = (val: number, symbol: string) => {
  if (val === 0) return `${symbol}0.00`;
  const absVal = Math.abs(val);
  if (absVal < 0.01) return `${symbol}${val.toFixed(6)}`;
  if (absVal < 1) return `${symbol}${val.toFixed(4)}`;
  return `${symbol}${val.toFixed(2)}`;
};

const CompareView: React.FC<Props> = ({ scenarios, currencySymbol }) => {
  // Default to selecting the first 3 or all if less
  const [selectedIds, setSelectedIds] = useState<string[]>(
    scenarios.slice(0, 3).map(s => s.id)
  );

  const toggleScenario = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) { // Prevent empty selection
        setSelectedIds(selectedIds.filter(sid => sid !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const activeScenarios = useMemo(() => {
    return scenarios.filter(s => selectedIds.includes(s.id));
  }, [scenarios, selectedIds]);

  const allComponentNames = useMemo(() => {
    const names = new Set<string>();
    activeScenarios.forEach(s => s.components.forEach(c => names.add(c.name)));
    return Array.from(names).sort();
  }, [activeScenarios]);

  const getCost = (c?: Component) => {
    if (!c) return 0;
    if (c.costType === CostType.UNIT_BASED) {
       const denom = c.unitDenominator || 1;
       return (c.pricePerUnit / denom) * c.quantity;
    }
    if (c.costType === CostType.FIXED) return c.recurrence === 'Yearly' ? c.pricePerUnit/12 : c.pricePerUnit;
    return c.pricePerUnit;
  };

  const getTotal = (s: Scenario) => {
    return s.components.reduce((acc, c) => acc + getCost(c), 0);
  };

  if (scenarios.length === 0) return null;

  return (
    <div className={`${CARD_STYLE} h-full flex flex-col overflow-hidden bg-white`}>
      <header className="mb-6 border-b border-black pb-4 shrink-0">
         <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center">
             Compare Matrix
             <Tooltip text={HELP_TEXT.COMPARE_MODE} />
         </h2>
         <p className="text-xs font-mono text-gray-400">Select scenarios to compare side-by-side</p>
      </header>

      {/* Selector Bar */}
      <div className="flex flex-wrap gap-2 mb-6 shrink-0">
        {scenarios.map(s => {
          const isSelected = selectedIds.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggleScenario(s.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase border border-black transition-all
                ${isSelected ? 'bg-black text-white' : 'bg-white text-gray-400 hover:text-black'}`}
            >
              {isSelected ? <CheckSquare size={12} /> : <Square size={12} />}
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Comparison Matrix Table */}
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar border border-black">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-100 text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
              <th className="p-3 border-b border-black border-r bg-gray-100 min-w-[200px]">Component Name</th>
              {activeScenarios.map(s => (
                <th key={s.id} className="p-3 border-b border-black border-r last:border-r-0 text-right bg-gray-100 min-w-[150px]">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
             {/* Total Row */}
             <tr className="bg-black text-white font-bold border-b border-black">
               <td className="p-3 border-r border-gray-700 uppercase">Total Monthly Cost</td>
               {activeScenarios.map(s => (
                 <td key={s.id} className="p-3 border-r border-gray-700 last:border-r-0 text-right font-mono text-yellow-400">
                    {formatCurrency(getTotal(s), currencySymbol)}
                 </td>
               ))}
             </tr>

             {/* Components Rows */}
             {allComponentNames.map(name => (
               <tr key={name} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 group">
                 <td className="p-3 border-r border-gray-100 font-medium text-gray-900">{name}</td>
                 {activeScenarios.map(s => {
                   const comp = s.components.find(c => c.name === name);
                   const cost = getCost(comp);
                   return (
                     <td key={s.id} className="p-3 border-r border-gray-100 last:border-r-0 text-right font-mono text-gray-600">
                       {cost > 0 ? formatCurrency(cost, currencySymbol) : '-'}
                     </td>
                   );
                 })}
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareView;