import { Appliance, WarrantyStatus } from '@/types/appliance';

export function calculateWarrantyEndDate(purchaseDate: string, warrantyMonths: number): Date {
  const date = new Date(purchaseDate);
  date.setMonth(date.getMonth() + warrantyMonths);
  return date;
}

export function getWarrantyStatus(appliance: Appliance): WarrantyStatus {
  const endDate = calculateWarrantyEndDate(appliance.purchaseDate, appliance.warrantyMonths);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring';
  return 'active';
}

export function getDaysUntilExpiry(appliance: Appliance): number {
  const endDate = calculateWarrantyEndDate(appliance.purchaseDate, appliance.warrantyMonths);
  const today = new Date();
  return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatWarrantyDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
