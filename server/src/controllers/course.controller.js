const asyncHandler = require('express-async-handler');
const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
const getAllCourses = asyncHandler(async (req, res) => {
  const { status, category, difficulty, search, page = 1, limit = 10 } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {};
  if (status && status !== 'ALL') where.status = status;
  if (category) where.category = category;
  if (difficulty) where.difficulty = difficulty;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { fullDesc: { contains: search } },
      { instructorName: { contains: search } }
    ];
  }
  
  try {
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          shortDesc: true,
          thumbnail: true,
          price: true,
          duration: true,
          difficulty: true,
          category: true,
          instructorName: true,
          status: true,
          createdAt: true,
          institution: {
            select: {
              user_institution_userIdTouser: { select: { name: true, avatar: true } }
            }
          },
          _count: { 
            select: { 
              module: true,
              enrollment: true
            } 
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.course.count({ where })
    ]);

    res.json({
      courses,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / take)
    });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    throw new ApiError(500, 'Failed to fetch courses');
  }
});

/**
 * @desc    Get single course with modules and lessons
 * @route   GET /api/courses/:id
 * @access  Public/Private
 */
const getCourseById = asyncHandler(async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: {
      module: {
        orderBy: { order: 'asc' },
        include: {
          lesson: {
            orderBy: { order: 'asc' }
          }
        }
      },
      institution: {
        include: {
          user_institution_userIdTouser: {
            select: { name: true, avatar: true }
          }
        }
      },
      _count: {
        select: {
          enrollment: true,
          module: true
        }
      }
    }
  });

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  res.json(course);
});

/**
 * @desc    Get single course by slug
 * @route   GET /api/courses/slug/:slug
 * @access  Public
 */
const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { slug: req.params.slug },
    include: {
      module: {
        orderBy: { order: 'asc' },
        include: {
          lesson: {
            orderBy: { order: 'asc' }
          }
        }
      },
      institution: {
        include: {
          user_institution_userIdTouser: {
            select: { name: true, avatar: true }
          }
        }
      },
      _count: {
        select: {
          enrollment: true,
          module: true
        }
      }
    }
  });

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  res.json(course);
});

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Admin/Institution
 */
const createCourse = asyncHandler(async (req, res) => {
  console.log('🚀 Creating course with payload:', JSON.stringify(req.body, null, 2));
  const { 
    title, 
    description, 
    category, 
    instructor, 
    duration, 
    price, 
    difficulty, 
    tags,
    thumbnail,
    banner,
    introVideo,
    previewVideo,
    status,
    modules 
  } = req.body;

  try {
    let institutionId = null;
    
    if (req.user.role === 'INSTITUTION') {
      const institution = await prisma.institution.findUnique({ 
        where: { userId: req.user.id } 
      });
      if (!institution) throw new ApiError(403, 'Institution profile not found');
      institutionId = institution.id;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substr(2, 5);

    const course = await prisma.course.create({
      data: {
        id: require('uuid').v4(),
        title,
        slug,
        shortDesc: description,
        fullDesc: description,
        category,
        instructorName: instructor || req.user.name,
        duration,
        difficulty,
        tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
        price: parseFloat(price) || 0,
        thumbnail,
        banner,
        introVideo,
        previewVideo,
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        institutionId,
        module: {
          create: (modules || []).map((m, mIdx) => ({
            id: require('uuid').v4(),
            title: m.title,
            description: m.description,
            order: mIdx,
            lesson: {
              create: (m.lessons || []).map((l, lIdx) => ({
                id: require('uuid').v4(),
                title: l.title,
                content: l.description,
                videoUrl: l.videoUrl,
                pdfUrl: l.pdfUrl || l.resources,
                duration: l.duration,
                order: lIdx,
                type: 'VIDEO'
              }))
            }
          }))
        }
      },
      include: {
        _count: {
          select: { module: true, enrollment: true }
        },
        institution: {
          select: {
            user_institution_userIdTouser: { select: { name: true, avatar: true } }
          }
        }
      }
    });

    console.log('✅ Course created successfully:', course.id);

    if (course.status === 'PUBLISHED') {
      const io = req.app.get('io');
      if (io) {
        io.emit('course:published', course);
        console.log('📡 Realtime: course:published emitted');
      }
    }

    res.status(201).json(course);
  } catch (error) {
    console.error('❌ Error creating course:', error);
    if (error.code === 'P2002') {
      throw new ApiError(400, 'A course with a similar title already exists (Slug conflict)');
    }
    throw new ApiError(500, error.message || 'Failed to create course');
  }
});

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Admin/Institution
 */
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`🚀 Updating course ${id} with payload:`, JSON.stringify(req.body, null, 2));
  const { description, instructor, tags, modules, ...rest } = req.body;

  try {
    const data = {
      ...rest,
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : undefined,
      updatedAt: new Date()
    };

    if (description) {
      data.shortDesc = description;
      data.fullDesc = description;
    }
    if (instructor) {
      data.instructorName = instructor;
    }
    if (data.status === 'PUBLISHED') {
      data.publishedAt = new Date();
    }

    // Handle nested modules if provided
    if (modules && modules.length > 0) {
      await prisma.module.deleteMany({ where: { courseId: id } });
      data.module = {
        create: modules.map((m, mIdx) => ({
          id: require('uuid').v4(),
          title: m.title,
          description: m.description,
          order: mIdx,
          lesson: {
            create: (m.lessons || []).map((l, lIdx) => ({
              id: require('uuid').v4(),
              title: l.title,
              content: l.description,
              videoUrl: l.videoUrl,
              pdfUrl: l.pdfUrl || l.resources,
              duration: l.duration,
              order: lIdx,
              type: 'VIDEO'
            }))
          }
        }))
      };
    }

    const course = await prisma.course.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { module: true, enrollment: true }
        },
        institution: {
          select: {
            user_institution_userIdTouser: { select: { name: true, avatar: true } }
          }
        }
      }
    });

    console.log('✅ Course updated successfully:', course.id);

    const io = req.app.get('io');
    if (io) {
      io.emit('course:updated', course);
      console.log('📡 Realtime: course:updated emitted');
    }

    res.json(course);
  } catch (error) {
    console.error('❌ Error updating course:', error);
    throw new ApiError(500, error.message || 'Failed to update course');
  }
});

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Admin/Institution
 */
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({ where: { id } });
    console.log('✅ Course deleted successfully:', id);

    const io = req.app.get('io');
    if (io) {
      io.emit('course:deleted', id);
      console.log('📡 Realtime: course:deleted emitted');
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting course:', error);
    throw new ApiError(500, 'Failed to delete course');
  }
});

