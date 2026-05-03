import { Response } from "express";
import Message from "../models/Message";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

// @desc    Get conversations (aggregated by user)
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    }).sort({ createdAt: -1 });

    const conversationMap = new Map();

    messages.forEach((msg) => {
      const otherUserId = msg.senderId.toString() === currentUserId.toString() 
        ? msg.receiverId.toString() 
        : msg.senderId.toString();

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }

      if (msg.receiverId.toString() === currentUserId.toString() && !msg.read) {
        const conv = conversationMap.get(otherUserId);
        conv.unreadCount += 1;
      }
    });

    const conversations = Array.from(conversationMap.values());

    const userIds = conversations.map((c) => c.userId);
    const users = await User.find({ _id: { $in: userIds } }).select("_id name avatar role");

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const result = conversations.map((conv) => {
      const user = userMap.get(conv.userId);
      return {
        userId: conv.userId,
        name: user?.name || "Unknown",
        avatar: user?.avatar,
        role: user?.role,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
        unreadCount: conv.unreadCount,
      };
    });

    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch conversations";
    res.status(500).json({ message });
  }
};

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    })
      .populate("senderId", "name avatar")
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: userId, receiverId: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch messages";
    res.status(500).json({ message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      res.status(400).json({ message: "Receiver ID and content are required" });
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({ message: "Receiver not found" });
      return;
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content,
    });

    const populatedMessage = await Message.findById(message._id).populate("senderId", "name avatar");

    res.status(201).json(populatedMessage);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send message";
    res.status(500).json({ message });
  }
};
