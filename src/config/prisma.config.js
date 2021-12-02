import { PrismaClient } from '@prisma/client';
import Config from 'config';

const prisma = new PrismaClient({
  datasources: { db: { url: Config.dbConfig.databaseUrl } },
});

export default prisma;
