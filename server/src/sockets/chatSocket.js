const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');

const initSocket = (io) => {
  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'smart_minds_tuitions_super_secure_jwt_secret_key_2026_educate'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`[Socket.IO] User connected: ${socket.user.name} (${socket.user.role}) - ID: ${userId}`);

    // Join user's personal room for direct notifications
    socket.join(`user:${userId}`);

    // Admin joins the admin broadcast room
    if (socket.user.role === 'admin') {
      socket.join('admin-room');
    }

    // Join specific conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv:${conversationId}`);
      console.log(`[Socket.IO] User ${socket.user.name} joined conv:${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conv:${conversationId}`);
    });

    // Handle incoming chat message
    socket.on('send_message', async (data, callback) => {
      try {
        const { conversationId, text, attachments } = data;
        if (!conversationId || !text) {
          if (callback) callback({ success: false, message: 'Invalid message payload' });
          return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          if (callback) callback({ success: false, message: 'Conversation not found' });
          return;
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: socket.user._id,
          senderRole: socket.user.role,
          text,
          attachments: attachments || [],
        });

        conversation.lastMessage = message._id;
        conversation.lastMessageText = text;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populatedMsg = await Message.findById(message._id).populate('sender', 'name role avatar');

        // Broadcast to everyone in conversation room
        io.to(`conv:${conversationId}`).emit('new_message', {
          conversationId,
          message: populatedMsg,
        });

        // Also notify offline/other participants via their personal rooms
        conversation.participants.forEach((pId) => {
          if (pId.toString() !== userId) {
            io.to(`user:${pId.toString()}`).emit('notification', {
              title: `New message from ${socket.user.name}`,
              message: text.substring(0, 80),
              type: 'CHAT_MESSAGE',
              conversationId,
            });
          }
        });

        if (callback) callback({ success: true, data: populatedMsg });
      } catch (err) {
        console.error('[Socket.IO send_message error]:', err.message);
        if (callback) callback({ success: false, message: err.message });
      }
    });

    // Typing indicator
    socket.on('typing_start', ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit('user_typing', {
        userId,
        userName: socket.user.name,
        conversationId,
      });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit('user_stopped_typing', {
        userId,
        conversationId,
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] User disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = { initSocket };
