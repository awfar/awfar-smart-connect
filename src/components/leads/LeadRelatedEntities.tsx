
import React from 'react';
import RelatedEntityCard, { RelatedEntity } from './RelatedEntityCard';

interface LeadRelatedEntitiesProps {
  companies: RelatedEntity[];
  deals: RelatedEntity[];
  invoices: RelatedEntity[];
  tickets: RelatedEntity[];
  subscriptions: RelatedEntity[];
  isLoading: boolean;
  onAddCompany?: () => void;
  onAddDeal?: () => void;
  onAddInvoice?: () => void;
  onAddTicket?: () => void;
  onAddSubscription?: () => void;
}

const LeadRelatedEntities: React.FC<LeadRelatedEntitiesProps> = ({
  companies,
  deals,
  invoices,
  tickets,
  subscriptions,
  isLoading,
  onAddCompany,
  onAddDeal,
  onAddInvoice,
  onAddTicket,
  onAddSubscription
}) => {
  return (
    <div className="space-y-4">
      <RelatedEntityCard
        type="company"
        title="الشركات"
        entities={companies}
        isLoading={isLoading}
        onAdd={onAddCompany}
      />
      
      <RelatedEntityCard
        type="deal"
        title="الصفقات"
        entities={deals}
        isLoading={isLoading}
        onAdd={onAddDeal}
      />
      
      <RelatedEntityCard
        type="invoice"
        title="الفواتير"
        entities={invoices}
        isLoading={isLoading}
        onAdd={onAddInvoice}
      />
      
      <RelatedEntityCard
        type="ticket"
        title="التذاكر"
        entities={tickets}
        isLoading={isLoading}
        onAdd={onAddTicket}
      />
      
      <RelatedEntityCard
        type="subscription"
        title="الاشتراكات"
        entities={subscriptions}
        isLoading={isLoading}
        onAdd={onAddSubscription}
      />
    </div>
  );
};

export default LeadRelatedEntities;
