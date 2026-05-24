const asyncHandler = require('express-async-handler');
const { prisma } = require('../config/db');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const { runCode } = require('../utils/codeRunner');
const { generateQuestions } = require('../services/llm.service');
const ApiError = require('../utils/ApiError');

// Local fallback database file for violations to avoid schema migration blockages
const VIOLATIONS_FILE = path.join(__dirname, '../../uploads/violations.json');
const ensureViolationsFile = () => {
  const dir = path.dirname(VIOLATIONS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VIOLATIONS_FILE)) fs.writeFileSync(VIOLATIONS_FILE, JSON.stringify([]));
};

/**
 * Helper to seed course assignments dynamically if empty
 */
async function seedCourseAssignments(courseId) {
  const count = await prisma.assignment.count({ where: { courseId } });
  if (count > 0) return;

  console.log(`🌱 Seeding mock levels and questions for course: ${courseId}`);

  // Level 1: Basics (MCQ)
  const lvl1 = await prisma.assignment.create({
    data: {
      id: uuid.v4(),
      title: 'Programming Basics (Level 1)',
      description: 'Test your foundational syntax and core concept knowledge.',
      order: 1,
      xpReward: 100,
      difficulty: 'BEGINNER',
      status: 'PUBLISHED', // Auto seeded as published
      courseId,
    }
  });

  await prisma.question.createMany({
    data: [
      {
        id: uuid.v4(),
        text: 'What is the correct syntax to output "Hello World" in Python?',
        type: 'MCQ',
        order: 1,
        points: 10,
        options: JSON.stringify(['print("Hello World")', 'echo("Hello World")', 'p("Hello World")', 'printf("Hello World")']),
        correctOption: 'print("Hello World")',
        assignmentId: lvl1.id
      },
      {
        id: uuid.v4(),
        text: 'Which data type is used to store values with decimal points?',
        type: 'MCQ',
        order: 2,
        points: 10,
        options: JSON.stringify(['int', 'float', 'boolean', 'char']),
        correctOption: 'float',
        assignmentId: lvl1.id
      }
    ]
  });

  // Level 2: Loops & Logic (Coding)
  const lvl2 = await prisma.assignment.create({
    data: {
      id: uuid.v4(),
      title: 'Loops & Logic (Level 2)',
      description: 'Implement core logical functions and control flow algorithms.',
      order: 2,
      xpReward: 150,
      difficulty: 'INTERMEDIATE',
      status: 'PUBLISHED', // Auto seeded as published
      courseId,
    }
  });

  await prisma.question.create({
    data: {
      id: uuid.v4(),
      text: 'Write a function solve(a, b) that returns the sum of two integers.',
      type: 'CODING',
      order: 1,
      points: 20,
      starterCode: JSON.stringify({
        javascript: 'function solve(a, b) {\n  // Write your code here\n  return a + b;\n}',
        python: 'def solve(a, b):\n    # Write your code here\n    return a + b',
        cpp: 'int solve(int a, int b) {\n    // Write your code here\n    return a + b;\n}',
        java: 'public class Solution {\n    public static int solve(int a, int b) {\n        // Write your code here\n        return a + b;\n    }\n}'
      }),
      testCases: JSON.stringify([
        { input: '2,3', output: '5' },
        { input: '-1,4', output: '3' }
      ]),
      assignmentId: lvl2.id
    }
  });

  // Level 3: OOP foundations (Both MCQ & Coding)
  const lvl3 = await prisma.assignment.create({
    data: {
      id: uuid.v4(),
      title: 'Object Oriented Design (Level 3)',
      description: 'Learn classes, inheritance, encapsulation and polymorphism.',
      order: 3,
      xpReward: 200,
      difficulty: 'ADVANCED',
      status: 'PUBLISHED', // Auto seeded as published
      courseId,
    }
  });

  await prisma.question.create({
    data: {
      id: uuid.v4(),
      text: 'Which OOP concept refers to hiding internal details and exposing only what is necessary?',
      type: 'MCQ',
      order: 1,
      points: 10,
      options: JSON.stringify(['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction']),
      correctOption: 'Encapsulation',
      assignmentId: lvl3.id
    }
  });

  await prisma.question.create({
    data: {
      id: uuid.v4(),
      text: 'Write a function solve(num) that returns true if the number is even, and false otherwise.',
      type: 'CODING',
      order: 2,
      points: 20,
      starterCode: JSON.stringify({
        javascript: 'function solve(num) {\n  return num % 2 === 0;\n}',
        python: 'def solve(num):\n    return num % 2 == 0',
        cpp: 'bool solve(int num) {\n    return num % 2 == 0;\n}',
        java: 'public class Solution {\n    public static boolean solve(int num) {\n        return num % 2 == 0;\n    }\n}'
      }),
      testCases: JSON.stringify([
        { input: '4', output: 'true' },
        { input: '7', output: 'false' }
      ]),
      assignmentId: lvl3.id
    }
  });

  // Level 4: Final Comprehensive Exam (Secure)
  const lvl4 = await prisma.assignment.create({
    data: {
      id: uuid.v4(),
      title: 'Final Comprehensive Exam (Secure)',
      description: 'The secure, proctored comprehensive exam testing your core logical programming and design foundations.',
      order: 4,
      xpReward: 300,
      difficulty: 'ADVANCED',
      status: 'PUBLISHED',
      courseId,
    }
  });

  await prisma.question.create({
    data: {
      id: uuid.v4(),
      text: 'Which data structure follows the Last-In-First-Out (LIFO) principle?',
      type: 'MCQ',
      order: 1,
      points: 20,
      options: JSON.stringify(['Queue', 'Stack', 'Linked List', 'Binary Tree']),
      correctOption: 'Stack',
      assignmentId: lvl4.id
    }
  });

  await prisma.question.create({
    data: {
      id: uuid.v4(),
      text: 'Write a function solve(n) that returns the nth Fibonacci number. Assume n >= 0.',
      type: 'CODING',
      order: 2,
      points: 50,
      starterCode: JSON.stringify({
        javascript: 'function solve(n) {\n  if (n <= 1) return n;\n  let prev2 = 0, prev1 = 1;\n  for (let i = 2; i <= n; i++) {\n    let current = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = current;\n  }\n  return prev1;\n}',
        python: 'def solve(n):\n    if n <= 1: return n\n    prev2, prev1 = 0, 1\n    for i in range(2, n + 1):\n        current = prev1 + prev2\n        prev2 = prev1\n        prev1 = current\n    return prev1',
        cpp: 'int solve(int n) {\n    if (n <= 1) return n;\n    int prev2 = 0, prev1 = 1;\n    for (int i = 2; i <= n; i++) {\n        int current = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = current;\n    }\n    return prev1;\n}',
        java: 'public class Solution {\n    public static int solve(int n) {\n        if (n <= 1) return n;\n        int prev2 = 0, prev1 = 1;\n        for (int i = 2; i <= n; i++) {\n            int current = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = current;\n        }\n        return prev1;\n    }\n}'
      }),
      testCases: JSON.stringify([
        { input: '5', output: '5' },
        { input: '8', output: '21' }
      ]),
      assignmentId: lvl4.id
    }
  });
}

