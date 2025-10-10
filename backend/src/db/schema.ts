import { pgTable, serial, uuid, varchar, integer, date, text, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const appliances = pgTable('appliances', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 255 }).notNull(),
  model: varchar('model', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  purchaseDate: date('purchase_date').notNull(),
  warrantyMonths: integer('warranty_months').notNull(),
  serialNumber: varchar('serial_number', { length: 255 }),
  purchaseLocation: varchar('purchase_location', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const supportContacts = pgTable('support_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  applianceId: uuid('appliance_id').notNull().references(() => appliances.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
});

export const maintenanceTasks = pgTable('maintenance_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  applianceId: uuid('appliance_id').notNull().references(() => appliances.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  date: date('date').notNull(),
  frequency: varchar('frequency', { length: 20, enum: ['once', 'monthly', 'quarterly', 'yearly'] }),
  completed: boolean('completed').default(false).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const serviceProviders = pgTable('service_providers', {
  id: uuid('id').primaryKey().defaultRandom(),
  maintenanceTaskId: uuid('maintenance_task_id').notNull().references(() => maintenanceTasks.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
});