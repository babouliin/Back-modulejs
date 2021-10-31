import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line no-console
console.log('Prisma connected to DB');

export default prisma;
