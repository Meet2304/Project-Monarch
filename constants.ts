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
export const CURRENCY_OPTIONS = ['$', '€', '£', '₹', '¥', 'R', 'kr'];
export const FIELD_TYPE_OPTIONS = ['Text', 'Number', 'Date', 'Select'];

// Tooltip Help Text
export const HELP_TEXT = {
  PROJECT_HEADER: "This is your project workspace. Manage different cost scenarios and visualize data here.",
  // Scenario Editor
  SCENARIO_TABS: "Tabs allow you to switch between different versions of your model (e.g., 'Aggressive Growth' vs 'Conservative').",
  SCENARIO_NAME: "A unique name to identify this specific version of your cost analysis.",
  SCENARIO_DESC: "Contextual notes about the assumptions made in this scenario.",
  
  // Component Form
  COMPONENT_NAME: "What is this cost item? (e.g., 'OpenAI API' or 'AWS EC2').",
  COST_TYPE: "How is this billed? 'Unit Based' scales with usage, 'Fixed' is recurring (subscriptions), 'One Time' is upfront.",
  UNIT_MEASURE: "The unit of billing (e.g., 'Tokens', 'GB', 'API Calls').",
  PRICE: "The raw cost charged by the vendor.",
  UNIT_DENOMINATOR: "Use this for bulk pricing. If price is $0.50 per 1M tokens, enter 0.50 in Price and 1000000 here.",
  QUANTITY: "The estimated volume used by ONE customer per month.",
  RECURRENCE: "Billing frequency (Monthly vs Yearly) for fixed costs.",
  
  // Dashboard
  DASHBOARD_TITLE: "Calculated economics per customer per month.",
  GEMINI_ADVISOR: "Ask AI to analyze your cost structure and suggest optimizations.",
  
  // Compare
  COMPARE_MODE: "Select multiple scenarios to see a side-by-side cost matrix.",
  ADVANCED_FIELD: "Add custom metadata for internal tracking."
};