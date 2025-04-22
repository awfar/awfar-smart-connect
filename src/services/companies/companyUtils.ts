
import { Company } from "./companyTypes";

export const transformCompanyData = (data: any): Company => ({
  id: data.id,
  name: data.name,
  industry: data.industry || "",
  type: data.type || "customer",
  country: data.country || "",
  phone: data.phone || "",
  website: data.website || "",
  address: data.address || "",
  status: data.status || "active",
  city: data.city || "",
  created_at: data.created_at,
  size: data.size || "",
  contacts: data.contacts || [],
  account_manager: data.account_manager ? {
    name: `${data.account_manager.first_name} ${data.account_manager.last_name}`,
    avatar: data.account_manager.avatar_url || "",
    initials: `${data.account_manager.first_name?.[0] || ""}${data.account_manager.last_name?.[0] || ""}`
  } : undefined
});
