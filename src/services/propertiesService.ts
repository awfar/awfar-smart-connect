
import { toast } from "sonner";

export type PropertyType = 'lead' | 'company' | 'contact' | 'deal' | 'user' | 'product' | 'invoice';

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'date' 
  | 'datetime' 
  | 'select' 
  | 'multiselect' 
  | 'checkbox' 
  | 'radio' 
  | 'url';

export interface FieldOption {
  label: string;
  value: string;
}

export interface Property {
  id: string;
  name: string;
  label: string;
  type: PropertyType;
  fieldType: FieldType;
  description?: string;
  isRequired: boolean;
  isDefault: boolean;
  isSystem: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: FieldOption[];
  group?: string;
  created_at?: string;
  updated_at?: string;
}

// Default company properties
const defaultCompanyProperties: Property[] = [
  {
    id: "comp-name",
    name: "name",
    label: "اسم الشركة",
    type: "company",
    fieldType: "text",
    description: "الاسم الرسمي للشركة",
    isRequired: true,
    isDefault: true,
    isSystem: true
  },
  {
    id: "comp-industry",
    name: "industry",
    label: "القطاع",
    type: "company",
    fieldType: "select",
    isRequired: true,
    isDefault: true,
    isSystem: true,
    options: [
      { label: "تقنية المعلومات", value: "tech" },
      { label: "الرعاية الصحية", value: "healthcare" },
      { label: "التجزئة", value: "retail" },
      { label: "التعليم", value: "education" },
      { label: "التمويل", value: "finance" },
      { label: "السياحة", value: "tourism" },
      { label: "العقارات", value: "real_estate" },
      { label: "الصناعة", value: "manufacturing" },
      { label: "أخرى", value: "other" }
    ]
  },
  {
    id: "comp-type",
    name: "type",
    label: "نوع الشركة",
    type: "company",
    fieldType: "select",
    isRequired: true,
    isDefault: true,
    isSystem: true,
    options: [
      { label: "عميل", value: "customer" },
      { label: "مورد", value: "vendor" },
      { label: "شريك", value: "partner" },
      { label: "منافس", value: "competitor" }
    ]
  },
  {
    id: "comp-country",
    name: "country",
    label: "الدولة",
    type: "company",
    fieldType: "select",
    isRequired: true,
    isDefault: true,
    isSystem: true,
    options: [
      { label: "السعودية", value: "sa" },
      { label: "الإمارات", value: "ae" },
      { label: "قطر", value: "qa" },
      { label: "البحرين", value: "bh" },
      { label: "الكويت", value: "kw" },
      { label: "عمان", value: "om" },
      { label: "مصر", value: "eg" },
      { label: "الأردن", value: "jo" }
    ]
  },
  {
    id: "comp-city",
    name: "city",
    label: "المدينة",
    type: "company",
    fieldType: "text",
    isRequired: false,
    isDefault: true,
    isSystem: false
  },
  {
    id: "comp-address",
    name: "address",
    label: "العنوان",
    type: "company",
    fieldType: "textarea",
    isRequired: false,
    isDefault: true,
    isSystem: false
  },
  {
    id: "comp-phone",
    name: "phone",
    label: "رقم الهاتف",
    type: "company",
    fieldType: "phone",
    isRequired: false,
    isDefault: true,
    isSystem: false
  },
  {
    id: "comp-email",
    name: "email",
    label: "البريد الإلكتروني",
    type: "company",
    fieldType: "email",
    isRequired: false,
    isDefault: true,
    isSystem: false
  },
  {
    id: "comp-website",
    name: "website",
    label: "الموقع الإلكتروني",
    type: "company",
    fieldType: "url",
    isRequired: false,
    isDefault: true,
    isSystem: false
  },
  {
    id: "comp-size",
    name: "size",
    label: "حجم الشركة",
    type: "company",
    fieldType: "select",
    isRequired: false,
    isDefault: false,
    isSystem: false,
    options: [
      { label: "1-10 موظفين", value: "1-10" },
      { label: "11-50 موظف", value: "11-50" },
      { label: "51-200 موظف", value: "51-200" },
      { label: "201-500 موظف", value: "201-500" },
      { label: "501-1000 موظف", value: "501-1000" },
      { label: "1001+ موظف", value: "1001+" }
    ]
  }
];

