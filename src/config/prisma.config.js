import { PrismaClient } from '@prisma/client';
import Config from 'config';

const prisma = new PrismaClient({
  datasources: { db: { url: Config.dbConfig.databaseUrl } },
});

// eslint-disable-next-line no-console
console.log('Prisma connected to DB');

export default prisma;
