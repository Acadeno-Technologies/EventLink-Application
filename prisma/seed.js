import { PrismaClient } from '@prisma/client';
import { ensureNeonSeed } from '../server/seedDefaults.js';

const prisma = new PrismaClient();

async function main() {
  await ensureNeonSeed(prisma);
  const org = await prisma.organization.findUnique({ where: { slug: 'acadeno' } });
  const user = await prisma.user.findUnique({ where: { email: 'admin@acadeno.in' } });
  console.log(`Organization ready: ${org?.name} (${org?.id})`);
  console.log(`User ready: ${user?.name} (${user?.id})`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
