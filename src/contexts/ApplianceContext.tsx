import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appliance } from '@/types/appliance';
import { mockAppliances } from '@/data/mockData';

interface ApplianceContextType {
  appliances: Appliance[];
  addAppliance: (appliance: Omit<Appliance, 'id'>) => void;
  updateAppliance: (id: string, appliance: Partial<Appliance>) => void;
  deleteAppliance: (id: string) => void;
  getAppliance: (id: string) => Appliance | undefined;
}

const ApplianceContext = createContext<ApplianceContextType | undefined>(undefined);

export function ApplianceProvider({ children }: { children: ReactNode }) {
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    const stored = localStorage.getItem('appliances');
    if (stored) {
      return JSON.parse(stored);
    }
    return mockAppliances;
  });

  useEffect(() => {
    localStorage.setItem('appliances', JSON.stringify(appliances));
  }, [appliances]);

  const addAppliance = (appliance: Omit<Appliance, 'id'>) => {
    const newAppliance: Appliance = {
      ...appliance,
      id: crypto.randomUUID(),
    };
    setAppliances(prev => [...prev, newAppliance]);
  };

  const updateAppliance = (id: string, updates: Partial<Appliance>) => {
    setAppliances(prev =>
      prev.map(app => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const deleteAppliance = (id: string) => {
    setAppliances(prev => prev.filter(app => app.id !== id));
  };

  const getAppliance = (id: string) => {
    return appliances.find(app => app.id === id);
  };

  return (
    <ApplianceContext.Provider
      value={{ appliances, addAppliance, updateAppliance, deleteAppliance, getAppliance }}
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
