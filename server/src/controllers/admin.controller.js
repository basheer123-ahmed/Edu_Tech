const asyncHandler = require('express-async-handler');
const { prisma } = require('../config/db');

/**
 * @desc    Get Admin Dashboard Overview Stats
 * @route   GET /api/admin/stats
 * @access  Admin Only
 */
const getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    activeCourses,
    pendingReviews,
    totalEnrollments,
    courses,
    recentUsers,
    recentCourses
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.course.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.enrollment.count(),
    prisma.course.findMany({ select: { price: true } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { name: true, role: true, createdAt: true } }),
    prisma.course.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { title: true, status: true, createdAt: true } })
  ]);

  // Mock revenue calculation (Enrollments * Avg Price)
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price || 0), 0) * (totalEnrollments / (courses.length || 1));

  const recentActivity = [
    ...recentUsers.map(u => ({ type: 'User', name: u.name || 'User', status: `New ${u.role}`, time: u.createdAt, color: 'bg-blue-500' })),
    ...recentCourses.map(c => ({ type: 'Course', name: c.title, status: c.status, time: c.createdAt, color: 'bg-orange-500' }))
  ].sort((a, b) => b.time - a.time).slice(0, 4).map(a => ({
    ...a,
    time: a.time.toLocaleDateString()
  }));

  const growthData = [45, 60, 40, 85, 70, 95, 100, 80, 65, 75, 90, 110];

  res.json({
    stats: {
      totalStudents,
      activeCourses,
      pendingReviews,
      totalRevenue: Math.round(totalRevenue),
      completionRate: 74, // Mock
      aiEngagement: 88, // Mock
      monthlyGrowth: 12.5 // Mock
    },
    recentActivity,
    growthData
  });
});

/**
 * @desc    Get All Students with Details
 * @route   GET /api/admin/students
 * @access  Admin Only
 */
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      student: {
        include: {
          enrollments: { include: { course: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(students);
});

module.exports = {
  getAdminStats,
  getAllStudents
};
