const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'basheerm2006@gmail.com' },
    include: {
      student: true,
      admin: true,
      institution_institution_userIdTouser: true,
    }
  });
  console.log(JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}

checkUser().catch(err => {
  console.error(err);
  process.exit(1);
});
