const { prisma } = require('../config/db');

/**
 * AI Skill Score Logic
 * skill_score = (
 *   assessment_score * 0.30 +
 *   project_score * 0.40 +
 *   internship_score * 0.20 +
 *   consistency_score * 0.10
 * )
 */
const calculateSkillScore = async (studentId) => {
  try {
    const analytics = await prisma.studentAnalytics.findUnique({
      where: { studentId }
    });

    if (!analytics) return 0;

    const score = (
      analytics.assessmentScore * 0.30 +
      analytics.projectScore * 0.40 +
      analytics.internshipScore * 0.20 +
      analytics.consistencyScore * 0.10
    );

    await prisma.student.update({
      where: { id: studentId },
      data: { skillScore: score }
    });

    return score;
  } catch (error) {
    console.error('Error calculating skill score:', error);
    return 0;
  }
};

module.exports = { calculateSkillScore };
