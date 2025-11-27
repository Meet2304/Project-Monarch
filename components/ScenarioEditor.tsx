import React, { useState, useRef } from 'react';
import { Scenario, Component, CostType, RecurrencePeriod } from '../types';
import { CARD_STYLE, INPUT_STYLE, BUTTON_PRIMARY, BUTTON_SECONDARY, COST_TYPE_OPTIONS, RECURRENCE_OPTIONS, HELP_TEXT } from '../constants';
import { Plus, Trash2, ChevronDown, ChevronUp, X, Save, FileText, Copy } from 'lucide-react';
import Tooltip from './Tooltip';

interface Props {
  scenario: Scenario;
  onUpdateScenario: (s: Scenario) => void;
  allScenarios: Scenario[];
  onChangeScenario: (id: string) => void;
  onAddScenario: () => void;
  onDuplicateScenario: (id: string) => void;
  onDeleteScenario: (id: string) => void;
  currencySymbol: string;
}

const ScenarioEditor: React.FC<Props> = ({ 
  scenario, 
  onUpdateScenario, 
  allScenarios, 
  onChangeScenario,
  onAddScenario,
  onDuplicateScenario,
  onDeleteScenario,
  currencySymbol
}) => {
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  const updateMeta = (field: keyof Scenario, value: string) => {
    onUpdateScenario({ ...scenario, [field]: value });
  };

  const handleAddComponent = (newComponent: Component) => {
    onUpdateScenario({
      ...scenario,
      components: [...scenario.components, newComponent]
    });
    setIsAddingComponent(false);
    setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    onUpdateScenario({
      ...scenario,
      components: scenario.components.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };

  const removeComponent = (id: string) => {
    onUpdateScenario({
      ...scenario,
      components: scenario.components.filter(c => c.id !== id)
    });
  };

  return (
    <div className="flex flex-col h-full gap-0">
      
      {/* Browser-like Tabs */}
      <div className="flex items-end gap-1 overflow-x-auto custom-scrollbar pb-0 shrink-0 select-none">
        {allScenarios.map(s => {
          const isActive = s.id === scenario.id;
          return (
            <div 
              key={s.id}
              onClick={() => onChangeScenario(s.id)}
              className={`
                group relative min-w-[140px] max-w-[200px] h-9 px-3 flex items-center justify-between cursor-pointer border-t border-r border-l border-black transition-colors
                ${isActive ? 'bg-white -mb-px pb-1 z-10 font-bold' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}
              `}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                 <FileText size={12} className={isActive ? "text-black" : "text-gray-400"} />
                 <span className={`text-xs uppercase truncate ${isActive ? 'text-black' : ''}`}>
                   {s.name}
                 </span>
              </div>
              
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicateScenario(s.id); }}
                  className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-200 rounded-sm"
                  title="Duplicate Scenario"
                >
                  <Copy size={10} />
                </button>
                {allScenarios.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteScenario(s.id); }}
                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm"
                    title="Delete Scenario"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        <button 
          onClick={onAddScenario}
          className="h-8 w-8 flex items-center justify-center border border-black bg-white hover:bg-gray-100 ml-1 mb-1 transition-colors"
          title="Add New Scenario"
        >
          <Plus size={14} />
        </button>
        
        <div className="ml-2 mb-2">
          <Tooltip text={HELP_TEXT.SCENARIO_TABS} />
        </div>
      </div>

      <div className={`${CARD_STYLE} flex-1 flex flex-col min-h-0 border-t-black z-0`}>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-6">
           <div>
            <label className="text-[10px] font-bold uppercase mb-1 flex items-center text-gray-500">
              Scenario Name <Tooltip text={HELP_TEXT.SCENARIO_NAME} />
            </label>
            <input 
              className={`w-full ${INPUT_STYLE} font-bold`} 
              value={scenario.name}
              onChange={(e) => updateMeta('name', e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase mb-1 flex items-center text-gray-500">
              Description <Tooltip text={HELP_TEXT.SCENARIO_DESC} />
            </label>
            <input
              className={`w-full ${INPUT_STYLE}`} 
              value={scenario.description}
              onChange={(e) => updateMeta('description', e.target.value)}
              placeholder="Short description of this model..."
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-lg font-bold uppercase tracking-wider text-black flex items-center">
            Components
            <Tooltip text="The individual line items that make up your total cost." />
          </h2>
          {!isAddingComponent && (
            <button onClick={() => setIsAddingComponent(true)} className={BUTTON_PRIMARY}>
              <Plus size={14} className="mr-2 inline" /> Add Component
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {isAddingComponent && (
            <div className="border-2 border-black p-6 bg-gray-50 mb-6 shadow-xl animate-in fade-in slide-in-from-top-4">
              <AddComponentForm 
                onSave={handleAddComponent} 
                onCancel={() => setIsAddingComponent(false)}
                currencySymbol={currencySymbol}
              />
            </div>
          )}

          {scenario.components.length === 0 && !isAddingComponent && (
            <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-300">
              No components added yet. <br/> Click "Add Component" to start building costs.
            </div>
          )}
          
          {scenario.components.map((comp) => (
            <ComponentRow 
              key={comp.id} 
              component={comp} 
              onUpdate={(updates) => updateComponent(comp.id, updates)}
              onRemove={() => removeComponent(comp.id)}
              currencySymbol={currencySymbol}
            />
          ))}
          <div ref={listEndRef} />
        </div>
      </div>
    </div>
  );
};

const AddComponentForm: React.FC<{
  onSave: (c: Component) => void;
  onCancel: () => void;
  currencySymbol: string;
}> = ({ onSave, onCancel, currencySymbol }) => {
  const [name, setName] = useState('');
  const [costType, setCostType] = useState<CostType>(CostType.UNIT_BASED);
  
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [unitDenominator, setUnitDenominator] = useState(1);
  const [unitMeasurement, setUnitMeasurement] = useState('');

  const [recurrence, setRecurrence] = useState<RecurrencePeriod>('Monthly');

  const handleSave = () => {
    if (!name) return;

    const newComponent: Component = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      costType,
      quantity: quantity,
      pricePerUnit: pricePerUnit,
      unitDenominator: costType === CostType.UNIT_BASED ? unitDenominator : undefined,
      unitMeasurement: costType === CostType.UNIT_BASED ? unitMeasurement : undefined,
      recurrence: costType === CostType.FIXED ? recurrence : undefined
    };

    onSave(newComponent);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold uppercase text-sm">New Component Details</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-black">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
             Component Name <Tooltip text={HELP_TEXT.COMPONENT_NAME} />
          </label>
          <input 
            className={`w-full ${INPUT_STYLE}`}
            placeholder="e.g. GPT-4 API"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="md:col-span-1">
          <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
            Cost Type <Tooltip text={HELP_TEXT.COST_TYPE} />
          </label>
          <select 
            className={`w-full ${INPUT_STYLE}`}
            value={costType}
            onChange={(e) => setCostType(e.target.value as CostType)}
          >
            {COST_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {costType === CostType.UNIT_BASED && (
          <>
             <div className="md:col-span-2 grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
                    Price ({currencySymbol}) <Tooltip text={HELP_TEXT.PRICE} />
                  </label>
                  <input 
                    type="number" step="any"
                    className={`w-full ${INPUT_STYLE}`}
                    value={pricePerUnit || ''}
                    placeholder="0.0001"
                    onChange={(e) => setPricePerUnit(parseFloat(e.target.value))}
                  />
               </div>
               <div>
                 <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
                    Per N Units <Tooltip text={HELP_TEXT.UNIT_DENOMINATOR} />
                 </label>
                 <input 
                    type="number" step="1"
                    className={`w-full ${INPUT_STYLE}`}
                    value={unitDenominator || ''}
                    placeholder="1"
                    onChange={(e) => setUnitDenominator(parseFloat(e.target.value))}
                  />
               </div>
             </div>
             
             <div className="md:col-span-1">
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
                 Unit Name <Tooltip text={HELP_TEXT.UNIT_MEASURE} />
               </label>
               <input 
                 className={`w-full ${INPUT_STYLE}`}
                 placeholder="e.g. Tokens, Users"
                 value={unitMeasurement}
                 onChange={(e) => setUnitMeasurement(e.target.value)}
               />
             </div>
             
             <div className="md:col-span-1">
                <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
                  Units per Customer/Mo <Tooltip text={HELP_TEXT.QUANTITY} />
                </label>
                <input 
                  type="number"
                  step="any"
                  className={`w-full ${INPUT_STYLE}`}
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                />
             </div>
          </>
        )}

        {costType === CostType.FIXED && (
          <>
             <div className="md:col-span-1">
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
                 Cost Amount <Tooltip text={HELP_TEXT.PRICE} />
               </label>
               <div className="relative">
                 <span className="absolute left-2 top-2 text-gray-500 text-sm">{currencySymbol}</span>
                 <input 
                   type="number" step="any"
                   className={`w-full ${INPUT_STYLE} pl-6`}
                   value={pricePerUnit || ''}
                   placeholder="0.00"
                   onChange={(e) => setPricePerUnit(parseFloat(e.target.value))}
                 />
               </div>
             </div>
             <div className="md:col-span-1">
                <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
                  Recurrence <Tooltip text={HELP_TEXT.RECURRENCE} />
                </label>
                <select 
                  className={`w-full ${INPUT_STYLE}`}
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as RecurrencePeriod)}
                >
                  {RECURRENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
             </div>
          </>
        )}

        {costType === CostType.ONE_TIME && (
           <div className="md:col-span-1">
             <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Cost Amount</label>
             <div className="relative">
                 <span className="absolute left-2 top-2 text-gray-500 text-sm">{currencySymbol}</span>
                 <input 
                   type="number" step="any"
                   className={`w-full ${INPUT_STYLE} pl-6`}
                   value={pricePerUnit || ''}
                   placeholder="0.00"
                   onChange={(e) => setPricePerUnit(parseFloat(e.target.value))}
                 />
             </div>
           </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onCancel} className={BUTTON_SECONDARY}>Cancel</button>
        <button onClick={handleSave} className={BUTTON_PRIMARY + " flex items-center gap-2"}>
          <Save size={14} /> Add Component
        </button>
      </div>
    </div>
  );
};

const ComponentRow: React.FC<{
  component: Component;
  onUpdate: (c: Partial<Component>) => void;
  onRemove: () => void;
  currencySymbol: string;
}> = ({ component, onUpdate, onRemove, currencySymbol }) => {
  const [showAdvanced, setShowAdvanced] = useState(!!component.customFields);

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const calculateCost = () => {
    if (component.costType === CostType.UNIT_BASED) {
      const denom = component.unitDenominator || 1;
      return (component.pricePerUnit / denom) * component.quantity;
    }
    return component.pricePerUnit; // Fixed or One Time raw amount
  };

  return (
    <div className="border border-black p-4 bg-white transition-all hover:shadow-lg group">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-3">
          <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
             Name <Tooltip text={HELP_TEXT.COMPONENT_NAME} />
          </label>
          <input 
            className={`w-full ${INPUT_STYLE}`}
            value={component.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
             Type <Tooltip text={HELP_TEXT.COST_TYPE} />
          </label>
          <select 
            className={`w-full ${INPUT_STYLE}`}
            value={component.costType}
            onChange={(e) => onUpdate({ costType: e.target.value as CostType })}
          >
            {COST_TYPE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {component.costType === CostType.UNIT_BASED && (
          <>
             <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                   Price / N Units <Tooltip text={HELP_TEXT.PRICE} />
                </label>
                <div className="flex gap-1">
                  <input 
                    type="number" step="any"
                    className={`w-1/2 ${INPUT_STYLE}`}
                    value={component.pricePerUnit}
                    onChange={(e) => onUpdate({ pricePerUnit: parseFloat(e.target.value) })}
                    placeholder="$"
                  />
                  <input 
                    type="number" step="1"
                    className={`w-1/2 ${INPUT_STYLE}`}
                    value={component.unitDenominator || 1}
                    onChange={(e) => onUpdate({ unitDenominator: parseFloat(e.target.value) })}
                    placeholder="/"
                  />
                </div>
             </div>
             <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                   Unit Name <Tooltip text={HELP_TEXT.UNIT_MEASURE} />
                </label>
                <input 
                  className={`w-full ${INPUT_STYLE}`}
                  value={component.unitMeasurement || ''}
                  onChange={(e) => onUpdate({ unitMeasurement: e.target.value })}
                  placeholder="e.g. Tokens"
                />
             </div>
             <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                   Mo. Qty <Tooltip text={HELP_TEXT.QUANTITY} />
                </label>
                <input 
                  type="number" step="any"
                  className={`w-full ${INPUT_STYLE} p-1 text-center`}
                  value={component.quantity}
                  onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) })}
                />
             </div>
          </>
        )}

        {component.costType === CostType.FIXED && (
          <>
             <div className="md:col-span-3">
               <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                  Amount <Tooltip text={HELP_TEXT.PRICE} />
               </label>
               <input 
                 type="number" step="any"
                 className={`w-full ${INPUT_STYLE}`}
                 value={component.pricePerUnit}
                 onChange={(e) => onUpdate({ pricePerUnit: parseFloat(e.target.value) })}
               />
             </div>
             <div className="md:col-span-3">
               <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                  Recurrence <Tooltip text={HELP_TEXT.RECURRENCE} />
               </label>
               <select 
                  className={`w-full ${INPUT_STYLE}`}
                  value={component.recurrence || 'Monthly'}
                  onChange={(e) => onUpdate({ recurrence: e.target.value as RecurrencePeriod })}
                >
                  {RECURRENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
             </div>
          </>
        )}

         {component.costType === CostType.ONE_TIME && (
             <div className="md:col-span-3">
               <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                  Amount <Tooltip text={HELP_TEXT.PRICE} />
               </label>
               <input 
                 type="number" step="any"
                 className={`w-full ${INPUT_STYLE}`}
                 value={component.pricePerUnit}
                 onChange={(e) => onUpdate({ pricePerUnit: parseFloat(e.target.value) })}
               />
             </div>
        )}

        <div className="md:col-span-1 flex justify-end pt-6">
           <button onClick={onRemove} className="text-gray-300 hover:text-red-600 transition-colors">
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center border-t border-gray-100 pt-2">
         <div className="text-xs font-mono text-black flex gap-2">
           {component.costType === CostType.FIXED ? (
              <span>{component.recurrence} Cost: <span className="font-bold">{currencySymbol}{component.pricePerUnit}</span></span>
           ) : (
              <span>Calculated: <span className="font-bold">{currencySymbol}{calculateCost().toFixed(6).replace(/\.?0+$/, '')}</span></span>
           )}
         </div>
         
         <button 
           onClick={toggleAdvanced}
           className="text-[10px] uppercase font-bold text-gray-400 hover:text-black flex items-center gap-1"
         >
           Advanced {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
         </button>
      </div>

      {showAdvanced && (
        <div className="mt-2 bg-gray-50 p-3 border border-gray-200">
           <p className="text-[10px] text-gray-400 italic">Custom fields feature not fully implemented in this minimalist demo.</p>
        </div>
      )}
    </div>
  );
}

export default ScenarioEditor;