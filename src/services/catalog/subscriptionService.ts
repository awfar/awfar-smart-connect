
import { supabase } from "@/integrations/supabase/client";
import { BillingCycle } from "./utils";

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: BillingCycle;
  features: string[];
  isActive: boolean;
}

export const getSubscriptions = async (): Promise<Subscription[]> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*');
  
  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    billingCycle: item.billing_cycle as BillingCycle,
    features: Array.isArray(item.features) ? item.features.map(f => String(f)) : [],
    isActive: item.is_active
  }));
};

export const getSubscriptionById = async (id: string): Promise<Subscription | null> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    billingCycle: data.billing_cycle as BillingCycle,
    features: Array.isArray(data.features) ? data.features.map(f => String(f)) : [],
    isActive: data.is_active
  };
};

export const createSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      billing_cycle: subscription.billingCycle,
      features: subscription.features,
      is_active: subscription.isActive
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    billingCycle: data.billing_cycle as BillingCycle,
    features: Array.isArray(data.features) ? data.features.map(f => String(f)) : [],
    isActive: data.is_active
  };
};

export const updateSubscription = async (id: string, subscription: Partial<Omit<Subscription, 'id'>>): Promise<Subscription> => {
  const updateData: any = {};
  
  if (subscription.name !== undefined) updateData.name = subscription.name;
  if (subscription.description !== undefined) updateData.description = subscription.description;
  if (subscription.price !== undefined) updateData.price = subscription.price;
  if (subscription.billingCycle !== undefined) updateData.billing_cycle = subscription.billingCycle;
  if (subscription.features !== undefined) updateData.features = subscription.features;
  if (subscription.isActive !== undefined) updateData.is_active = subscription.isActive;
  
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    billingCycle: data.billing_cycle as BillingCycle,
    features: Array.isArray(data.features) ? data.features.map(f => String(f)) : [],
    isActive: data.is_active
  };
};
