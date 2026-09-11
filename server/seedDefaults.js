export const DEFAULT_ORG_ID = 'f56b03a9-9097-4638-8c4a-6f68227b2789';
export const DEFAULT_USER_ID = 'd79ebd86-73b7-4f55-9108-cdda19919cf0';

export async function ensureNeonSeed(prisma) {
  const existingExpectedOrg = await prisma.organization.findUnique({
    where: { id: DEFAULT_ORG_ID },
  });

  if (!existingExpectedOrg) {
    const slugOwner = await prisma.organization.findUnique({
      where: { slug: 'acadeno' },
    });

    if (slugOwner) {
      await prisma.event.deleteMany({ where: { org_id: slugOwner.id } });
      await prisma.auditLog.deleteMany({ where: { org_id: slugOwner.id } });
      await prisma.user.deleteMany({ where: { org_id: slugOwner.id } });
      await prisma.organization.delete({ where: { id: slugOwner.id } });
    }

    await prisma.organization.create({
      data: {
        id: DEFAULT_ORG_ID,
        name: 'ACADENO Technologies Pvt. Ltd. – CSEZ Unit',
        slug: 'acadeno',
        logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
        plan: 'enterprise',
      },
    });
  }

  const existingExpectedUser = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
  });

  if (!existingExpectedUser) {
    const emailOwner = await prisma.user.findUnique({
      where: { email: 'admin@acadeno.in' },
    });

    if (emailOwner) {
      await prisma.auditLog.deleteMany({ where: { user_id: emailOwner.id } });
      await prisma.event.deleteMany({ where: { created_by: emailOwner.id } });
      await prisma.user.delete({ where: { id: emailOwner.id } });
    }

    await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        org_id: DEFAULT_ORG_ID,
        name: 'Super Admin',
        email: 'admin@acadeno.in',
        role: 'super_admin',
        status: 'active',
      },
    });
  }
}
