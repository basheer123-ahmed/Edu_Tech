const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({ take: 5 });
    console.log('--- Users ---', users.length);
    console.log(users.map(u => ({ id: u.id, email: u.email, role: u.role })));

    const courses = await prisma.course.findMany({ take: 5 });
    console.log('--- Courses ---', courses.length);
    console.log(courses.map(c => ({ id: c.id, title: c.title, category: c.category })));

    const assignments = await prisma.assignment.findMany({ take: 5 });
    console.log('--- Assignments ---', assignments.length);
    console.log(assignments);

    const questions = await prisma.question.findMany({ take: 5 });
    console.log('--- Questions ---', questions.length);
    console.log(questions);

    const enrollments = await prisma.enrollment.findMany({ take: 5 });
    console.log('--- Enrollments ---', enrollments.length);
    console.log(enrollments);

  } catch (error) {
    console.error('Error querying DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
