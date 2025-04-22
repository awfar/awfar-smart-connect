
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
  contacts: [], // We'll handle contacts separately if needed
  status: data.status || "active",
  createdAt: data.created_at
});
