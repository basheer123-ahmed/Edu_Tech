const { prisma } = require('../config/db');
const { getOrSetCache } = require('../utils/cache');

const queryCourses = async (filter, options) => {
  const cacheKey = `courses:${JSON.stringify(filter)}:${JSON.stringify(options)}`;
  
  return getOrSetCache(cacheKey, async () => {
    return prisma.course.findMany({
      where: filter,
      include: {
        institution: {
          select: {
            user: {
              select: { name: true, avatar: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }, 300); // Cache for 5 minutes
};

const getCourseById = async (id) => {
  return getOrSetCache(`course:${id}`, async () => {
    return prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: { lessons: true }
        },
        institution: true
      }
    });
  });
};

module.exports = {
  queryCourses,
  getCourseById,
};