/**
 * GET student overall metrics
 */
const getAssignmentStats = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  const submissions = await prisma.submission.findMany({
    where: { studentId: student.id }
  });

  // Filter only questions from published levels
  const totalQuestions = await prisma.question.count({
    where: { assignment: { status: 'PUBLISHED' } }
  });
  
  const solved = submissions.filter(s => s.isPassed).length;
  const attempted = submissions.length;
  const marksObtained = submissions.reduce((acc, curr) => acc + curr.score, 0);

  res.json({
    totalQuestions: totalQuestions || 5,
    solved,
    attempted,
    marksObtained: attempted ? Math.round(marksObtained / attempted) : 0
  });
});

/**
 * GET student enrolled courses with progress
 */
const getAssignmentCourses = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  // Find all course enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: student.id },
    include: {
      course: {
        include: {
          assignment: {
            where: { status: 'PUBLISHED' }, // Only fetch published
            include: {
              submission: { where: { studentId: student.id } }
            }
          }
        }
      }
    }
  });

  const formatted = await Promise.all(enrollments.map(async (enrollment) => {
    const course = enrollment.course;
    
    // Auto seed course if it has zero assignments in total
    const totalDbCount = await prisma.assignment.count({ where: { courseId: course.id } });
    if (totalDbCount === 0) {
      await seedCourseAssignments(course.id);
      // Re-fetch assignments
      course.assignment = await prisma.assignment.findMany({
        where: { courseId: course.id, status: 'PUBLISHED' },
        include: {
          submission: { where: { studentId: student.id } }
        }
      });
    }

    const totalLevels = course.assignment.length;
    const completedLevels = course.assignment.filter(a => a.submission.some(s => s.isPassed)).length;
    
    const totalQuestions = await prisma.question.count({
      where: { assignment: { courseId: course.id, status: 'PUBLISHED' } }
    });
    
    const avgScore = course.assignment.reduce((acc, curr) => {
      const bestScore = curr.submission.reduce((max, s) => Math.max(max, s.score), 0);
      return acc + bestScore;
    }, 0);

    return {
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail,
      difficulty: course.difficulty,
      totalLevels,
      completedLevels,
      totalQuestions,
      avgScore: totalLevels ? Math.round(avgScore / totalLevels) : 0,
      percentage: totalLevels ? Math.round((completedLevels / totalLevels) * 100) : 0
    };
  }));

  res.json(formatted);
});

