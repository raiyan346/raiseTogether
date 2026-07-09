import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';

export const setupSockets = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select('name avatar');
      if (!socket.user) return next(new Error('User not found'));
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(socket.user._id.toString());

    socket.on('join_team', (teamId) => {
      socket.join(`team_${teamId}`);
    });

    socket.on('send_message', async ({ recipientId, teamId, content }) => {
      const message = await Message.create({
        sender: socket.user._id,
        recipient: recipientId,
        team: teamId,
        content,
      });
      const populated = await Message.findById(message._id).populate('sender', 'name avatar');
      if (teamId) {
        io.to(`team_${teamId}`).emit('new_message', populated);
      } else if (recipientId) {
        io.to(recipientId).emit('new_message', populated);
        socket.emit('new_message', populated);
      }
    });

    socket.on('typing', ({ recipientId, teamId }) => {
      const room = teamId ? `team_${teamId}` : recipientId;
      socket.to(room).emit('user_typing', { userId: socket.user._id, name: socket.user.name });
    });

    socket.on('disconnect', () => {});
  });
};
