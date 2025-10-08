import { Appliance } from '@/types/appliance';

export const mockAppliances: Appliance[] = [
  {
    id: '1',
    name: 'Samsung Smart Refrigerator',
    brand: 'Samsung',
    model: 'RF28R7351SR',
    category: 'Kitchen',
    purchaseDate: '2023-01-15',
    warrantyMonths: 24,
    serialNumber: 'RF28R7351SR123456',
    purchaseLocation: 'Best Buy',
    supportContact: {
      name: 'Samsung Support',
      phone: '1-800-SAMSUNG',
      email: 'support@samsung.com',
      website: 'https://www.samsung.com/support'
    },
    maintenanceTasks: [
      {
        id: 'm1',
        name: 'Clean condenser coils',
        date: '2024-12-01',
        frequency: 'quarterly',
        completed: false
      }
    ],
    notes: 'Family Hub model with touchscreen'
  },
  {
    id: '2',
    name: 'LG Washing Machine',
    brand: 'LG',
    model: 'WM9000HVA',
    category: 'Laundry',
    purchaseDate: '2024-03-20',
    warrantyMonths: 12,
    serialNumber: 'WM9000HVA789012',
    purchaseLocation: 'Home Depot',
    supportContact: {
      name: 'LG Customer Service',
      phone: '1-800-243-0000',
      email: 'support@lg.com'
    },
    maintenanceTasks: [],
    notes: 'TurboWash 360 technology'
  },
  {
    id: '3',
    name: 'Dyson Air Purifier',
    brand: 'Dyson',
    model: 'Pure Cool TP04',
    category: 'Air Quality',
    purchaseDate: '2022-06-10',
    warrantyMonths: 24,
    serialNumber: 'TP04345678',
    supportContact: {
      name: 'Dyson Support',
      phone: '1-866-693-9766',
      website: 'https://www.dyson.com/support'
    },
    maintenanceTasks: [
      {
        id: 'm2',
        name: 'Replace HEPA filter',
        date: '2024-11-15',
        frequency: 'yearly',
        completed: true
      }
    ]
  },
  {
    id: '4',
    name: 'Bosch Dishwasher',
    brand: 'Bosch',
    model: 'SHPM88Z75N',
    category: 'Kitchen',
    purchaseDate: '2024-09-05',
    warrantyMonths: 12,
    serialNumber: 'SHPM88Z75N456789',
    purchaseLocation: 'Lowe\'s',
    supportContact: {
      name: 'Bosch Home Appliances',
      phone: '1-800-944-2904',
      email: 'contact@bsh-group.com'
    },
    maintenanceTasks: [
      {
        id: 'm3',
        name: 'Clean spray arm',
        date: '2024-12-15',
        frequency: 'monthly',
        completed: false
      }
    ]
  }
];
