
import React from 'react';
import { Button } from '@/components/ui/button';
import { PropertyType } from '@/services/propertiesService';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTypeLabel } from './PropertyList';

interface PropertyTypesSelectorProps {
  selectedType: PropertyType;
  onTypeChange: (type: PropertyType) => void;
}

const propertyTypes: PropertyType[] = [
  'lead',
  'company',
  'contact',
  'deal',
  'user',
  'product',
  'invoice'
];

const PropertyTypesSelector: React.FC<PropertyTypesSelectorProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  return (
    <div className="mb-6">
      <Tabs 
        defaultValue={selectedType} 
        onValueChange={(value) => onTypeChange(value as PropertyType)}
      >
        <TabsList className="overflow-auto flex w-full border-b pb-px">
          {propertyTypes.map((type) => (
            <TabsTrigger 
              key={type} 
              value={type} 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              {getTypeLabel(type)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default PropertyTypesSelector;
