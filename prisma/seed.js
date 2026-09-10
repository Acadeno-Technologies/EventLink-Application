import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Purging all event and registration test data from Supabase...');

  // Delete all child relations and transactional data
  await prisma.notificationLog.deleteMany({});
  await prisma.registrationDocument.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.eventTheme.deleteMany({});
  await prisma.eventForm.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.event.deleteMany({});

  console.log('✅ Cleared all events, registrations, forms, themes, and logs.');

  // Upsert Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'acadeno' },
    update: {
      name: 'ACADENO Technologies Pvt. Ltd. – CSEZ Unit',
      plan: 'enterprise'
    },
    create: {
      name: 'ACADENO Technologies Pvt. Ltd. – CSEZ Unit',
      slug: 'acadeno',
      logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
      plan: 'enterprise'
    }
  });

  console.log(`🏢 Organization verified: ${org.name} (${org.id})`);

  // Upsert Staff / Users
  const staffMembers = [
    {
      name: 'Super Admin',
      email: 'admin@acadeno.in',
      role: 'super_admin',
      status: 'active'
    },
    {
      name: 'Arathy',
      email: 'arathy@acadeno.in',
      role: 'super_admin',
      status: 'active'
    },
    {
      name: 'Anu Varma',
      email: 'anu@acadeno.in',
      role: 'event_manager',
      status: 'active'
    },
    {
      name: 'Rahul K.',
      email: 'rahul@acadeno.in',
      role: 'staff',
      status: 'active'
    }
  ];

  for (const staff of staffMembers) {
    const user = await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        name: staff.name,
        role: staff.role,
        status: staff.status,
        org_id: org.id
      },
      create: {
        org_id: org.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        status: staff.status
      }
    });
    console.log(`👤 Staff configured: ${user.name} (${user.email}) - Role: ${user.role}`);
  }

  console.log('🎉 Database is now completely clean, containing only verified staff data!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
