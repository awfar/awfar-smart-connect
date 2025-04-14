
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type BillingCycle = 'monthly' | 'quarterly' | 'annually';

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: BillingCycle;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Convert JSON features to string[]
    return data?.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      billingCycle: item.billing_cycle as BillingCycle,
      features: Array.isArray(item.features) ? item.features.map(f => String(f)) : [],
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) || [];
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    toast.error('فشل في جلب الاشتراكات');
    return [];
  }
};

export const fetchSubscriptionById = async (id: string): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      billingCycle: data.billing_cycle as BillingCycle,
      features: Array.isArray(data.features) ? data.features.map(f => String(f)) : [],
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    toast.error('فشل في جلب الاشتراك');
    return null;
  }
};

export const createSubscription = async (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        name: subscription.name,
        description: subscription.description,
        price: subscription.price,
        billing_cycle: subscription.billingCycle,
        features: subscription.features.map(f => String(f)),
        is_active: subscription.isActive
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('تم إضافة الاشتراك بنجاح');
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      billingCycle: data.billing_cycle as BillingCycle,
      features: Array.isArray(data.features) ? data.features.map(f => String(f)) : [],
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    toast.error('فشل في إضافة الاشتراك');
    return null;
  }
};

export const updateSubscription = async (id: string, subscription: Partial<Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Subscription | null> => {
  try {
    const updates: any = {};
    
    if (subscription.name !== undefined) updates.name = subscription.name;
    if (subscription.description !== undefined) updates.description = subscription.description;
    if (subscription.price !== undefined) updates.price = subscription.price;
    if (subscription.billingCycle !== undefined) updates.billing_cycle = subscription.billingCycle;
    if (subscription.features !== undefined) updates.features = subscription.features.map(f => String(f));
    if (subscription.isActive !== undefined) updates.is_active = subscription.isActive;
    
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('تم تحديث الاشتراك بنجاح');
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      billingCycle: data.billing_cycle as BillingCycle,
      features: Array.isArray(data.features) ? data.features.map(f => String(f)) : [],
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error updating subscription:", error);
    toast.error('فشل في تحديث الاشتراك');
    return null;
  }
};

export const deleteSubscription = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('تم حذف الاشتراك بنجاح');
    return true;
  } catch (error) {
    console.error("Error deleting subscription:", error);
    toast.error('فشل في حذف الاشتراك');
    return false;
  }
};
