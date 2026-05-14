const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAdmins() {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    include: { admin: true }
  });
  console.log(JSON.stringify(admins, null, 2));
  await prisma.$disconnect();
}

listAdmins().catch(err => {
  console.error(err);
  process.exit(1);
});