/**
 * GET level details & questions for student workspace
 */
const getAssignmentLevelDetails = asyncHandler(async (req, res) => {
  const { levelId } = req.params;
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  const assignmentExists = await prisma.assignment.findUnique({
    where: { id: levelId },
    select: { courseId: true }
  });
  if (!assignmentExists) throw new ApiError(404, 'Level/Assignment not found');

  const isEnrolled = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: assignmentExists.courseId
      }
    }
  });
  if (!isEnrolled) throw new ApiError(403, 'You must be enrolled in this course to access this level');

  const assignment = await prisma.assignment.findFirst({
    where: { id: levelId, status: 'PUBLISHED' }, // Block access to draft levels
    include: {
      question: {
        orderBy: { order: 'asc' }
      },
      submission: {
        where: { studentId: student.id },
        orderBy: { submittedAt: 'desc' },
        take: 1
      }
    }
  });

  if (!assignment) throw new ApiError(404, 'Level/Assignment not found or is in DRAFT mode');

  const formattedQuestions = assignment.question.map(q => {
    return {
      ...q,
      options: q.options ? JSON.parse(q.options) : null,
      starterCode: q.starterCode ? JSON.parse(q.starterCode) : null,
      testCases: q.testCases ? JSON.parse(q.testCases) : null
    };
  });

  res.json({
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    xpReward: assignment.xpReward,
    order: assignment.order,
    questions: formattedQuestions,
    lastSubmission: assignment.submission[0] || null
  });
});

/**
 * GET levels roadmap list for a selected course
 */
