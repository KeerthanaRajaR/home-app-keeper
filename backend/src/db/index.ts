import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

console.log('Database connection string loaded:', connectionString ? 'Yes' : 'No');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All env vars:', {
  DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
  PORT: process.env.PORT
});

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
console.log('Database connection established');