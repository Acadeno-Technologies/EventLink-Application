import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  console.log('--- NEON DATABASE STATUS REPORT ---');
  const orgs = await prisma.organization.findMany();
  console.log('Organizations in Neon:', orgs);
  const users = await prisma.user.findMany();
  console.log('Users in Neon:', users);
  const events = await prisma.event.findMany();
  console.log('Events in Neon:', events.length);
  const registrations = await prisma.registration.findMany();
  console.log('Registrations in Neon:', registrations.length);
  await prisma.$disconnect();
}

check();