const getCourseAssignments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  const isEnrolled = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId
      }
    }
  });
  if (!isEnrolled) throw new ApiError(403, 'You must be enrolled in this course to access assignments');

  // Trigger auto seeder if no assignments exist
  const totalDbCount = await prisma.assignment.count({ where: { courseId } });
  if (totalDbCount === 0) {
    await seedCourseAssignments(courseId);
  }

  const assignments = await prisma.assignment.findMany({
    where: { courseId, status: 'PUBLISHED' }, // Only show published levels to student
    orderBy: { order: 'asc' },
    include: {
      question: { select: { id: true, type: true } },
      submission: {
        where: { studentId: student.id },
        select: { isPassed: true, score: true }
      }
    }
  });

  let previousCompleted = true;
  const roadmap = assignments.map((lvl) => {
    const isCompleted = lvl.submission.some(s => s.isPassed);
    const score = lvl.submission.reduce((max, s) => Math.max(max, s.score), 0);
    const isUnlocked = previousCompleted;
    
    previousCompleted = isCompleted;

    const types = [...new Set(lvl.question.map(q => q.type.toLowerCase()))];
    let type = 'mcq';
    if (types.includes('mcq') && types.includes('coding')) type = 'both';
    else if (types.includes('coding')) type = 'coding';

    return {
      id: lvl.id,
      title: lvl.title,
      description: lvl.description,
      order: lvl.order,
      type,
      xpReward: lvl.xpReward,
      isUnlocked,
      isCompleted,
      score,
      problemsCount: lvl.question.length
    };
  });

  res.json(roadmap);
});

/**
 * Robust helper to match student MCQ answer against the correct option
 */
const isMcqCorrect = (studentAnswer, correctOption, optionsJson) => {
  if (studentAnswer === undefined || studentAnswer === null || correctOption === undefined || correctOption === null) {
    return false;
  }

  const cleanStudent = String(studentAnswer).trim().toLowerCase();
  const cleanCorrect = String(correctOption).trim().toLowerCase();

  // 1. Direct comparison (case-insensitive, trimmed)
  if (cleanStudent === cleanCorrect) return true;

  // 2. Strip standard A./A)/A- prefixes and compare
  const stripPrefix = (str) => str.replace(/^[A-Da-d0-9]\s*[\.\):\-\s]+\s*/, '').trim().toLowerCase();
  if (stripPrefix(studentAnswer) === stripPrefix(correctOption)) return true;

  // Try parsing options if provided
  let options = [];
  if (optionsJson) {
    try {
      options = typeof optionsJson === 'string' ? JSON.parse(optionsJson) : optionsJson;
    } catch (e) {
      console.error("Error parsing options in isMcqCorrect:", e);
    }
  }

  if (Array.isArray(options) && options.length > 0) {
    // 3. If correctOption is a single letter (e.g., 'A', 'B', 'C', 'D')
    if (/^[a-d]$/.test(cleanCorrect)) {
      const index = cleanCorrect.charCodeAt(0) - 97; // 'a' is 97
      if (options[index]) {
        const cleanOptionText = String(options[index]).trim().toLowerCase();
        if (cleanStudent === cleanOptionText || stripPrefix(cleanStudent) === stripPrefix(cleanOptionText)) return true;
      }
    }

    // 4. If correctOption is an option index (e.g., '0', '1', '2', '3')
    const parsedIdx = parseInt(cleanCorrect, 10);
    if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < options.length) {
      const cleanOptionText = String(options[parsedIdx]).trim().toLowerCase();
      if (cleanStudent === cleanOptionText || stripPrefix(cleanStudent) === stripPrefix(cleanOptionText)) return true;
    }

    // 5. Reverse check: What if studentAnswer is 'A', 'B', 'C', 'D' but correctOption is the option text?
    if (/^[a-d]$/.test(cleanStudent)) {
      const index = cleanStudent.charCodeAt(0) - 97;
      if (options[index]) {
        const cleanOptionText = String(options[index]).trim().toLowerCase();
        if (cleanCorrect === cleanOptionText || stripPrefix(cleanCorrect) === stripPrefix(cleanOptionText)) return true;
      }
    }

    // 6. Reverse check: What if studentAnswer is '0', '1', '2', '3' but correctOption is the option text?
    const parsedStudentIdx = parseInt(cleanStudent, 10);
    if (!isNaN(parsedStudentIdx) && parsedStudentIdx >= 0 && parsedStudentIdx < options.length) {
      const cleanOptionText = String(options[parsedStudentIdx]).trim().toLowerCase();
      if (cleanCorrect === cleanOptionText || stripPrefix(cleanCorrect) === stripPrefix(cleanOptionText)) return true;
    }
  }

  return false;
};

