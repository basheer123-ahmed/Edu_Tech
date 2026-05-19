const asyncHandler = require('express-async-handler');
const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');

// Helper: Get student or throw
const getStudent = async (userId) => {
  const s = await prisma.student.findUnique({ where: { userId } });
  if (!s) throw new ApiError(404, 'Student profile not found');
  return s;
};

/**
 * GET /api/student/dashboard
 * High-density overview for the enterprise dashboard
 */
const getStudentDashboard = asyncHandler(async (req, res) => {
  const student = await getStudent(req.user.id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    enrollments,
    submissions,
    examAttempts,
    badges,
    skills,
    notifications,
    banners,
    dailyGoals,
    upcomingExams,
    upcomingAssignments,
    attendanceData
  ] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: {
        course: {
          select: { id: true, title: true, thumbnail: true, category: true, difficulty: true, duration: true, status: true }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    }),
    prisma.submission.findMany({
      where: { studentId: student.id },
      orderBy: { submittedAt: 'desc' },
      take: 50
    }),
    prisma.examattempt.findMany({
      where: { studentId: student.id },
      orderBy: { startedAt: 'desc' }
    }),
    prisma.userbadge.findMany({
      where: { studentId: student.id },
      include: { badge: true }
    }),
    prisma.skill.findMany({ where: { studentId: student.id } }),
    prisma.notification.findMany({
      where: { userId: req.user.id, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 15
    }),
    prisma.banner.findMany({ where: { active: true } }),
    prisma.dailygoal.findMany({
      where: { studentId: student.id, date: { gte: today } }
    }),
    prisma.exam.findMany({
      where: { course: { enrollment: { some: { studentId: student.id } } } },
      take: 5,
      orderBy: { id: 'desc' } // Placeholder for "upcoming" logic
    }),
    prisma.assignment.findMany({
      where: { course: { enrollment: { some: { studentId: student.id } } } },
      take: 5,
      orderBy: { id: 'desc' }
    }),
    prisma.attendance.findMany({
      where: { studentId: student.id },
      orderBy: { date: 'desc' },
      take: 30
    })
  ]);

  // Analytics logic
  const passedExams = examAttempts.filter(e => e.passed).length;
  const passedSubmissions = submissions.filter(s => s.isPassed).length;
  
  // Advanced Employability Score
  const employabilityScore = Math.min(100, Math.round(
    (passedSubmissions * 1.5) + (passedExams * 4) + (skills.length * 5) + 
    (student.streak * 0.5) + (student.atsScore ? student.atsScore * 0.3 : 0) +
    Math.min(student.xp / 200, 15)
  ));

  // Productivity Insights (XP earned in last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const xpTransactions = await prisma.xptransaction.findMany({
    where: { userId: req.user.id, createdAt: { gte: weekAgo } }
  });
  const recentXP = xpTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  res.json({
    student: {
      id: student.id,
      xp: student.xp,
      level: student.level,
      streak: student.streak,
      maxStreak: student.maxStreak,
      rank: student.rank,
      atsScore: student.atsScore,
      lastActive: student.lastActive,
    },
    stats: {
      totalCourses: enrollments.length,
      completedCourses: 0, // Logic to be refined based on progress
      totalSubmissions: submissions.length,
      passedSubmissions,
      totalExams: examAttempts.length,
      passedExams,
      employabilityScore,
      skillsCount: skills.length,
      badgesCount: badges.length,
      attendancePercentage: attendanceData.length > 0 
        ? Math.round((attendanceData.filter(a => a.status === 'PRESENT').length / 30) * 100) 
        : 0,
      recentXP
    },
    banners,
    dailyGoals,
    upcomingExams,
    upcomingAssignments,
    enrollments,
    badges: badges.map(ub => ({ ...ub.badge, unlockedAt: ub.unlockedAt })),
    skills,
    notifications,
    attendance: attendanceData
  });
});

/**
 * GET /api/student/progress
 * Circular progress: courses, tests, assignments
 */
