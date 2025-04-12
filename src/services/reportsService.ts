
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchDeals } from "./dealsService";
import { fetchLeadById, getLeads } from "./leadsService";
import { fetchUsers } from "./users";

// Types for report data
export interface ReportData {
  salesData: SalesData[];
  leadSources: LeadSourceData[];
  teamData: TeamData[];
  productsData: ProductData[];
  salesComparisonData: SalesComparisonData[];
  industrySalesData: IndustrySalesData[];
  conversionRateData: ConversionRateData[];
  leadFunnelData: LeadFunnelData[];
  leadsGrowthData: LeadsGrowthData[];
  teamTargetsData: TeamTargetsData[];
  teamEfficiencyData: TeamEfficiencyData[];
  productComparisonData: ProductComparisonData[];
  productDistributionData: ProductDistributionData[];
  activitiesData: ActivityData[];
  activityTypesData: ActivityTypeData[];
  activityEfficiencyData: ActivityEfficiencyData[];
}

export interface SalesData {
  name: string;
  value: number;
  target?: number;
}

export interface LeadSourceData {
  name: string;
  value: number;
  percentage?: number;
}

export interface TeamData {
  name: string;
  sales: number;
  target: number;
  conversion?: number;
}

export interface ProductData {
  name: string;
  sales: number;
  growth?: number;
}

export interface SalesComparisonData {
  name: string;
  current: number;
  previous: number;
  difference?: number;
}

export interface IndustrySalesData {
  industry: string;
  value: number;
  percentage: number;
}

export interface ConversionRateData {
  stage: string;
  rate: number;
}

export interface LeadFunnelData {
  stage: string;
  count: number;
}

export interface LeadsGrowthData {
  period: string;
  count: number;
  growth: number;
}

export interface TeamTargetsData {
  name: string;
  actual: number;
  target: number;
  achievement: number;
}

export interface TeamEfficiencyData {
  name: string;
  efficiency: number;
  average: number;
}

export interface ProductComparisonData {
  name: string;
  current: number;
  previous: number;
  growth: number;
}

export interface ProductDistributionData {
  name: string;
  value: number;
  percentage: number;
}

export interface ActivityData {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  entity?: {
    type: string;
    name: string;
    id: string;
  };
  result?: string;
}

export interface ActivityTypeData {
  type: string;
  count: number;
  percentage: number;
}

export interface ActivityEfficiencyData {
  type: string;
  efficiency: number;
  impact: number;
}

// Generate monthly data based on the period
const generateMonthlyData = (period: string): SalesData[] => {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  // Determine how many periods to show based on the selected timeframe
  let periodCount = 12; // Default to full year
  let periodNames = months;

  if (period === 'quarterly') {
    periodCount = 4;
    periodNames = ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'];
  } else if (period === 'monthly') {
    periodCount = 4;
    periodNames = months.slice(0, 4); // Show only last 4 months
  } else if (period === 'weekly') {
    periodCount = 4;
    periodNames = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'];
  } else if (period === 'daily') {
    periodCount = 7;
    periodNames = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
  }

  return Array.from({ length: periodCount }, (_, i) => {
    const value = Math.floor(Math.random() * 100000) + 50000;
    const target = Math.floor(value * (Math.random() * 0.4 + 0.9)); // Target between 90-130% of value
    return {
      name: periodNames[i % periodNames.length],
      value,
      target
    };
  });
};

