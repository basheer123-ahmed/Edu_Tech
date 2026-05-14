const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.update({
    where: { email: 'varsha@gmail.com' },
    data: { password: hashedPassword }
  });
  console.log('--- PASSWORD RESET ---');
  console.log(`User: ${user.email}`);
  console.log(`New Password: admin123`);
  await prisma.$disconnect();
}

resetPassword();
