
export interface Contact {
  name: string;
  position: string;
  email: string;
  phone?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  type: string;
  country: string;
  phone: string;
  website: string;
  address: string;
  contacts: Contact[];
  createdAt?: string;
  status: string;
}