// Default lead properties
const defaultLeadProperties: Property[] = [
  {
    id: "lead-name",
    name: "name",
    label: "الاسم",
    type: "lead",
    fieldType: "text",
    isRequired: true,
    isDefault: true,
    isSystem: true
  },
  {
    id: "lead-email",
    name: "email",
    label: "البريد الإلكتروني",
    type: "lead",
    fieldType: "email",
    isRequired: true,
    isDefault: true,
    isSystem: true
  },
  {
    id: "lead-phone",
    name: "phone",
    label: "رقم الهاتف",
    type: "lead",
    fieldType: "phone",
    isRequired: false,
    isDefault: true,
    isSystem: true
  }
];

// Default contact properties
const defaultContactProperties: Property[] = [
  {
    id: "contact-name",
    name: "name",
    label: "الاسم",
    type: "contact",
    fieldType: "text",
    isRequired: true,
    isDefault: true,
    isSystem: true
  },
  {
    id: "contact-position",
    name: "position",
    label: "المسمى الوظيفي",
    type: "contact",
    fieldType: "text",
    isRequired: false,
    isDefault: true,
    isSystem: true
  },
  {
    id: "contact-email",
    name: "email",
    label: "البريد الإلكتروني",
    type: "contact",
    fieldType: "email",
    isRequired: true,
    isDefault: true,
    isSystem: true
  },
  {
    id: "contact-phone",
    name: "phone",
    label: "رقم الهاتف",
    type: "contact",
    fieldType: "phone",
    isRequired: false,
    isDefault: true,
    isSystem: true
  }
];

// Mock data for all properties by type
const mockProperties: Record<PropertyType, Property[]> = {
  company: defaultCompanyProperties,
  lead: defaultLeadProperties,
  contact: defaultContactProperties,
  deal: [],
  user: [],
  product: [],
  invoice: []
};

// Custom properties storage
const customProperties: Property[] = [];

// Get all properties by type
export const getPropertiesByType = async (type: PropertyType): Promise<Property[]> => {
  return [...mockProperties[type], ...customProperties.filter(prop => prop.type === type)];
};

// Create a new property
export const createProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> => {
  const now = new Date().toISOString();
  const newProperty: Property = {
    id: `${property.type}-${property.name}-${Date.now()}`,
    ...property,
    created_at: now,
    updated_at: now
  };

  customProperties.push(newProperty);
  return newProperty;
};

// Update a property
export const updateProperty = async (id: string, updates: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>): Promise<Property> => {
  const index = customProperties.findIndex(prop => prop.id === id);
  
  if (index === -1) {
    const defaultIndex = Object.values(mockProperties).flat().findIndex(prop => prop.id === id);
    if (defaultIndex === -1) {
      throw new Error('الخاصية غير موجودة');
    }
    // Cannot update system properties
    throw new Error('لا يمكن تعديل الخصائص النظامية');
  }
  
  customProperties[index] = {
    ...customProperties[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return customProperties[index];
};

// Delete a property
export const deleteProperty = async (id: string): Promise<boolean> => {
  const index = customProperties.findIndex(prop => prop.id === id);
  
  if (index === -1) {
    // Check if trying to delete a system property
    const systemProperty = Object.values(mockProperties).flat().find(prop => prop.id === id);
    if (systemProperty?.isSystem) {
      throw new Error('لا يمكن حذف الخصائص النظامية');
    }
    throw new Error('الخاصية غير موجودة');
  }
  
  customProperties.splice(index, 1);
  return true;
};

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  // Check custom properties first
  const customProperty = customProperties.find(prop => prop.id === id);
  if (customProperty) {
    return customProperty;
  }
  
  // Check system properties
  const systemProperty = Object.values(mockProperties).flat().find(prop => prop.id === id);
  return systemProperty || null;
};

// Add a field option to a property
export const addFieldOption = async (propertyId: string, option: FieldOption): Promise<Property> => {
  const property = await getPropertyById(propertyId);
  
  if (!property) {
    throw new Error('الخاصية غير موجودة');
  }
  
  if (!property.options) {
    property.options = [];
  }
  
  property.options.push(option);
  
  if (customProperties.some(prop => prop.id === propertyId)) {
    return await updateProperty(propertyId, { options: property.options });
  } else {
    throw new Error('لا يمكن تعديل الخصائص النظامية');
  }
};