const getStudentProgress = asyncHandler(async (req, res) => {
  const student = await getStudent(req.user.id);

  const [courseProgress, submissions, examAttempts, totalAssignments] = await Promise.all([
    prisma.courseprogress.findMany({
      where: { studentId: student.id },
      include: { course: { select: { title: true, thumbnail: true } } }
    }),
    prisma.submission.findMany({ where: { studentId: student.id } }),
    prisma.examattempt.findMany({ where: { studentId: student.id } }),
    prisma.assignment.count({
      where: {
        course: { enrollment: { some: { studentId: student.id } } }
      }
    })
  ]);

  const avgCourseProgress = courseProgress.length
    ? Math.round(courseProgress.reduce((a, c) => a + c.percentage, 0) / courseProgress.length)
    : 0;

  const assignmentProgress = totalAssignments > 0
    ? Math.round((submissions.length / totalAssignments) * 100)
    : 0;

  const passedExams = examAttempts.filter(e => e.passed).length;
  const examProgress = examAttempts.length > 0
    ? Math.round((passedExams / examAttempts.length) * 100)
    : 0;

  const attendanceData = await prisma.attendance.findMany({
    where: { studentId: student.id },
    take: 30
  });
  const attendanceProgress = attendanceData.length > 0
    ? Math.round((attendanceData.filter(a => a.status === 'PRESENT').length / attendanceData.length) * 100)
    : 85; // default fallback

  res.json({
    courseProgress: avgCourseProgress,
    assignmentProgress,
    examProgress,
    attendanceProgress,
    courseProgressDetails: courseProgress,
  });
});

/**
 * GET /api/student/leaderboard
 * Top students by XP with realtime-ish feel
 */
const getLeaderboard = asyncHandler(async (req, res) => {
  const student = await getStudent(req.user.id);

  const topStudents = await prisma.student.findMany({
    orderBy: { xp: 'desc' },
    take: 50,
    include: {
      user: { select: { name: true, avatar: true } }
    }
  });

  const myRank = topStudents.findIndex(s => s.id === student.id) + 1;
  const myPosition = myRank > 0 ? myRank : await prisma.student.count({ where: { xp: { gt: student.xp } } }) + 1;

  res.json({
    leaderboard: topStudents.map((s, idx) => ({
      rank: idx + 1,
      studentId: s.id,
      name: s.user.name,
      avatar: s.user.avatar,
      xp: s.xp,
      level: s.level,
      streak: s.streak,
      isCurrentUser: s.id === student.id
    })),
    myRank: myPosition,
    myXP: student.xp
  });
});

/**
 * GET /api/student/streak
 * Streak data + submission heatmap
 */
const getStreakData = asyncHandler(async (req, res) => {
  const student = await getStudent(req.user.id);
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  const [submissions, examAttempts] = await Promise.all([
    prisma.submission.findMany({
      where: { studentId: student.id, submittedAt: { gte: yearAgo } },
      select: { submittedAt: true }
    }),
    prisma.examattempt.findMany({
      where: { studentId: student.id, startedAt: { gte: yearAgo } },
      select: { startedAt: true }
    })
  ]);

  const heatmap = {};
  [...submissions.map(s => s.submittedAt), ...examAttempts.map(e => e.startedAt)].forEach(date => {
    const key = date.toISOString().slice(0, 10);
    heatmap[key] = (heatmap[key] || 0) + 1;
  });

  res.json({
    currentStreak: student.streak,
    longestStreak: student.maxStreak,
    heatmap,
    lastActive: student.lastActive
  });
});

/**
 * GET /api/student/analytics
 * Expanded analytics for drives and performance
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const student = await getStudent(req.user.id);

  const [applications, totalJobs, xpHistory, courseProgress] = await Promise.all([
    prisma.application.findMany({
      where: { studentId: student.id },
      include: { job: { select: { title: true, type: true, company: { select: { user: { select: { name: true } } } } } } },
      orderBy: { appliedAt: 'desc' }
    }),
    prisma.job.count(),
    prisma.xptransaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    }),
    prisma.courseprogress.findMany({
      where: { studentId: student.id },
      include: { course: { select: { title: true, category: true } } }
    })
  ]);

  // Mocking placement rate and interview performance for density
  res.json({
    applications: {
      total: applications.length,
      eligible: totalJobs,
      applied: applications.length,
      placementRate: 85,
      interviewPerformance: 72,
      byStatus: applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {}),
      recent: applications.slice(0, 8)
    },
    xpHistory: xpHistory.reduce((acc, tx) => {
      const key = tx.createdAt.toISOString().slice(0, 10);
      acc[key] = (acc[key] || 0) + tx.amount;
      return acc;
    }, {}),
    courseProgress
  });
});

/**
 * GET /api/student/skills
 * Skill cards with progress levels
 */
