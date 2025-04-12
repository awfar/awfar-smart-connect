
export interface LeadSourceData {
  name: string;
  value: number;
  percentage?: number;
}

export interface LeadFunnelData {
  stage: string;
  count: number;
}

export interface ActivityData {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  user: {
    name: string;
    initials: string;
  };
  entity?: {
    name: string;
  } | null;
  result?: string | null;
}

export interface ActivityTypeData {
  name: string;
  count: number;
}

export interface ActivityEfficiencyData {
  type: string;
  efficiency: number;
  impact: number;
}

export interface SalesData {
  date: string;
  amount: number;
  category?: string;
}

export interface TeamPerformanceData {
  name: string;
  value: number;
  metric: string;
}

// Add missing types for ProductsPerformanceChart component
export interface ProductData {
  name: string;
  sales: number;
  growth?: number;
}

export interface ProductComparisonData {
  name: string;
  current: number;
  previous: number;
}

export interface ProductDistributionData {
  name: string;
  value: number;
}

// Add missing types for SalesComparisonChart component
export interface SalesComparisonData {
  name: string;
  current: number;
  previous: number;
  difference?: number;
}

export interface ConversionRateData {
  stage: string;
  rate: number;
}

// Add missing types for TeamPerformanceReport component
export interface TeamData {
  name: string;
  sales: number;
  target?: number;
  conversion?: number;
}

export interface TeamTargetsData {
  name: string;
  target: number;
  actual: number;
  achievement: number; // percentage
}

export interface TeamEfficiencyData {
  name: string;
  efficiency: number;
  average: number;
}
