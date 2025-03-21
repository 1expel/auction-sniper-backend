import { PrismaClient } from '@prisma/client';

// Create a more robust Prisma client with error logging
let prisma: PrismaClient;

try {
  console.log('Initializing Prisma client...');
  prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
  
  // Test the connection
  const testConnection = async () => {
    try {
      // Run a simple query to test the connection
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('Prisma connection test successful:', result);
    } catch (e) {
      console.error('Prisma connection test failed:', e);
    }
  };
  
  testConnection();
} catch (e) {
  console.error('Failed to initialize Prisma client:', e);
  // Create a mock client that logs errors but doesn't crash the app
  prisma = {
    profiles: {
      findUnique: async () => {
        console.error('Prisma client not properly initialized');
        return null;
      },
      create: async () => {
        console.error('Prisma client not properly initialized');
        return null;
      },
      update: async () => {
        console.error('Prisma client not properly initialized');
        return null;
      }
    },
    $queryRaw: async () => {
      console.error('Prisma client not properly initialized');
      return null;
    }
  } as unknown as PrismaClient;
}

export default prisma;
