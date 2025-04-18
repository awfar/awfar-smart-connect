
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLeadStages, getLeadSources, getIndustries, getCountries, getSalesOwners } from "@/services/leads/utils";
import { Loader2 } from "lucide-react";

interface LeadFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    stage: 'all',
    source: 'all',
    country: 'all',
    industry: 'all',
    assigned_to: 'all'
  });
  
  const [options, setOptions] = useState({
    stages: [] as string[],
    sources: [] as string[],
    industries: [] as string[],
    countries: [] as string[],
    owners: [] as {id: string, name: string}[]
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch filter options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const [stages, sources, industries, countries, owners] = await Promise.all([
          getLeadStages(),
          getLeadSources(),
          getIndustries(),
          getCountries(),
          getSalesOwners()
        ]);
        
        setOptions({
          stages,
          sources,
          industries,
          countries,
          owners
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOptions();
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    // Only include non-'all' filters
    const activeFilters: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== 'all') {
        activeFilters[key] = value;
      }
    });
    
    onFilterChange(activeFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      stage: 'all',
      source: 'all',
      country: 'all',
      industry: 'all',
      assigned_to: 'all'
    };
    
    setFilters(resetFilters);
    onFilterChange({});
  };

  if (isLoading) {
    return (
      <Card className="mx-4 mb-4">
        <CardContent className="pt-4 flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-2">جاري تحميل خيارات التصفية...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mb-4">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">المرحلة</label>
            <Select 
              value={filters.stage} 
              onValueChange={(value) => handleFilterChange('stage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="جميع المراحل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المراحل</SelectItem>
                {options.stages.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">المصدر</label>
            <Select 
              value={filters.source} 
              onValueChange={(value) => handleFilterChange('source', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="جميع المصادر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المصادر</SelectItem>
                {options.sources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">الدولة</label>
            <Select 
              value={filters.country} 
              onValueChange={(value) => handleFilterChange('country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="جميع الدول" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الدول</SelectItem>
                {options.countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">القطاع</label>
            <Select 
              value={filters.industry} 
              onValueChange={(value) => handleFilterChange('industry', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="جميع القطاعات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع القطاعات</SelectItem>
                {options.industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">المسؤول</label>
            <Select 
              value={filters.assigned_to} 
              onValueChange={(value) => handleFilterChange('assigned_to', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="جميع المسؤولين" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المسؤولين</SelectItem>
                {options.owners.map(owner => (
                  <SelectItem key={owner.id} value={owner.id}>{owner.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={clearFilters}
          >
            إعادة تعيين
          </Button>
          <Button
            onClick={applyFilters}
          >
            تطبيق الفلاتر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadFilters;
