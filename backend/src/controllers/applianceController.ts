import { Request, Response } from 'express';
import { db } from '../db';
import { appliances, supportContacts, maintenanceTasks, serviceProviders } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from "zod";
import { applianceSchema } from '../utils/validation';
import { PgTransaction } from 'drizzle-orm/pg-core';

// ... existing imports ...

// Get all appliances
export const getAllAppliances = async (req: Request, res: Response) => {
  try {
    console.log('Attempting to fetch appliances from database...');
    
    // Simple test query first
    try {
      await db.execute('SELECT 1');
      console.log('Database connection test successful');
    } catch (connectionError: any) {
      console.error('Database connection test failed:', connectionError);
      return res.status(500).json({ 
        error: 'Database connection failed', 
        details: connectionError.message 
      });
    }
    
    // Simplified query without complex relationships
    const allAppliances = await db.select().from(appliances);
    
    // If we need the related data, we'll fetch it separately
    const appliancesWithRelations = await Promise.all(allAppliances.map(async (appliance) => {
      // Fetch support contact
      const supportContact = await db.select().from(supportContacts).where(eq(supportContacts.applianceId, appliance.id)).limit(1);
      
      // Fetch maintenance tasks
      const maintenanceTasksList = await db.select().from(maintenanceTasks).where(eq(maintenanceTasks.applianceId, appliance.id));
      
      // Fetch service providers for each maintenance task
      const maintenanceTasksWithProviders = await Promise.all(maintenanceTasksList.map(async (task) => {
        const serviceProvider = await db.select().from(serviceProviders).where(eq(serviceProviders.maintenanceTaskId, task.id)).limit(1);
        return {
          ...task,
          serviceProvider: serviceProvider[0] || null
        };
      }));
      
      return {
        ...appliance,
        supportContact: supportContact[0] || null,
        maintenanceTasks: maintenanceTasksWithProviders
      };
    }));
    
    console.log('Successfully fetched appliances:', appliancesWithRelations.length);
    res.json(appliancesWithRelations);
  } catch (error: any) {
    console.error('Error fetching appliances:', error);
    
    // If it's a relation error, it might mean the tables don't exist
    if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
      return res.status(500).json({ 
        error: 'Database tables not found', 
        details: 'Please run migrations to create tables',
        suggestion: 'Run "npm run migrate" in the backend directory'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch appliances', 
      details: error.message,
      suggestion: 'Check database connection and table existence'
    });
  }
};

// ... rest of the existing code ...

// Get appliance by ID
// Get appliance by ID
export const getApplianceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Fetch appliance
    const applianceResult = await db.select().from(appliances).where(eq(appliances.id, id)).limit(1);
    
    if (!applianceResult || applianceResult.length === 0) {
      return res.status(404).json({ error: 'Appliance not found' });
    }
    
    const appliance = applianceResult[0];
    
    // Fetch support contact
    const supportContact = await db.select().from(supportContacts).where(eq(supportContacts.applianceId, appliance.id)).limit(1);
    
    // Fetch maintenance tasks
    const maintenanceTasksList = await db.select().from(maintenanceTasks).where(eq(maintenanceTasks.applianceId, appliance.id));
    
    // Fetch service providers for each maintenance task
    const maintenanceTasksWithProviders = await Promise.all(maintenanceTasksList.map(async (task) => {
      const serviceProvider = await db.select().from(serviceProviders).where(eq(serviceProviders.maintenanceTaskId, task.id)).limit(1);
      return {
        ...task,
        serviceProvider: serviceProvider[0] || null
      };
    }));
    
    const applianceWithRelations = {
      ...appliance,
      supportContact: supportContact[0] || null,
      maintenanceTasks: maintenanceTasksWithProviders
    };
    
    res.json(applianceWithRelations);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch appliance', details: error.message });
  }
};

// ... rest of the existing code ...

// Create new appliance
export const createAppliance = async (req: Request, res: Response) => {
  try {
    const validatedData = applianceSchema.parse(req.body);
    
    // Start transaction
    const result = await db.transaction(async (tx: PgTransaction<any, any, any>) => {
      // Insert appliance
      const [newAppliance] = await tx.insert(appliances).values({
        name: validatedData.name,
        brand: validatedData.brand,
        model: validatedData.model,
        category: validatedData.category,
        purchaseDate: validatedData.purchaseDate,
        warrantyMonths: validatedData.warrantyMonths,
        serialNumber: validatedData.serialNumber,
        purchaseLocation: validatedData.purchaseLocation,
        notes: validatedData.notes,
      }).returning();
      
      // Insert support contact if provided
      if (validatedData.supportContact) {
        await tx.insert(supportContacts).values({
          applianceId: newAppliance.id,
          name: validatedData.supportContact.name,
          phone: validatedData.supportContact.phone,
          email: validatedData.supportContact.email,
          website: validatedData.supportContact.website,
        });
      }
      
      // Insert maintenance tasks if provided
      if (validatedData.maintenanceTasks && validatedData.maintenanceTasks.length > 0) {
        for (const task of validatedData.maintenanceTasks) {
          const [newTask] = await tx.insert(maintenanceTasks).values({
            applianceId: newAppliance.id,
            name: task.name,
            date: task.date,
            frequency: task.frequency,
            completed: task.completed,
            notes: task.notes,
          }).returning();
          
          // Insert service provider if provided
          if (task.serviceProvider) {
            await tx.insert(serviceProviders).values({
              maintenanceTaskId: newTask.id,
              name: task.serviceProvider.name,
              phone: task.serviceProvider.phone,
              email: task.serviceProvider.email,
            });
          }
        }
      }
      
      return newAppliance;
    });
    
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to create appliance', details: error.message });
  }
};

// Update appliance
export const updateAppliance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = applianceSchema.partial().parse(req.body);
    
    // Check if appliance exists
    const existingAppliance = await db.query.appliances.findFirst({
      where: eq(appliances.id, id)
    });
    
    if (!existingAppliance) {
      return res.status(404).json({ error: 'Appliance not found' });
    }
    
    // Update appliance
    const [updatedAppliance] = await db.update(appliances)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(appliances.id, id))
      .returning();
    
    res.json(updatedAppliance);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to update appliance', details: error.message });
  }
};

// Delete appliance
export const deleteAppliance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if appliance exists
    const existingAppliance = await db.query.appliances.findFirst({
      where: eq(appliances.id, id)
    });
    
    if (!existingAppliance) {
      return res.status(404).json({ error: 'Appliance not found' });
    }
    
    // Delete appliance (cascading will handle related records)
    await db.delete(appliances).where(eq(appliances.id, id));
    
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete appliance', details: error.message });
  }
};