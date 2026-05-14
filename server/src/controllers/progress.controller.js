const asyncHandler = require('express-async-handler');
const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Update lesson progress
 * @route   POST /api/progress/lesson/:lessonId
 * @access  Student
 */
const updateLessonProgress = asyncHandler(async (req, res) => {
  const { isCompleted, watchedDuration } = req.body;
  const lessonId = req.params.lessonId;
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });

  if (!student) throw new ApiError(403, 'Student profile not found');

  const progress = await prisma.lessonProgress.upsert({
    where: {
      studentId_lessonId: {
        studentId: student.id,
        lessonId
      }
    },
    update: {
      isCompleted,
      watchedDuration: parseInt(watchedDuration) || 0
    },
    create: {
      studentId: student.id,
      lessonId,
      isCompleted,
      watchedDuration: parseInt(watchedDuration) || 0
    }
  });

  // Calculate and update overall course progress
  const lesson = await prisma.lesson.findUnique({ 
    where: { id: lessonId },
    include: { module: true }
  });
  
  if (lesson) {
    const courseId = lesson.module.courseId;
    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId } }
    });
    
    const completedLessons = await prisma.lessonProgress.count({
      where: { 
        studentId: student.id,
        isCompleted: true,
        lesson: { module: { courseId } }
      }
    });

    const overallProgress = (completedLessons / totalLessons) * 100;

    await prisma.enrollment.updateMany({
      where: { studentId: student.id, courseId },
      data: { 
        progress: overallProgress,
        status: overallProgress === 100 ? 'COMPLETED' : 'ENROLLED'
      }
    });
  }

  res.json(progress);
});

/**
 * @desc    Get student course progress
 * @route   GET /api/progress/course/:courseId
 * @access  Student
 */
const getCourseProgress = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });

  if (!student) throw new ApiError(403, 'Student profile not found');

  const lessonProgress = await prisma.lessonProgress.findMany({
    where: {
      studentId: student.id,
      lesson: { module: { courseId } }
    }
  });

  res.json(lessonProgress);
});

module.exports = {
  updateLessonProgress,
  getCourseProgress
};
