import { Scenario, Project, CostType, Component } from './types';

// Minimalist Design System Constants
export const BORDER_PRIMARY = "border border-black";
export const BG_PRIMARY = "bg-white";
export const BUTTON_PRIMARY = "bg-black text-white hover:bg-gray-800 transition-colors rounded-none px-4 py-2 font-medium uppercase tracking-wide text-xs";
export const BUTTON_SECONDARY = "bg-white text-black border border-black hover:bg-gray-100 transition-colors rounded-none px-4 py-2 font-medium uppercase tracking-wide text-xs";
export const BUTTON_DANGER = "bg-white text-red-600 border border-red-600 hover:bg-red-50 transition-colors rounded-none px-4 py-2 font-medium uppercase tracking-wide text-xs";
export const INPUT_STYLE = "bg-white border border-black rounded-none p-2 text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black text-sm";
export const CARD_STYLE = "bg-white border border-black p-6 rounded-none shadow-none";

// Empty templates
export const EMPTY_SCENARIO: Scenario = {
  id: 'default_scenario',
  name: 'Initial Scenario',
  description: 'Base case analysis',
  components: []
};

export const NEW_PROJECT_TEMPLATE: Omit<Project, 'id' | 'lastUpdated'> = {
  name: 'New Project',
  description: '',
  scenarios: [EMPTY_SCENARIO]
};

export const COST_TYPE_OPTIONS = [
  CostType.UNIT_BASED,
  CostType.FIXED,
  CostType.ONE_TIME
];

export const RECURRENCE_OPTIONS = ['Monthly', 'Yearly'];

// Tooltip Help Text
export const HELP_TEXT = {
  SCENARIO: "A specific version of your business model (e.g., 'Best Case', 'MVP').",
  COST_TYPE: "How this cost behaves relative to your business.",
  UNIT_BASED: "Costs that increase with every unit sold or used (e.g., API tokens).",
  FIXED: "Recurring costs that remain stable regardless of volume (e.g., Server subscription).",
  ONE_TIME: "Upfront setup fees or single-purchase assets.",
  QUANTITY: "The amount of units consumed per customer/month.",
  PRICE: "The cost per single unit.",
  RECURRENCE: "How often this bill occurs.",
  UNIT_MEASURE: "The unit of measurement (e.g. 'GB', 'Tokens', 'Hours')."
};