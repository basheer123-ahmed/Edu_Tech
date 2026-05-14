const asyncHandler = require('express-async-handler');
const { prisma } = require('../config/db');
const { GamificationService, XP_REWARDS } = require('../services/gamification.service');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get all assignments for a course (Roadmap)
 */
const getCourseAssignments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });

  const assignments = await prisma.assignment.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { question: true } },
      submission: {
        where: { studentId: student.id },
        select: { isPassed: true, score: true }
      }
    }
  });

  res.json(assignments);
});

/**
 * @desc    Submit Assignment
 */
const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { answers } = req.body;
  const userId = req.user.id;
  
  const student = await prisma.student.findUnique({ where: { userId } });
  const assignment = await prisma.assignment.findUnique({ 
    where: { id: assignmentId },
    include: { question: true }
  });

  if (!assignment) throw new ApiError(404, 'Assignment not found');

  // Basic Grading Logic
  let correctCount = 0;
  assignment.questions.forEach((q, idx) => {
    if (q.type === 'MCQ' && q.correctOption === answers[q.id]) {
      correctCount++;
    }
    // Coding logic would be more complex, but we'll mock pass for now
    if (q.type === 'CODING') correctCount++; 
  });

  const score = (correctCount / assignment.questions.length) * 100;
  const isPassed = score >= 50;

  const submission = await prisma.submission.create({
    data: {
      id: require('uuid').v4(),
      studentId: student.id,
      assignmentId,
      answers: answers,
      score,
      isPassed,
    }
  });

  if (isPassed) {
    await GamificationService.awardXp(userId, assignment.xpReward, `Completing Assignment: ${assignment.title}`);
    
    // Check if this was the first problem solved
    const totalSolved = await prisma.submission.count({
      where: { studentId: student.id, isPassed: true }
    });
    if (totalSolved === 1) {
      await GamificationService.awardBadge(userId, 'First Step');
    }
  }

  res.json(submission);
});

/**
 * @desc    Get Exam with questions
 */
const getExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { question: true }
  });

  if (!exam) throw new ApiError(404, 'Exam not found');

  res.json(exam);
});

module.exports = {
  getCourseAssignments,
  submitAssignment,
  getExam
};
