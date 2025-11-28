import React, { useState, useRef, useEffect } from 'react';
import { Scenario, Component, CostType, RecurrencePeriod } from '../types';
import { CARD_STYLE, INPUT_STYLE, BUTTON_PRIMARY, BUTTON_SECONDARY, COST_TYPE_OPTIONS, RECURRENCE_OPTIONS, HELP_TEXT } from '../constants';
import { Plus, Trash2, ChevronDown, ChevronUp, X, Save } from 'lucide-react';
import Tooltip from './Tooltip';

interface Props {
  scenario: Scenario;
  onUpdateScenario: (s: Scenario) => void;
  allScenarios: Scenario[];
  onChangeScenario: (id: string) => void;
  onAddScenario: () => void;
  onDeleteScenario: (id: string) => void;
}

const ScenarioEditor: React.FC<Props> = ({ 
  scenario, 
  onUpdateScenario, 
  allScenarios, 
  onChangeScenario,
  onAddScenario,
  onDeleteScenario
}) => {
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  // Updates for Scenario Metadata
  const updateMeta = (field: keyof Scenario, value: string) => {
    onUpdateScenario({ ...scenario, [field]: value });
  };

  // Component Management
  const handleAddComponent = (newComponent: Component) => {
    onUpdateScenario({
      ...scenario,
      components: [...scenario.components, newComponent]
    });
    setIsAddingComponent(false);
    // Scroll to bottom after adding
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
    <div className="flex flex-col h-full gap-6">
      {/* Scenario Selector & Metadata */}
      <div className={CARD_STYLE}>
        <div className="flex justify-between items-start mb-6 border-b border-black pb-4">
           <div>
             <h2 className="text-lg font-bold uppercase tracking-wider text-black flex items-center">
               Scenario Configuration
               <Tooltip text={HELP_TEXT.SCENARIO} />
             </h2>
             <p className="text-xs text-gray-500 mt-1">Select or define the context.</p>
           </div>
           <div className="flex gap-2">
             <select 
               className={`${INPUT_STYLE} min-w-[150px]`}
               value={scenario.id}
               onChange={(e) => onChangeScenario(e.target.value)}
             >
               {allScenarios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
             </select>
             <button onClick={onAddScenario} className={`${BUTTON_SECONDARY} px-2`} title="New Scenario">
               <Plus size={16} />
             </button>
             {allScenarios.length > 1 && (
               <button onClick={() => onDeleteScenario(scenario.id)} className={`${BUTTON_SECONDARY} px-2 text-red-600 border-red-200 hover:border-red-600 hover:bg-red-50`}>
                 <Trash2 size={16} />
               </button>
             )}
           </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Scenario Name</label>
            <input 
              className={`w-full ${INPUT_STYLE}`} 
              value={scenario.name}
              onChange={(e) => updateMeta('name', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Description</label>
            <textarea 
              className={`w-full ${INPUT_STYLE} h-20 resize-none`} 
              value={scenario.description}
              onChange={(e) => updateMeta('description', e.target.value)}
              placeholder="Describe the conditions of this scenario..."
            />
          </div>
        </div>
      </div>

      {/* Components Section */}
      <div className={`${CARD_STYLE} flex-1 flex flex-col min-h-0`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-black">Components</h2>
          {!isAddingComponent && (
            <button onClick={() => setIsAddingComponent(true)} className={BUTTON_PRIMARY}>
              <Plus size={14} className="mr-2 inline" /> Add Component
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          
          {/* Add Component Form */}
          {isAddingComponent && (
            <div className="border-2 border-black p-6 bg-gray-50 mb-6 shadow-xl animate-in fade-in slide-in-from-top-4">
              <AddComponentForm 
                onSave={handleAddComponent} 
                onCancel={() => setIsAddingComponent(false)} 
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
            />
          ))}
          <div ref={listEndRef} />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Add Form ---
const AddComponentForm: React.FC<{
  onSave: (c: Component) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [costType, setCostType] = useState<CostType>(CostType.UNIT_BASED);
  
  // Fields for Unit Based
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [unitMeasurement, setUnitMeasurement] = useState('');

  // Fields for Fixed
  const [recurrence, setRecurrence] = useState<RecurrencePeriod>('Monthly');

  const handleSave = () => {
    if (!name) return;

    const newComponent: Component = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      costType,
      quantity: quantity,
      pricePerUnit: pricePerUnit,
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
        {/* Common Fields */}
        <div className="md:col-span-1">
          <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Component Name</label>
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

        {/* --- Unit Based Options --- */}
        {costType === CostType.UNIT_BASED && (
          <>
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
                  Price Per Unit <Tooltip text={HELP_TEXT.PRICE} />
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                  <input 
                    type="number"
                    className={`w-full ${INPUT_STYLE} pl-5`}
                    value={pricePerUnit || ''}
                    placeholder="0.00"
                    onChange={(e) => setPricePerUnit(parseFloat(e.target.value))}
                  />
                </div>
             </div>
             <div className="md:col-span-1">
                <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
                  Units per Customer/Mo <Tooltip text={HELP_TEXT.QUANTITY} />
                </label>
                <input 
                  type="number"
                  className={`w-full ${INPUT_STYLE}`}
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                />
             </div>
          </>
        )}

        {/* --- Fixed Recurring Options --- */}
        {costType === CostType.FIXED && (
          <>
             <div className="md:col-span-1">
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center">
                 Cost Amount <Tooltip text={HELP_TEXT.PRICE} />
               </label>
               <div className="relative">
                 <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                 <input 
                   type="number"
                   className={`w-full ${INPUT_STYLE} pl-5`}
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
             {/* Hidden Quantity logic for Fixed - defaults to 1 internally for math */}
          </>
        )}

        {/* --- One Time Options --- */}
        {costType === CostType.ONE_TIME && (
           <div className="md:col-span-1">
             <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Cost Amount</label>
             <div className="relative">
                 <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                 <input 
                   type="number"
                   className={`w-full ${INPUT_STYLE} pl-5`}
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


// --- Sub-Component: Component Row ---
const ComponentRow: React.FC<{
  component: Component;
  onUpdate: (c: Partial<Component>) => void;
  onRemove: () => void;
}> = ({ component, onUpdate, onRemove }) => {
  const [showAdvanced, setShowAdvanced] = useState(!!component.customFields);

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleCustomFieldChange = (key: string, value: string) => {
    onUpdate({ customFields: { key, value } });
  };

  return (
    <div className="border border-black p-4 bg-white transition-all hover:shadow-lg group">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        
        {/* Name */}
        <div className="md:col-span-3">
          <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Name</label>
          <input 
            className={`w-full ${INPUT_STYLE}`}
            value={component.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>

        {/* Type */}
        <div className="md:col-span-3">
          <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Type</label>
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

        {/* Dynamic Fields Display */}
        {component.costType === CostType.UNIT_BASED && (
          <>
             <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Unit</label>
                <input 
                  className={`w-full ${INPUT_STYLE}`}
                  value={component.unitMeasurement || ''}
                  onChange={(e) => onUpdate({ unitMeasurement: e.target.value })}
                  placeholder="Unit"
                />
             </div>
             <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Price/Unit</label>
                <input 
                  type="number"
                  className={`w-full ${INPUT_STYLE}`}
                  value={component.pricePerUnit}
                  onChange={(e) => onUpdate({ pricePerUnit: parseFloat(e.target.value) })}
                />
             </div>
             <div className="md:col-span-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Qty</label>
                <input 
                  type="number"
                  className={`w-full ${INPUT_STYLE} p-1 text-center`}
                  value={component.quantity}
                  onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) })}
                />
             </div>
          </>
        )}

        {component.costType === CostType.FIXED && (
          <>
             <div className="md:col-span-2">
               <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Amount</label>
               <input 
                 type="number"
                 className={`w-full ${INPUT_STYLE}`}
                 value={component.pricePerUnit}
                 onChange={(e) => onUpdate({ pricePerUnit: parseFloat(e.target.value) })}
               />
             </div>
             <div className="md:col-span-3">
               <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Recurrence</label>
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
             <div className="md:col-span-2">
               <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Amount</label>
               <input 
                 type="number"
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

      {/* Footer / Advanced */}
      <div className="mt-3 flex justify-between items-center border-t border-gray-100 pt-2">
         <div className="text-xs font-mono text-black flex gap-2">
           {component.costType === CostType.FIXED ? (
              <span>{component.recurrence} Cost: <span className="font-bold">${component.pricePerUnit.toFixed(4)}</span></span>
           ) : (
              <span>Calculated: <span className="font-bold">${(component.quantity * component.pricePerUnit).toFixed(4)}</span></span>
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
          <p className="text-[10px] font-bold uppercase mb-2">Custom Field</p>
          <div className="flex gap-2">
            <input 
              placeholder="Field Name" 
              className={`flex-1 ${INPUT_STYLE}`}
              value={component.customFields?.key || ''}
              onChange={(e) => handleCustomFieldChange(e.target.value, component.customFields?.value || '')}
            />
            <input 
              placeholder="Value" 
              className={`flex-1 ${INPUT_STYLE}`}
              value={component.customFields?.value || ''}
              onChange={(e) => handleCustomFieldChange(component.customFields?.key || '', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ScenarioEditor;