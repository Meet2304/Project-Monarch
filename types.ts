export enum CostType {
  FIXED = 'Fixed Recurring Cost',
  UNIT_BASED = 'Unit Based Cost',
  ONE_TIME = 'One Time Cost',
}

export type RecurrencePeriod = 'Monthly' | 'Yearly';

export interface Component {
  id: string;
  name: string;
  costType: CostType;
  quantity: number;
  pricePerUnit: number;
  unitMeasurement?: string; // e.g. "Tokens", "GB", "Hours"
  recurrence?: RecurrencePeriod;
  customFields?: { key: string; value: string }; // Optional advanced field
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  components: Component[];
}

export interface AnalysisResult {
  totalCost: number; // Normalized Monthly Cost
  breakdown: {
    name: string;
    cost: number;
    percent: number;
    type: CostType;
  }[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: number; // timestamp
  scenarios: Scenario[];
}