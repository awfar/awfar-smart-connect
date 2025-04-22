
export interface Contact {
  name: string;
  position: string;
  email: string;
  phone?: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  type: string;
  country?: string;
  phone?: string;
  website?: string;
  address?: string;
  contacts?: Contact[];
  status?: string;
  city?: string;
  created_at?: string;
  size?: string;
  account_manager?: {
    name: string;
    avatar: string;
    initials: string;
  };
}
