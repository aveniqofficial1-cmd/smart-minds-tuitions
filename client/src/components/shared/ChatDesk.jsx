import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { chatService } from '../../services/chatService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Send, User, ShieldCheck, Clock, MessageSquare } from 'lucide-react';

export const ChatDesk = ({ targetUserTitle = 'Administrator Support' }) => {
  const { user, role } = useAuth();
  const { socket, joinConversation, leaveConversation, startTyping, stopTyping } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await chatService.getConversations();
      if (res.success && res.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeConversation) {
          setActiveConversation(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    if (!convId) return;
    try {
      const res = await chatService.getMessages(convId);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
      joinConversation(activeConversation._id);

      if (socket) {
        const handleNewMessage = (msg) => {
          if (msg.conversation === activeConversation._id || msg.conversation?._id === activeConversation._id) {
            setMessages((prev) => {
              // Avoid duplicate if already in state
              if (prev.some((m) => m._id === msg._id)) return prev;
              return [...prev, msg];
            });
          }
        };

        const handleTypingStart = ({ conversationId, userId, userName }) => {
          if (conversationId === activeConversation._id && userId !== user._id) {
            setTypingUser(userName || 'Support Agent');
          }
        };

        const handleTypingStop = ({ conversationId }) => {
          if (conversationId === activeConversation._id) {
            setTypingUser(null);
          }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('user_typing', handleTypingStart);
        socket.on('user_stop_typing', handleTypingStop);

        return () => {
          leaveConversation(activeConversation._id);
          socket.off('new_message', handleNewMessage);
          socket.off('user_typing', handleTypingStart);
          socket.off('user_stop_typing', handleTypingStop);
        };
      }
    }
  }, [activeConversation?._id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sending) return;

    try {
      setSending(true);
      const res = await chatService.sendMessage(activeConversation._id, {
        content: newMessage.trim(),
      });

      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
        stopTyping(activeConversation._id);
      }
    } catch (err) {
      console.error('Send message failed:', err);
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (activeConversation) {
      startTyping(activeConversation._id);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(activeConversation._id);
      }, 2000);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] min-h-[550px] bg-white rounded-2xl shadow-card border border-sand-200 flex overflow-hidden">
      {/* Sidebar for Admin or multiple conversations */}
      {role === 'admin' && (
        <div className="w-80 border-r border-sand-200 bg-sand-50/50 flex flex-col">
          <div className="p-4 border-b border-sand-200 bg-white">
            <h3 className="font-serif font-bold text-navy-950 text-base">
              Active Conversations
            </h3>
            <p className="text-xs text-navy-500">Tutors, Parents & Centers</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-sand-100">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-navy-400">
                No active conversations yet
              </div>
            ) : (
              conversations.map((conv) => {
                const otherUser = conv.participants?.find((p) => p._id !== user._id) || {};
                const isSelected = activeConversation?._id === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-gold-50 border-r-4 border-gold-500' : 'hover:bg-sand-100/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-navy-900 text-gold-400 font-bold flex items-center justify-center uppercase text-sm shrink-0">
                      {otherUser.name ? otherUser.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-bold text-navy-950 truncate">
                          {otherUser.name || 'User'}
                        </span>
                        <Badge variant={otherUser.role || 'default'} size="sm">
                          {otherUser.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-navy-500 truncate mt-1">
                        {conv.lastMessage?.content || 'Started new inquiry'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-sand-200 bg-sand-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-100 border border-gold-400/40 text-navy-900 flex items-center justify-center font-bold">
              {role === 'admin' && activeConversation
                ? activeConversation.participants?.find((p) => p._id !== user._id)?.name?.charAt(0) || 'U'
                : 'A'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                {role === 'admin' && activeConversation
                  ? activeConversation.participants?.find((p) => p._id !== user._id)?.name || 'Direct Chat'
                  : targetUserTitle}
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Active Secure Channel
                </span>
              </h4>
              <p className="text-xs text-navy-500">
                End-to-End Managed & Logged Support Channel
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-navy-600 bg-white px-3 py-1.5 rounded-xl border border-sand-200">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>Admin Guarded</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-sand-50/20">
          {loading && messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-navy-400">
              Loading conversation stream...
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-navy-400 space-y-2">
              <MessageSquare className="w-12 h-12 text-gold-400/60 mb-2" />
              <p className="text-sm font-semibold text-navy-900">
                Welcome to Smart Minds Direct Support Desk
              </p>
              <p className="text-xs text-navy-500 max-w-sm">
                Have questions regarding tuition requirements, demo scheduling, or KYC? Ask our dedicated management team below.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender?._id === user._id || msg.sender === user._id;
              const senderName = isMe ? 'You' : msg.sender?.name || 'Administrator';
              const senderRole = isMe ? role : msg.sender?.role || 'Admin';

              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-navy-800">
                      {senderName}
                    </span>
                    <span className="text-[10px] text-navy-400 capitalize">
                      ({senderRole})
                    </span>
                    <span className="text-[10px] text-navy-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`
                      max-w-md sm:max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                      ${isMe
                        ? 'bg-navy-950 text-white rounded-tr-none'
                        : 'bg-white text-navy-950 border border-sand-200 rounded-tl-none'}
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}

          {typingUser && (
            <div className="flex items-center gap-2 text-xs text-gold-700 italic bg-gold-50 px-3 py-1.5 rounded-full w-fit animate-pulse">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              {typingUser} is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-sand-200 bg-white flex items-center gap-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message to Smart Minds Support..."
            className="flex-1 rounded-xl border border-sand-300 py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent text-navy-950 placeholder:text-sand-400"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={sending}
            disabled={!newMessage.trim()}
            icon={Send}
            iconPosition="right"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
