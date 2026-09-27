const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get or Create Conversation with Admin (for Tutor or Parent) OR List Conversations (for Admin)
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role === 'admin') {
      // Admin sees all conversations with users
      const conversations = await Conversation.find()
        .populate('participants', 'name email role avatar status phone')
        .sort({ lastMessageAt: -1 });

      return res.json({ success: true, data: conversations });
    }

    // Tutor or Parent: Find or create conversation with Admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ success: false, message: 'Platform Administrator not available' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [user._id, adminUser._id] },
    }).populate('participants', 'name email role avatar status');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [user._id, adminUser._id],
        participantDetails: [
          { user: user._id, role: user.role, name: user.name },
          { user: adminUser._id, role: 'admin', name: adminUser.name },
        ],
        lastMessageText: 'Conversation started',
        lastMessageAt: new Date(),
      });
      conversation = await Conversation.findById(conversation._id).populate('participants', 'name email role avatar status');
    }

    res.json({ success: true, data: [conversation] });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Messages for a Conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Verify user is a participant or admin
    const isParticipant = conversation.participants.some((p) => p.toString() === req.user._id.toString());
    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied to this conversation' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name role avatar')
      .sort({ createdAt: 1 });

    // Mark unread messages as read for this user
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Message in Conversation
// @route   POST /api/chat/conversations/:id/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const { text, attachments } = req.body;

    if (!text && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some((p) => p.toString() === req.user._id.toString());
    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      senderRole: req.user.role,
      text,
      attachments: attachments || [],
    });

    // Update conversation metadata
    conversation.lastMessage = message._id;
    conversation.lastMessageText = text;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name role avatar');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
};
