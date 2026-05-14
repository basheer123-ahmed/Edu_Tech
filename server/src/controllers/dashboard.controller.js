const { prisma } = require('../config/db');

const getStudentDashboard = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
      include: {
        enrollments: { include: { course: true } },
        applications: { include: { job: true } },
        certificates: true,
        projects: true,
        analytics: true
      }
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student dashboard', error: error.message });
  }
};

const getStudentCourses = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: {
        course: {
          include: {
            _count: { select: { modules: true } },
            progress: {
              where: { studentId: student.id }
            }
          }
        }
      }
    });

    // Format the response to be an array of courses with progress embedded
    const courses = enrollments.map(e => ({
      ...e.course,
      progress: e.course.progress?.[0] || { percentage: 0 },
      isCompleted: e.course.progress?.[0]?.isCompleted || false
    }));

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student courses', error: error.message });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const stats = {
      users: await prisma.user.count(),
      students: await prisma.student.count(),
      institutions: await prisma.institution.count(),
      companies: await prisma.company.count(),
      courses: await prisma.course.count(),
      jobs: await prisma.job.count(),
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin dashboard', error: error.message });
  }
};

const getInstitutionDashboard = async (req, res) => {
  try {
    const institution = await prisma.institution.findUnique({
      where: { userId: req.user.id },
      include: {
        courses: { include: { enrollments: true } }
      }
    });
    res.json(institution);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching institution dashboard', error: error.message });
  }
};

const getCompanyDashboard = async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { userId: req.user.id },
      include: {
        jobs: { include: { applications: { include: { student: { include: { user: { select: { name: true, email: true } } } } } } } },
        internships: true
      }
    });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company dashboard', error: error.message });
  }
};

module.exports = {
  getStudentDashboard,
  getStudentCourses,
  getAdminDashboard,
  getInstitutionDashboard,
  getCompanyDashboard
};
