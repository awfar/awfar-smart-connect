
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Building, Briefcase, FileText, MessageSquare, Calendar, Clock, 
  DollarSign, Plus, ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export type RelatedEntityType = 'company' | 'deal' | 'invoice' | 'subscription' | 'ticket' | 'task' | 'appointment';

export interface RelatedEntity {
  id: string;
  name: string;
  type: RelatedEntityType;
  status?: string;
  createdAt?: string;
  value?: string | number;
  badge?: string;
  owner?: {
    id?: string;
    name?: string;
    initials?: string;
  };
}

interface RelatedEntitiesCardProps {
  type: RelatedEntityType;
  title: string;
  entities: RelatedEntity[];
  isLoading?: boolean;
  onAdd?: () => void;
  onView?: (entityId: string) => void;
}

const getStatusColor = (status?: string): string => {
  if (!status) return '';
  
  if (status.includes('جديد') || status.includes('مفتوح')) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  } else if (status.includes('مكتمل') || status.includes('مغلق') || status.includes('مدفوع')) {
    return 'bg-green-100 text-green-800 border-green-200';
  } else if (status.includes('قيد') || status.includes('جار')) {
    return 'bg-amber-100 text-amber-800 border-amber-200';
  } else if (status.includes('ملغي')) {
    return 'bg-red-100 text-red-800 border-red-200';
  }
  
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

const getEntityIcon = (type: RelatedEntityType) => {
  switch (type) {
    case 'company': return <Building className="h-4 w-4" />;
    case 'deal': return <Briefcase className="h-4 w-4" />;
    case 'invoice': return <FileText className="h-4 w-4" />;
    case 'ticket': return <MessageSquare className="h-4 w-4" />;
    case 'appointment': return <Calendar className="h-4 w-4" />;
    case 'task': return <Clock className="h-4 w-4" />;
    case 'subscription': return <DollarSign className="h-4 w-4" />;
    default: return <Building className="h-4 w-4" />;
  }
};

const getEntityPath = (type: RelatedEntityType, id: string): string => {
  switch (type) {
    case 'company': return `/dashboard/companies/${id}`;
    case 'deal': return `/dashboard/deals/${id}`;
    case 'invoice': return `/dashboard/invoices/${id}`;
    case 'ticket': return `/dashboard/tickets/${id}`;
    case 'appointment': return `/dashboard/calendar?appointment=${id}`;
    case 'task': return `/dashboard/tasks?task=${id}`;
    case 'subscription': return `/dashboard/subscriptions/${id}`;
    default: return '#';
  }
};

const RelatedEntityCard: React.FC<RelatedEntitiesCardProps> = ({
  type,
  title,
  entities,
  isLoading = false,
  onAdd,
  onView
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {getEntityIcon(type)}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <div className="h-16 flex items-center justify-center">
            <div className="animate-pulse w-full">
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1">
            {getEntityIcon(type)}
            {title}
          </span>
          
          {onAdd && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={onAdd}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0">
        {entities.length > 0 ? (
          <div className="space-y-2">
            {entities.map(entity => (
              <div 
                key={entity.id} 
                className="border rounded-md p-2 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entity.name}</p>
                  </div>
                  <Link to={getEntityPath(entity.type, entity.id)}>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  {entity.status && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-1.5 py-0 ${getStatusColor(entity.status)}`}
                    >
                      {entity.status}
                    </Badge>
                  )}
                  
                  {entity.value && (
                    <span className="text-muted-foreground">
                      {typeof entity.value === 'number' 
                        ? entity.value.toLocaleString('ar-SA')
                        : entity.value}
                    </span>
                  )}
                </div>
                
                {entity.owner && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-[10px]">
                        {entity.owner.initials || '؟'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{entity.owner.name || 'غير معين'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-3 text-center text-sm text-muted-foreground">
            لا يوجد {title}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedEntityCard;
