
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
