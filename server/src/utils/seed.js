const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users & Roles
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'STUDENT',
      student: { create: { bio: 'Aspiring Full Stack Developer', skillScore: 85 } }
    },
  });

  const institutionUser = await prisma.user.upsert({
    where: { email: 'admin@edu.com' },
    update: {},
    create: {
      email: 'admin@edu.com',
      password: hashedPassword,
      name: 'Tech University',
      role: 'INSTITUTION',
      institution: { create: { description: 'Leading tech institute', location: 'Boston, MA' } }
    },
  });

  const companyUser = await prisma.user.upsert({
    where: { email: 'hr@google.com' },
    update: {},
    create: {
      email: 'hr@google.com',
      password: hashedPassword,
      name: 'Google Inc.',
      role: 'COMPANY',
      company: { create: { industry: 'Technology', location: 'Mountain View, CA' } }
    },
  });

  // 2. Fetch IDs
  const institution = await prisma.institution.findFirst({ where: { userId: institutionUser.id } });
  const company = await prisma.company.findFirst({ where: { userId: companyUser.id } });

  // 3. Create Courses
  await prisma.course.create({
    data: {
      title: 'Full-Stack Web Development',
      description: 'Learn everything from HTML to React and Node.js',
      category: 'Web Development',
      instructor: 'Dr. Sarah Smith',
      duration: '12 Weeks',
      price: 49.99,
      institutionId: institution.id,
      modules: {
        create: [
          { title: 'Intro to HTML/CSS', lessons: { create: [{ title: 'What is Web?' }, { title: 'Box Model' }] } },
          { title: 'React Basics', lessons: { create: [{ title: 'JSX' }, { title: 'Hooks' }] } }
        ]
      }
    }
  });

  // 4. Create Jobs
  await prisma.job.create({
    data: {
      title: 'Frontend Engineer',
      description: 'Work with our core UI team to build next-gen products.',
      salary: '$120k - $160k',
      location: 'Remote',
      type: 'Full-time',
      companyId: company.id,
      skills: ['React', 'Tailwind', 'TypeScript']
    }
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
