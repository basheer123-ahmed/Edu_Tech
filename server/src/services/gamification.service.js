const { prisma } = require('../config/db');

const XP_REWARDS = {
  LESSON_COMPLETE: 10,
  ASSIGNMENT_COMPLETE: 20,
  EXAM_PASS: 50,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 100,
};

const LEVELS = [
  { name: 'Beginner', minXp: 0 },
  { name: 'Intermediate', minXp: 500 },
  { name: 'Advanced', minXp: 2000 },
  { name: 'Expert', minXp: 5000 },
  { name: 'Master', minXp: 10000 },
];

class GamificationService {
  /**
   * Award XP to a student
   */
  static async awardXp(userId, amount, reason) {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) return null;

    const newXp = student.xp + amount;
    const currentLevel = LEVELS.findLast(l => newXp >= l.minXp);
    const levelIndex = LEVELS.indexOf(currentLevel) + 1;

    const updatedStudent = await prisma.student.update({
      where: { userId },
      data: {
        xp: newXp,
        level: levelIndex,
        lastActive: new Date(),
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        message: `You earned +${amount} XP for ${reason}!`,
        type: 'SUCCESS',
      },
    });

    return updatedStudent;
  }

  /**
   * Handle daily streak
   */
  static async updateStreak(userId) {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) return null;

    const now = new Date();
    const lastActive = new Date(student.lastActive);
    const diffInHours = (now - lastActive) / (1000 * 60 * 60);

    let newStreak = student.streak;

    if (diffInHours < 24) {
      // Already active today or within same day window
      return student;
    } else if (diffInHours < 48) {
      // Consecutive day!
      newStreak += 1;
      await this.awardXp(userId, XP_REWARDS.DAILY_LOGIN, 'Daily Login Streak');
      
      if (newStreak % 7 === 0) {
        await this.awardXp(userId, XP_REWARDS.STREAK_BONUS, '7-Day Streak Bonus');
        await this.awardBadge(userId, '7-Day Streak');
      }
    } else {
      // Streak broken
      newStreak = 1;
    }

    return await prisma.student.update({
      where: { userId },
      data: { streak: newStreak, lastActive: now },
    });
  }

  /**
   * Award Badge
   */
  static async awardBadge(userId, badgeName) {
    const student = await prisma.student.findUnique({ where: { userId } });
    const badge = await prisma.badge.findUnique({ where: { name: badgeName } });

    if (!student || !badge) return null;

    const existingAchievement = await prisma.userAchievement.findUnique({
      where: {
        studentId_badgeId: {
          studentId: student.id,
          badgeId: badge.id,
        },
      },
    });

    if (!existingAchievement) {
      await prisma.userAchievement.create({
        data: {
          studentId: student.id,
          badgeId: badge.id,
        },
      });

      await this.awardXp(userId, badge.xpReward, `Unlocking Badge: ${badgeName}`);
      
      await prisma.notification.create({
        data: {
          userId,
          message: `Achievement Unlocked: ${badgeName}!`,
          type: 'SUCCESS',
        },
      });
    }
  }
}

module.exports = { GamificationService, XP_REWARDS };
