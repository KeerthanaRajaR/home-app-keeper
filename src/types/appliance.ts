export interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  purchaseDate: string;
  warrantyMonths: number;
  serialNumber?: string;
  purchaseLocation?: string;
  supportContact?: {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  maintenanceTasks?: MaintenanceTask[];
  notes?: string;
}

export interface MaintenanceTask {
  id: string;
  name: string;
  date: string;
  frequency?: 'once' | 'monthly' | 'quarterly' | 'yearly';
  serviceProvider?: {
    name: string;
    phone?: string;
    email?: string;
  };
  completed: boolean;
  notes?: string;
}

export type WarrantyStatus = 'active' | 'expiring' | 'expired';