/**
 * @desc    Enroll in course
 * @route   POST /api/courses/:id/enroll
 * @access  Student
 */
const enrollInCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  try {
    const student = await prisma.student.findUnique({ 
      where: { userId: req.user.id } 
    });

    if (!student) throw new ApiError(403, 'Student profile not found');

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { studentId: student.id, courseId }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        id: require('uuid').v4(),
        studentId: student.id,
        courseId
      }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('❌ Error enrolling in course:', error);
    throw new ApiError(500, error.message || 'Failed to enroll');
  }
});

/**
 * @desc    Add module to course
 * @route   POST /api/courses/:id/modules
 * @access  Admin/Institution
 */
const addModule = asyncHandler(async (req, res) => {
  const { title, order } = req.body;
  try {
    const module = await prisma.module.create({
      data: {
        id: require('uuid').v4(),
        title,
        order: order || 0,
        courseId: req.params.id
      }
    });
    res.status(201).json(module);
  } catch (error) {
    throw new ApiError(500, 'Failed to add module');
  }
});

/**
 * @desc    Add lesson to module
 * @route   POST /api/courses/modules/:moduleId/lessons
 * @access  Admin/Institution
 */
const addLesson = asyncHandler(async (req, res) => {
  const { title, videoUrl, duration, order } = req.body;
  try {
    const lesson = await prisma.lesson.create({
      data: {
        id: require('uuid').v4(),
        title,
        videoUrl,
        duration,
        order: order || 0,
        moduleId: req.params.moduleId
      }
    });
    res.status(201).json(lesson);
  } catch (error) {
    throw new ApiError(500, 'Failed to add lesson');
  }
});

/**
 * @desc    Get course modules and lessons
 * @route   GET /api/courses/:id/modules
 * @access  Private/Student
 */
const getCourseModules = asyncHandler(async (req, res) => {
  const modules = await prisma.module.findMany({
    where: { courseId: req.params.id },
    include: {
      lesson: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  });
  res.json(modules);
});

/**
 * @desc    Mark lesson as completed
 * @route   POST /api/courses/lessons/:lessonId/complete
 * @access  Private/Student
 */
const updateLessonProgress = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  // Find lesson to get moduleId and courseId
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: true }
  });
  if (!lesson) throw new ApiError(404, 'Lesson not found');

  const courseId = lesson.module.courseId;

  // Update or create lesson progress
  await prisma.lessonprogress.upsert({
    where: {
      studentId_lessonId: {
        studentId: student.id,
        lessonId: lessonId
      }
    },
    update: { isCompleted: true, isWatched: true },
    create: {
      id: require('uuid').v4(),
      studentId: student.id,
      lessonId: lessonId,
      isCompleted: true,
      isWatched: true,
      updatedAt: new Date()
    }
  });

  // Calculate overall course progress
  const allLessons = await prisma.lesson.findMany({
    where: { module: { courseId } },
    select: { id: true }
  });

  const completedLessons = await prisma.lessonprogress.count({
    where: {
      studentId: student.id,
      isCompleted: true,
      lesson: { module: { courseId } }
    }
  });

  const percentage = Math.round((completedLessons / allLessons.length) * 100);

  // Update course progress
  await prisma.courseprogress.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: courseId
      }
    },
    update: { 
      percentage, 
      isCompleted: percentage === 100,
      completedAt: percentage === 100 ? new Date() : null,
      lastAccessedAt: new Date()
    },
    create: {
      id: require('uuid').v4(),
      studentId: student.id,
      courseId: courseId,
      percentage,
      isCompleted: percentage === 100,
      completedAt: percentage === 100 ? new Date() : null,
      lastAccessedAt: new Date()
    }
  });

  res.json({ message: 'Progress updated', percentage });
});

/**
 * @desc    Get course progress for student
 * @route   GET /api/courses/:id/progress
 * @access  Private/Student
 */
const getCourseProgress = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  const progress = await prisma.courseprogress.findUnique({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: req.params.id
      }
    }
  });

  const lessonProgress = await prisma.lessonprogress.findMany({
    where: {
      studentId: student.id,
      lesson: { module: { courseId: req.params.id } }
    },
    select: { lessonId: true, isCompleted: true }
  });

  res.json({
    courseProgress: progress,
    lessonProgress: lessonProgress.reduce((acc, curr) => {
      acc[curr.lessonId] = curr.isCompleted;
      return acc;
    }, {})
  });
});

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseProgress,
  updateLessonProgress,
  getCourseModules,
  addModule,
  addLesson
};