// Fetch or mock report data
export const fetchReportData = async (period: string): Promise<ReportData> => {
  try {
    // In a real application, you would fetch this data from Supabase
    // For now, we'll return mock data
    
    // Try to get real deals data
    const deals = await fetchDeals().catch(() => []);
    const leads = await getLeads().catch(() => []);
    const users = await fetchUsers().catch(() => []);
    
    console.log("Fetched real data for reports:", { 
      dealsCount: deals.length, 
      leadsCount: leads.length,
      usersCount: users.length 
    });
    
    // Use real data if available, otherwise use mock data
    const salesData = generateMonthlyData(period);
    
    // Generate lead sources data
    const leadSources = [
      { name: 'نموذج موقع', value: leads.filter(l => l.source === 'موقع الكتروني').length || 35, percentage: 35 },
      { name: 'إحالة', value: leads.filter(l => l.source === 'إحالة').length || 25, percentage: 25 },
      { name: 'معرض', value: leads.filter(l => l.source === 'معرض').length || 20, percentage: 20 },
      { name: 'واتساب', value: leads.filter(l => l.source === 'واتساب').length || 15, percentage: 15 },
      { name: 'اتصال مباشر', value: leads.filter(l => l.source === 'اتصال مباشر').length || 5, percentage: 5 },
    ];
    
    // Generate team performance data
    const teamData = (users || []).slice(0, 5).map((user, i) => ({
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || `موظف ${i+1}`,
      sales: Math.floor(Math.random() * 50000) + 30000,
      target: Math.floor(Math.random() * 50000) + 30000,
      conversion: Math.floor(Math.random() * 30) + 50, // 50-80% conversion rate
    }));
    
    // If no real users, add mock data
    if (teamData.length === 0) {
      teamData.push(
        { name: 'أحمد محمد', sales: 76000, target: 70000, conversion: 72 },
        { name: 'سارة أحمد', sales: 65000, target: 60000, conversion: 68 },
        { name: 'محمد علي', sales: 45000, target: 50000, conversion: 56 },
        { name: 'فاطمة حسن', sales: 55000, target: 45000, conversion: 75 },
        { name: 'عمر خالد', sales: 38000, target: 40000, conversion: 62 }
      );
    }

    return {
      salesData,
      leadSources,
      teamData,
      
      // Product performance data
      productsData: [
        { name: 'المنتج أ', sales: 450000, growth: 15 },
        { name: 'المنتج ب', sales: 320000, growth: 8 },
        { name: 'المنتج ج', sales: 280000, growth: -3 },
        { name: 'المنتج د', sales: 210000, growth: 22 },
        { name: 'المنتج هـ', sales: 180000, growth: 5 },
      ],
      
      // Sales comparison data
      salesComparisonData: [
        { name: 'يناير', current: 95000, previous: 82000, difference: 13000 },
        { name: 'فبراير', current: 102000, previous: 88000, difference: 14000 },
        { name: 'مارس', current: 115000, previous: 95000, difference: 20000 },
        { name: 'أبريل', current: 125000, previous: 105000, difference: 20000 },
        { name: 'مايو', current: 118000, previous: 112000, difference: 6000 },
        { name: 'يونيو', current: 135000, previous: 120000, difference: 15000 },
      ],
      
      // Industry sales data
      industrySalesData: [
        { industry: 'تكنولوجيا المعلومات', value: 350000, percentage: 35 },
        { industry: 'الصحة', value: 220000, percentage: 22 },
        { industry: 'التعليم', value: 180000, percentage: 18 },
        { industry: 'التجزئة', value: 150000, percentage: 15 },
        { industry: 'أخرى', value: 100000, percentage: 10 },
      ],
      
      // Conversion rate data
      conversionRateData: [
        { stage: 'مؤهل', rate: 70 },
        { stage: 'اجتماع', rate: 45 },
        { stage: 'عرض سعر', rate: 30 },
        { stage: 'تفاوض', rate: 20 },
        { stage: 'مغلق مكسب', rate: 15 },
      ],
      
      // Lead funnel data
      leadFunnelData: [
        { stage: 'جميع العملاء', count: 1000 },
        { stage: 'عملاء مؤهلين', count: 700 },
        { stage: 'اجتماعات', count: 450 },
        { stage: 'عروض أسعار', count: 300 },
        { stage: 'تفاوض', count: 200 },
        { stage: 'صفقات مغلقة', count: 150 },
      ],
      
      // Leads growth data
      leadsGrowthData: [
        { period: 'يناير', count: 85, growth: 0 },
        { period: 'فبراير', count: 95, growth: 12 },
        { period: 'مارس', count: 110, growth: 16 },
        { period: 'أبريل', count: 135, growth: 23 },
        { period: 'مايو', count: 150, growth: 11 },
        { period: 'يونيو', count: 180, growth: 20 },
      ],
      
      // Team targets data
      teamTargetsData: [
        { name: 'أحمد محمد', actual: 76000, target: 70000, achievement: 109 },
        { name: 'سارة أحمد', actual: 65000, target: 60000, achievement: 108 },
        { name: 'محمد علي', actual: 45000, target: 50000, achievement: 90 },
        { name: 'فاطمة حسن', actual: 55000, target: 45000, achievement: 122 },
        { name: 'عمر خالد', actual: 38000, target: 40000, achievement: 95 },
      ],
      
      // Team efficiency data
      teamEfficiencyData: [
        { name: 'أحمد محمد', efficiency: 85, average: 75 },
        { name: 'سارة أحمد', efficiency: 92, average: 75 },
        { name: 'محمد علي', efficiency: 68, average: 75 },
        { name: 'فاطمة حسن', efficiency: 78, average: 75 },
        { name: 'عمر خالد', efficiency: 72, average: 75 },
      ],
      
      // Product comparison data
      productComparisonData: [
        { name: 'المنتج أ', current: 450000, previous: 390000, growth: 15 },
        { name: 'المنتج ب', current: 320000, previous: 296000, growth: 8 },
        { name: 'المنتج ج', current: 280000, previous: 288000, growth: -3 },
        { name: 'المنتج د', current: 210000, previous: 172000, growth: 22 },
        { name: 'المنتج هـ', current: 180000, previous: 171000, growth: 5 },
      ],
      
      // Product distribution data
      productDistributionData: [
        { name: 'المنتج أ', value: 450000, percentage: 31 },
        { name: 'المنتج ب', value: 320000, percentage: 22 },
        { name: 'المنتج ج', value: 280000, percentage: 20 },
        { name: 'المنتج د', value: 210000, percentage: 15 },
        { name: 'المنتج هـ', value: 180000, percentage: 12 },
      ],
      
      // Activities data
      activitiesData: [
        {
          id: '1',
          type: 'اتصال',
          description: 'اتصال هاتفي مع العميل لمناقشة العرض المقدم',
          timestamp: '2023-12-15T14:30:00Z',
          user: {
            name: 'أحمد محمد',
            initials: 'أم'
          },
          entity: {
            type: 'lead',
            name: 'شركة التقنية المتطورة',
            id: 'lead-1'
          },
          result: 'إيجابي'
        },
        {
          id: '2',
          type: 'اجتماع',
          description: 'اجتماع تقديم عرض المنتجات الجديدة',
          timestamp: '2023-12-14T10:00:00Z',
          user: {
            name: 'سارة أحمد',
            initials: 'سأ'
          },
          entity: {
            type: 'lead',
            name: 'مجموعة الخليج للاستثمار',
            id: 'lead-2'
          },
          result: 'طلب عرض سعر'
        },
        {
          id: '3',
          type: 'بريد إلكتروني',
          description: 'إرسال عرض السعر النهائي والشروط',
          timestamp: '2023-12-13T09:15:00Z',
          user: {
            name: 'محمد علي',
            initials: 'مع'
          },
          entity: {
            type: 'lead',
            name: 'شركة الأفق الدولية',
            id: 'lead-3'
          },
          result: 'في انتظار الرد'
        },
        {
          id: '4',
          type: 'ملاحظة',
          description: 'تسجيل ملاحظات حول متطلبات العميل الإضافية',
          timestamp: '2023-12-12T16:45:00Z',
          user: {
            name: 'فاطمة حسن',
            initials: 'فح'
          },
          entity: {
            type: 'lead',
            name: 'مؤسسة الإبداع للحلول التقنية',
            id: 'lead-4'
          }
        },
        {
          id: '5',
          type: 'متابعة',
          description: 'متابعة العميل بخصوص العرض المقدم الأسبوع الماضي',
          timestamp: '2023-12-11T11:30:00Z',
          user: {
            name: 'عمر خالد',
            initials: 'عخ'
          },
          entity: {
            type: 'lead',
            name: 'شركة النور للاتصالات',
            id: 'lead-5'
          },
          result: 'طلب وقت إضافي للمراجعة'
        }
      ],
      
      // Activity types data
      activityTypesData: [
        { type: 'اتصال', count: 120, percentage: 35 },
        { type: 'اجتماع', count: 85, percentage: 25 },
        { type: 'بريد إلكتروني', count: 65, percentage: 19 },
        { type: 'ملاحظة', count: 45, percentage: 13 },
        { type: 'متابعة', count: 30, percentage: 8 }
      ],
      
      // Activity efficiency data
      activityEfficiencyData: [
        { type: 'اتصال', efficiency: 65, impact: 70 },
        { type: 'اجتماع', efficiency: 85, impact: 90 },
        { type: 'بريد إلكتروني', efficiency: 45, impact: 50 },
        { type: 'ملاحظة', efficiency: 30, impact: 20 },
        { type: 'متابعة', efficiency: 70, impact: 75 }
      ]
    };
  } catch (error) {
    console.error("خطأ في جلب بيانات التقارير:", error);
    toast.error("فشل في جلب بيانات التقارير");
    
    // Return empty data structure
    return {
      salesData: [],
      leadSources: [],
      teamData: [],
      productsData: [],
      salesComparisonData: [],
      industrySalesData: [],
      conversionRateData: [],
      leadFunnelData: [],
      leadsGrowthData: [],
      teamTargetsData: [],
      teamEfficiencyData: [],
      productComparisonData: [],
      productDistributionData: [],
      activitiesData: [],
      activityTypesData: [],
      activityEfficiencyData: []
    };
  }
};