const getSkills = asyncHandler(async (req, res) => {
  const student = await getStudent(req.user.id);

  const skills = await prisma.skill.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: 'desc' }
  });

  const levelProgress = { BEGINNER: 20, INTERMEDIATE: 50, ADVANCED: 80, EXPERT: 100 };

  res.json(skills.map(s => ({
    ...s,
    progress: levelProgress[s.level.toUpperCase()] || 20
  })));
});

/**
 * GET /api/student/attendance
 * Attendance records
 */
const getAttendance = asyncHandler(async (req, res) => {
  const student = await getStudent(req.user.id);

  const attendance = await prisma.attendance.findMany({
    where: { studentId: student.id },
    orderBy: { date: 'desc' }
  });

  res.json({
    attendance,
    totalPresent: attendance.filter(a => a.status === 'PRESENT').length,
    totalAbsent: attendance.filter(a => a.status === 'ABSENT').length
  });
});

/**
 * GET /api/student/recommendations
 * AI-style recommendations
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const student = await getStudent(req.user.id);

  const [recs, suggestedCourses] = await Promise.all([
    prisma.recommendation.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.course.findMany({
      where: { status: 'PUBLISHED', enrollment: { none: { studentId: student.id } } },
      take: 4
    })
  ]);

  res.json({ recommendations: recs, suggestedCourses });
});

/**
 * POST /api/student/courses/enroll
 * Enroll student in a course and initialize progress
 */
const enrollStudentCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) throw new ApiError(400, 'courseId is required');

  const student = await getStudent(req.user.id);

  // Validate course exists
  const courseObj = await prisma.course.findUnique({
    where: { id: courseId }
  });
  if (!courseObj) throw new ApiError(404, 'Course not found');

  // Prevent duplicate enrollment
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: { studentId: student.id, courseId }
  });
  if (existingEnrollment) {
    throw new ApiError(400, 'Already enrolled in this course');
  }

  // Create enrollment, student_progress, and courseprogress inside a transaction
  const uuid = require('uuid');
  const result = await prisma.$transaction(async (tx) => {
    const enrollment = await tx.enrollment.create({
      data: {
        id: uuid.v4(),
        studentId: student.id,
        courseId
      }
    });

    const studentProgress = await tx.student_progress.create({
      data: {
        id: uuid.v4(),
        studentId: student.id,
        courseId,
        unlockedLevels: JSON.stringify([1]),
        completedLevels: JSON.stringify([]),
        progressPercentage: 0
      }
    });

    // Create standard courseprogress for lessons integration compatibility
    const cp = await tx.courseprogress.create({
      data: {
        id: uuid.v4(),
        studentId: student.id,
        courseId,
        percentage: 0,
        isCompleted: false,
        lastAccessedAt: new Date()
      }
    });

    return { enrollment, studentProgress };
  });

  res.status(201).json({
    message: 'Enrolled successfully',
    enrollment: result.enrollment,
    studentProgress: result.studentProgress
  });
});

/**
 * GET /api/student/courses/stats
 * Stats for courses (Available, Enrolled, Completed, Certificates) plus course lists
 */
const getStudentCourseStats = asyncHandler(async (req, res) => {
  const student = await getStudent(req.user.id);

  const [available, enrollments, courseProgresses, certificates] = await Promise.all([
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.enrollment.findMany({
      where: { studentId: student.id },
      select: { courseId: true }
    }),
    prisma.courseprogress.findMany({
      where: { studentId: student.id },
      select: { courseId: true, isCompleted: true }
    }),
    prisma.certificate.count({ where: { studentId: student.id } })
  ]);

  const enrolledCourseIds = enrollments.map(e => e.courseId);
  const completedCourseIds = courseProgresses.filter(cp => cp.isCompleted).map(cp => cp.courseId);

  res.json({
    available,
    enrolled: enrolledCourseIds.length,
    completed: completedCourseIds.length,
    certificates,
    enrolledCourseIds,
    completedCourseIds
  });
});

module.exports = {
  getStudentDashboard,
  getStudentProgress,
  getLeaderboard,
  getStreakData,
  getSkills,
  getAnalytics,
  getAttendance,
  getRecommendations,
  enrollStudentCourse,
  getStudentCourseStats
};
