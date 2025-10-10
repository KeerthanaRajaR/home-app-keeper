import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appliance } from '@/types/appliance';
import { mockAppliances } from '@/data/mockData';

// Define the API service
const API_BASE_URL = 'http://localhost:3000/api';

export const applianceService = {
  getAllAppliances: async () => {
    const response = await fetch(`${API_BASE_URL}/appliances`);
    if (!response.ok) {
      throw new Error('Failed to fetch appliances');
    }
    return response.json();
  },
  
  getApplianceById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/appliances/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch appliance');
    }
    return response.json();
  },
  
  createAppliance: async (appliance: Omit<Appliance, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/appliances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appliance),
    });
    if (!response.ok) {
      throw new Error('Failed to create appliance');
    }
    return response.json();
  },
  
  updateAppliance: async (id: string, appliance: Partial<Appliance>) => {
    const response = await fetch(`${API_BASE_URL}/appliances/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appliance),
    });
    if (!response.ok) {
      throw new Error('Failed to update appliance');
    }
    return response.json();
  },
  
  deleteAppliance: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/appliances/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete appliance');
    }
    return response.status === 204 ? null : response.json();
  }
};

interface ApplianceContextType {
  appliances: Appliance[];
  loading: boolean;
  error: string | null;
  addAppliance: (appliance: Omit<Appliance, 'id'>) => Promise<void>;
  updateAppliance: (id: string, appliance: Partial<Appliance>) => Promise<void>;
  deleteAppliance: (id: string) => Promise<void>;
  getAppliance: (id: string) => Appliance | undefined;
  refreshAppliances: () => Promise<void>;
}

const ApplianceContext = createContext<ApplianceContextType | undefined>(undefined);

export function ApplianceProvider({ children }: { children: ReactNode }) {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appliances from API
  const fetchAppliances = async () => {
    try {
      setLoading(true);
      const data = await applianceService.getAllAppliances();
      setAppliances(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Fallback to mock data if API fails
      setAppliances(mockAppliances);
    } finally {
      setLoading(false);
    }
  };

  // Initialize appliances on component mount
  useEffect(() => {
    fetchAppliances();
  }, []);

  const addAppliance = async (appliance: Omit<Appliance, 'id'>) => {
    try {
      const newAppliance = await applianceService.createAppliance(appliance);
      setAppliances(prev => [...prev, newAppliance]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add appliance');
      throw err;
    }
  };

  const updateAppliance = async (id: string, updates: Partial<Appliance>) => {
    try {
      const updatedAppliance = await applianceService.updateAppliance(id, updates);
      setAppliances(prev =>
        prev.map(app => (app.id === id ? { ...app, ...updatedAppliance } : app))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appliance');
      throw err;
    }
  };

  const deleteAppliance = async (id: string) => {
    try {
      await applianceService.deleteAppliance(id);
      setAppliances(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete appliance');
      throw err;
    }
  };

  const getAppliance = (id: string) => {
    return appliances.find(app => app.id === id);
  };

  const refreshAppliances = async () => {
    await fetchAppliances();
  };

  return (
    <ApplianceContext.Provider
      value={{ 
        appliances, 
        loading, 
        error, 
        addAppliance, 
        updateAppliance, 
        deleteAppliance, 
        getAppliance, 
        refreshAppliances 
      }}
    >
      {children}
    </ApplianceContext.Provider>
  );
}

export function useAppliances() {
  const context = useContext(ApplianceContext);
  if (!context) {
    throw new Error('useAppliances must be used within ApplianceProvider');
  }
  return context;
}