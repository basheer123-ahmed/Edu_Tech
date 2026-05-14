const { prisma } = require('../config/db');

const handleNotifications = (io, socket) => {
  socket.on('join_user_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on('send_notification', async (data) => {
    const { userId, message, type } = data;
    try {
      const notification = await prisma.notification.create({
        data: { userId, message, type: type || 'INFO' }
      });
      io.to(userId).emit('new_notification', notification);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });
};

module.exports = { handleNotifications };
