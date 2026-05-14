const { prisma } = require('../config/db');

const handleDashboardEvents = (io, socket) => {
  // Join student room
  socket.on('join_dashboard', (studentId) => {
    socket.join(`dashboard_${studentId}`);
    console.log(`Student ${studentId} joined dashboard room`);
  });

  // Handle XP gain (broadcast to leaderboard)
  socket.on('xp_gain', async (data) => {
    const { studentId, amount } = data;
    try {
      // Logic would normally be in a controller, but for real-time updates:
      const updatedLeaderboard = await prisma.student.findMany({
        orderBy: { xp: 'desc' },
        take: 20,
        include: { user: { select: { name: true, avatar: true } } }
      });
      
      io.emit('leaderboard_update', updatedLeaderboard.map((s, idx) => ({
        rank: idx + 1,
        studentId: s.id,
        name: s.user.name,
        avatar: s.user.avatar,
        xp: s.xp,
        level: s.level,
        streak: s.streak
      })));
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  });

  // Attendance update
  socket.on('attendance_check', (data) => {
    const { studentId, status } = data;
    io.to(`dashboard_${studentId}`).emit('attendance_update', { status, date: new Date() });
  });
};

module.exports = { handleDashboardEvents };
