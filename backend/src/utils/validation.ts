import { z } from 'zod';

export const maintenanceTaskSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  frequency: z.enum(['once', 'monthly', 'quarterly', 'yearly']).optional(),
  serviceProvider: z.object({
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }).optional(),
  completed: z.boolean().default(false),
  notes: z.string().optional(),
});

export const supportContactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
});

export const applianceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  category: z.string().min(1),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  warrantyMonths: z.number().int().min(0),
  serialNumber: z.string().optional(),
  purchaseLocation: z.string().optional(),
  supportContact: supportContactSchema.optional(),
  maintenanceTasks: z.array(maintenanceTaskSchema).optional(),
  notes: z.string().optional(),
});