/**
 * SUBMIT and Grade assignment levels (MCQ + Code Compilation)
 */
const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { answers, language = 'javascript' } = req.body;
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { question: true }
  });

  if (!assignment) throw new ApiError(404, 'Assignment level not found');

  const isEnrolled = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: assignment.courseId
      }
    }
  });
  if (!isEnrolled) throw new ApiError(403, 'You must be enrolled in this course to submit assignments');

  let totalPoints = 0;
  let earnedPoints = 0;
  const codingResults = {};

  console.log(`\n📝 Grading submission for assignmentId: ${assignmentId}`);

  for (const q of assignment.question) {
    totalPoints += q.points;

    if (q.type === 'MCQ') {
      const studentAnswer = answers[q.id];
      const isCorrect = isMcqCorrect(studentAnswer, q.correctOption, q.options);
      
      console.log(`   [MCQ] Question: "${q.text.substring(0, 40)}..."`);
      console.log(`         Student Answer: "${studentAnswer}"`);
      console.log(`         Correct Option: "${q.correctOption}"`);
      console.log(`         Grading Result: ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);

      if (isCorrect) {
        earnedPoints += q.points;
      }
    } else if (q.type === 'CODING') {
      const codeInput = answers[q.id];
      const testCases = q.testCases ? JSON.parse(q.testCases) : [];
      const execution = await runCode(language, codeInput, testCases);
      
      codingResults[q.id] = execution;
      
      console.log(`   [CODING] Question: "${q.text.substring(0, 40)}..."`);
      console.log(`            Grading Result: ${execution.success ? '✅ SUCCESS' : '❌ FAILED'} (${execution.passedCount}/${execution.totalCount} test cases)`);

      if (execution.success) {
        earnedPoints += q.points;
      }
    }
  }

  const score = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 100;
  const isPassed = score >= 50;

  const submission = await prisma.submission.create({
    data: {
      id: uuid.v4(),
      studentId: student.id,
      assignmentId,
      answers: JSON.stringify({ answers, codingResults, language }),
      score,
      isPassed
    }
  });

  if (isPassed) {
    await prisma.student.update({
      where: { id: student.id },
      data: { xp: { increment: assignment.xpReward } }
    });
  }

  res.json({
    submissionId: submission.id,
    score,
    isPassed,
    codingResults
  });
});

/**
 * ADMIN: Get all course levels/questions
 */
const getAdminCourseAssignments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const assignments = await prisma.assignment.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: {
      question: true
    }
  });

  const formatted = assignments.map(a => ({
    ...a,
    questions: a.question.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null,
      starterCode: q.starterCode ? JSON.parse(q.starterCode) : null,
      testCases: q.testCases ? JSON.parse(q.testCases) : null
    }))
  }));

  res.json(formatted);
});

/**
 * ADMIN: Create level (Default status: DRAFT)
 */
const createAdminLevel = asyncHandler(async (req, res) => {
  const { courseId, title, description, order, xpReward = 100, difficulty = 'BEGINNER' } = req.body;
  const level = await prisma.assignment.create({
    data: {
      id: uuid.v4(),
      courseId,
      title,
      description,
      order: parseInt(order) || 1,
      xpReward: parseInt(xpReward) || 100,
      difficulty,
      status: 'DRAFT' // Starts as DRAFT
    }
  });
  res.status(201).json(level);
});

/**
 * ADMIN: Delete level
 */
const deleteAdminLevel = asyncHandler(async (req, res) => {
  const { levelId } = req.params;
  await prisma.assignment.delete({ where: { id: levelId } });
  res.json({ message: 'Level deleted successfully' });
});

/**
 * ADMIN: Add manual question (Immediately persisted)
 */
const createAdminQuestion = asyncHandler(async (req, res) => {
  const { assignmentId, text, type, points, options, correctOption, starterCode, testCases } = req.body;
  const question = await prisma.question.create({
    data: {
      id: uuid.v4(),
      assignmentId,
      text,
      type,
      points: parseInt(points) || 10,
      options: options ? JSON.stringify(options) : null,
      correctOption,
      starterCode: starterCode ? JSON.stringify(starterCode) : null,
      testCases: testCases ? JSON.stringify(testCases) : null
    }
  });
  res.status(201).json(question);
});

/**
 * ADMIN: AI Generate Questions (Raw output returned to front-end for preview/edit)
 */
const generateAdminAIQuestions = asyncHandler(async (req, res) => {
  const { moduleName, topics, difficulty, questionCount, questionType, courseName } = req.body;

  console.log("🤖 Admin AI Generation Request:", req.body);

  try {
    const generated = await generateQuestions({
      moduleName,
      topics,
      difficulty,
      questionCount: parseInt(questionCount) || 10,
      questionType,
      courseName
    });

    res.json(generated);
  } catch (error) {
    console.error("❌ generateAdminAIQuestions failed:", error);
    res.status(500).json({ error: error.message || "Failed to generate question with AI" });
  }
});

/**
 * ADMIN: Bulk CSV/JSON Upload
 */
const bulkUploadAdminQuestions = asyncHandler(async (req, res) => {
  const { assignmentId, questions } = req.body;
  const createdQuestions = [];

  for (const q of questions) {
    const question = await prisma.question.create({
      data: {
        id: uuid.v4(),
        assignmentId,
        text: q.text || q.title,
        type: q.type || 'MCQ',
        points: parseInt(q.points) || 10,
        options: q.options ? JSON.stringify(q.options) : null,
        correctOption: q.correctOption,
        starterCode: q.starterCode ? JSON.stringify(q.starterCode) : null,
        testCases: q.testCases ? JSON.stringify(q.testCases) : null
      }
    });
    createdQuestions.push(question);
  }

  res.json(createdQuestions);
});

/**
 * ADMIN: Bulk Save Questions for a Level (using a Transaction)
 */
const bulkSaveAdminQuestions = asyncHandler(async (req, res) => {
  const { assignmentId, questions } = req.body;

  if (!assignmentId) throw new ApiError(400, 'Assignment level ID is required');
  if (!Array.isArray(questions)) throw new ApiError(400, 'Questions list must be an array');

  console.log("💾 Bulk Save Request for assignmentId:", assignmentId);
  console.log("Questions Payload count:", questions.length);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete all existing questions for this assignmentId
      await tx.question.deleteMany({
        where: { assignmentId }
      });

      // 2. Create the new questions list
      const createdList = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        const newQuestion = await tx.question.create({
          data: {
            id: uuid.v4(),
            assignmentId,
            text: q.text || q.title || 'Coding Challenge',
            type: q.type || 'MCQ',
            order: i + 1,
            points: parseInt(q.points) || 10,
            options: q.options ? JSON.stringify(q.options) : null,
            correctOption: q.correctOption || null,
            starterCode: q.starterCode ? JSON.stringify(q.starterCode) : null,
            testCases: q.testCases ? JSON.stringify(q.testCases) : null
          }
        });
        createdList.push({
          ...newQuestion,
          options: q.options,
          starterCode: q.starterCode,
          testCases: q.testCases
        });
      }
      return createdList;
    });

    console.log("✅ Bulk Save Completed successfully! Count:", result.length);
    res.json({ success: true, count: result.length, questions: result });
  } catch (error) {
    console.error("❌ bulkSaveAdminQuestions failed:", error);
    res.status(500).json({ error: error.message || "Failed to bulk save questions" });
  }
});

/**
 * ADMIN: Publish Assignment Level (DRAFT -> PUBLISHED)
 */
const publishAdminAssignment = asyncHandler(async (req, res) => {
  const { levelId } = req.body;

  if (!levelId) throw new ApiError(400, 'levelId is required');

  console.log("🚀 Publishing level:", levelId);

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: levelId },
      include: { question: true }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment level not found' });
    }

    if (assignment.question.length === 0) {
      return res.status(400).json({ error: 'Cannot publish assignment level with no questions. Please save questions first.' });
    }

    const updated = await prisma.assignment.update({
      where: { id: levelId },
      data: { status: 'PUBLISHED' }
    });

    res.json({ success: true, status: updated.status });
  } catch (error) {
    console.error("❌ publishAdminAssignment failed:", error);
    res.status(500).json({ error: error.message || "Failed to publish assignment" });
  }
});

/**
 * PROCTORING: Log warning violation
 */
const logProctoringViolation = asyncHandler(async (req, res) => {
  const { examId, type, severity, metadata } = req.body;
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  // Log directly to MySQL via Prisma
  const violation = await prisma.proctoring_violation.create({
    data: {
      studentId: student.id,
      assignmentId: examId,
      type,
      severity,
      metadata: metadata ? JSON.stringify(metadata) : null
    }
  });

  // Keep fallback JSON write for backwards compatibility
  ensureViolationsFile();
  const violations = JSON.parse(fs.readFileSync(VIOLATIONS_FILE, 'utf-8'));
  const violationEntry = {
    id: violation.id,
    studentId: student.id,
    studentName: req.user.name,
    examId,
    type,
    severity,
    metadata,
    timestamp: violation.timestamp.toISOString()
  };
  violations.push(violationEntry);
  fs.writeFileSync(VIOLATIONS_FILE, JSON.stringify(violations, null, 2));

  const io = req.app.get('io');
  if (io) {
    io.emit('proctor:violation', violationEntry);
    console.log('📡 Realtime: proctor:violation emitted');
  }

  res.json({ success: true, violationEntry });
});

/**
 * PROCTORING: Start Secure Exam Session
 */
const startProctoringSession = asyncHandler(async (req, res) => {
  const { assignmentId, deviceFingerprint, sessionToken, screenShareActive, fullscreenActive } = req.body;
  if (!assignmentId || !sessionToken) throw new ApiError(400, 'assignmentId and sessionToken are required');

  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  const session = await prisma.proctoring_session.create({
    data: {
      studentId: student.id,
      assignmentId,
      sessionToken,
      deviceFingerprint: deviceFingerprint || 'Unknown',
      screenShareActive: screenShareActive ?? true,
      fullscreenActive: fullscreenActive ?? true
    }
  });

  res.status(201).json({ success: true, session });
});

/**
 * PROCTORING: End Secure Exam Session
 */
const endProctoringSession = asyncHandler(async (req, res) => {
  const { sessionToken } = req.body;
  if (!sessionToken) throw new ApiError(400, 'sessionToken is required');

  const session = await prisma.proctoring_session.findFirst({
    where: { sessionToken }
  });
  if (!session) throw new ApiError(404, 'Session not found');

  const updated = await prisma.proctoring_session.update({
    where: { id: session.id },
    data: { endedAt: new Date() }
  });

  res.json({ success: true, session: updated });
});

/**
 * ADMIN PROCTORING: Get violation logs
 */
const getProctoringLogs = asyncHandler(async (req, res) => {
  ensureViolationsFile();
  const violations = JSON.parse(fs.readFileSync(VIOLATIONS_FILE, 'utf-8'));
  violations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(violations);
});

module.exports = {
  getAssignmentStats,
  getAssignmentCourses,
  getAssignmentLevelDetails,
  getCourseAssignments,
  submitAssignment,
  getAdminCourseAssignments,
  createAdminLevel,
  deleteAdminLevel,
  createAdminQuestion,
  generateAdminAIQuestions,
  bulkUploadAdminQuestions,
  bulkSaveAdminQuestions,
  publishAdminAssignment,
  logProctoringViolation,
  getProctoringLogs,
  startProctoringSession,
  endProctoringSession
};
