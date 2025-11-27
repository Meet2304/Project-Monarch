import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Scenario, AnalysisResult, CostType } from '../types';
import { CARD_STYLE, HELP_TEXT } from '../constants';
import { analyzeEconomics } from '../services/geminiService';
import { Loader2, ArrowRight } from 'lucide-react';
import Tooltip from './Tooltip';

interface Props {
  scenario: Scenario;
  currencySymbol: string;
}

const COLORS = ['#000000', '#404040', '#737373', '#a3a3a3', '#d4d4d4', '#e5e5e5'];

const formatCurrency = (val: number, symbol: string) => {
  if (val === 0) return `${symbol}0.00`;
  const absVal = Math.abs(val);
  if (absVal < 0.01) return `${symbol}${val.toFixed(6)}`;
  if (absVal < 1) return `${symbol}${val.toFixed(4)}`;
  return `${symbol}${val.toFixed(2)}`;
};

const Dashboard: React.FC<Props> = ({ scenario, currencySymbol }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const analysis: AnalysisResult = useMemo(() => {
    let total = 0;
    const breakdown = scenario.components.map(comp => {
      let cost = 0;

      if (comp.costType === CostType.UNIT_BASED) {
        // Price per Denom * Qty
        const denom = comp.unitDenominator || 1;
        cost = (comp.pricePerUnit / denom) * comp.quantity;
      } else if (comp.costType === CostType.FIXED) {
        if (comp.recurrence === 'Yearly') {
          cost = comp.pricePerUnit / 12;
        } else {
          cost = comp.pricePerUnit;
        }
      } else if (comp.costType === CostType.ONE_TIME) {
        cost = comp.pricePerUnit;
      }

      total += cost;
      return {
        name: comp.name,
        cost: cost,
        percent: 0,
        type: comp.costType
      };
    }).filter(i => i.cost > 0);

    breakdown.forEach(item => {
      item.percent = total > 0 ? (item.cost / total) * 100 : 0;
    });

    return { totalCost: total, breakdown };
  }, [scenario]);

  const handleRunAi = async () => {
    if (analysis.totalCost === 0) return;
    setIsLoadingAi(true);
    setAiAnalysis(null);
    const result = await analyzeEconomics(scenario, analysis);
    setAiAnalysis(result);
    setIsLoadingAi(false);
  };

  const hasData = analysis.totalCost > 0;

  return (
    <div className={`${CARD_STYLE} h-full flex flex-col`}>
      <header className="mb-6 border-b border-black pb-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-black mb-1 flex items-center">
          Analysis
          <Tooltip text={HELP_TEXT.DASHBOARD_TITLE} />
        </h2>
        <p className="text-xs text-gray-500 mb-4">Real-time cost breakdown (Monthly View).</p>
        
        <div className="flex items-baseline gap-2">
           <span className="text-4xl font-black text-black tracking-tighter">
            {formatCurrency(analysis.totalCost, currencySymbol)}
          </span>
          <span className="text-gray-500 font-medium text-xs">/ month</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
        {/* Chart Section */}
        <div className="flex flex-col min-h-[250px] border border-gray-200 p-4 shrink-0">
          <h3 className="text-xs font-bold uppercase text-black mb-4">Cost Distribution</h3>
          
          {!hasData ? (
             <div className="flex-1 flex items-center justify-center text-gray-400 text-xs text-center">
               Add components to <br/> visualize costs.
             </div>
          ) : (
            <>
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="cost"
                      stroke="none"
                    >
                      {analysis.breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => formatCurrency(value, currencySymbol)}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: '0px', color: '#000000', border: '1px solid black' }}
                      itemStyle={{ color: '#000000' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                     <div className="text-[10px] text-gray-500 uppercase">Items</div>
                     <div className="text-xl font-bold text-black">{analysis.breakdown.length}</div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-2 space-y-2">
                {analysis.breakdown.sort((a,b) => b.cost - a.cost).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-100 pb-1 last:border-0">
                     <div className="flex items-center gap-2 max-w-[70%]">
                        <div className="w-2 h-2 rounded-none border border-black shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-black font-medium truncate" title={item.name}>{item.name}</span>
                     </div>
                     <span className="font-mono text-black">{formatCurrency(item.cost, currencySymbol)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* AI Analysis Section */}
        <div className="flex flex-col border border-black p-0 shrink-0">
          <div className="bg-black text-white p-3 flex justify-between items-center">
             <h3 className="text-xs font-bold uppercase flex items-center">
                Gemini Advisor <Tooltip text={HELP_TEXT.GEMINI_ADVISOR} />
             </h3>
             <button
               onClick={handleRunAi}
               disabled={isLoadingAi || !hasData}
               className="bg-white text-black px-2 py-1 text-[10px] font-bold uppercase hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center gap-2"
             >
               {isLoadingAi ? <Loader2 className="animate-spin w-3 h-3" /> : <>Run <ArrowRight size={10} /></>}
             </button>
          </div>

          <div className="p-4 bg-gray-50 min-h-[150px]">
            {aiAnalysis ? (
              <div className="prose prose-sm prose-p:text-black prose-headings:text-black max-w-none">
                 {aiAnalysis.split('\n').map((line, i) => (
                   <p key={i} className="mb-2 text-xs leading-relaxed text-black font-light">{line}</p>
                 ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                <p className="text-xs max-w-[150px]">Click "Run" for AI insights on your unit economics.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;