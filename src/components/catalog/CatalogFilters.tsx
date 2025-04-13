
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search,
  Filter,
  Tag,
  CircleSlash,
  ArrowUpDown,
} from 'lucide-react';
import { ProductType, productTypeIconMap, productTypeLabels } from '@/services/catalogService';

interface CatalogFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: ProductType | 'all';
  setFilterType: (type: ProductType | 'all') => void;
  resetFilters: () => void;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  resetFilters
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="البحث عن منتج..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-3"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            فلترة
            {filterType !== 'all' && <Badge variant="secondary" className="mr-2">{productTypeLabels[filterType as ProductType]}</Badge>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setFilterType('all')}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <span>جميع المنتجات</span>
          </DropdownMenuItem>
          {(Object.keys(productTypeIconMap) as ProductType[]).map(type => {
            const IconComponent = productTypeIconMap[type];
            return (
              <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                <IconComponent className="mr-2 h-4 w-4" />
                <span>{productTypeLabels[type]}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" className="gap-2">
        <Tag size={16} />
        تصنيف
      </Button>
      <Button variant="outline" className="gap-2" onClick={resetFilters}>
        <CircleSlash size={16} />
        مسح الفلاتر
      </Button>
    </div>
  );
};

export default CatalogFilters;
