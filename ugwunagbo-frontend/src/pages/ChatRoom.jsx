import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { FaPaperPlane, FaUser, FaSmile, FaTimes, FaReply, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Emoji picker component
const EmojiPicker = ({ onSelect }) => {
  const emojis = ['😊', '😂', '❤️', '👍', '🙏', '🔥', '💯', '🎉', '😍', '🤣', '😭', '🥺', '😡', '🤔', '👏', '💪', '✨', '🌟', '🍀', '🎊'];
  
  return (
    <div className="absolute bottom-14 left-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 z-50 w-64">
      <div className="grid grid-cols-5 gap-1">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelect(emoji)}
            className="text-2xl hover:bg-gray-100 rounded-lg p-1 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatRoom = () => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const lastMessageCountRef = useRef(0);

  // Load messages and users
  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
      loadUsers();
      
      // ✅ Poll less aggressively - every 3 seconds is fine
      const interval = setInterval(() => {
        loadMessages();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Load messages - optimized with useCallback
  const loadMessages = useCallback(async () => {
    try {
      const response = await api.getChatMessages();
      const newMessages = response.data || [];
      
      // Check if there are actually new messages
      if (newMessages.length !== lastMessageCountRef.current) {
        lastMessageCountRef.current = newMessages.length;
        setMessages(newMessages);
        
        // Only auto-scroll if user hasn't scrolled up
        if (!isUserScrollingRef.current) {
          setTimeout(() => {
            scrollToBottom();
          }, 50);
        } else {
          // Show indicator that new messages are available
          setHasNewMessages(true);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.getOnlineUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  // ✅ Handle user scroll - mark when user is scrolling up
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    // If user scrolls up, stop auto-scrolling
    isUserScrollingRef.current = !isNearBottom;
    
    // If user scrolls back to bottom, enable auto-scroll
    if (isNearBottom) {
      isUserScrollingRef.current = false;
      setHasNewMessages(false);
    }
  };

  // ✅ Send message - fast and optimistic
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    
    // Create optimistic message
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      content: newMessage.trim(),
      user_id: user?.id,
      user: { username: user?.username || 'You', full_name: user?.fullName || '' },
      created_at: new Date().toISOString(),
      replyTo: replyTo,
      isOptimistic: true
    };

    // Add optimistically
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setReplyTo(null);
    
    // ✅ Immediately scroll to bottom for new message
    setTimeout(() => {
      scrollToBottom();
    }, 50);

    try {
      const messageData = {
        content: optimisticMessage.content,
        replyTo: replyTo?._id || null
      };
      
      const response = await api.sendChatMessage(messageData);
      
      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg._id === optimisticMessage._id ? response.data : msg
        )
      );
      
      lastMessageCountRef.current += 1;
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await api.reactToMessage(messageId, { emoji });
      // Refresh messages to show updated reactions - but preserve scroll position
      await loadMessages();
    } catch (error) {
      console.error('Error reacting to message:', error);
      toast.error('Failed to add reaction');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.deleteChatMessage(messageId);
      setMessages(messages.filter(m => m._id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const getReactionEmojis = (reactions) => {
    if (!reactions || reactions.length === 0) return null;
    const grouped = reactions.reduce((acc, r) => {
      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([emoji, count], index) => (
      <span 
        key={`${emoji}-${index}`}
        className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-sm"
      >
        {emoji} {count}
      </span>
    ));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (message) => {
    return message.userId === user?.id || message.user?.id === user?.id || message.isOptimistic;
  };

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!loading && messages.length > 0) {
      scrollToBottom();
    }
  }, [loading]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#006400] to-[#008000] px-6 py-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaUser className="text-[#ffcc00]" />
          <div>
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-xs text-[#ffcc00]/80">{users.length} online</p>
          </div>
        </div>
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="text-white/80 hover:text-white bg-white/10 px-3 py-1 rounded-lg text-sm transition-colors"
        >
          {showUsers ? 'Hide Users' : 'Show Users'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Users Sidebar */}
        {showUsers && (
          <div className="w-48 border-r border-gray-200 bg-gray-50 overflow-y-auto p-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Online Users</h4>
            {users.map((u) => (
              <div key={u.id || u._id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 truncate">{u.username}</span>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-gray-400">No users online</p>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#006400] border-t-transparent"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <p>No messages yet</p>
                <p className="text-sm">Be the first to say hello! 👋</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id || message.id || `msg-${Date.now()}`}
                  className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'} ${message.isOptimistic ? 'opacity-70' : ''}`}
                >
                  <div className={`max-w-[70%] ${isOwnMessage(message) ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isOwnMessage(message) && (
                      <span className="text-xs font-medium text-gray-600 mb-1">
                        {message.user?.username || 'Anonymous'}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwnMessage(message)
                          ? 'bg-[#006400] text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.replyTo && (
                        <div className="text-xs opacity-70 mb-1 bg-white/10 rounded p-1.5">
                          <span className="font-medium">@{message.replyTo.user?.username}</span>
                          <span className="ml-1">{message.replyTo.content?.substring(0, 50)}...</span>
                        </div>
                      )}
                      <p className="text-sm break-words">{message.content}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] opacity-70">
                          {message.isOptimistic ? 'Sending...' : formatTime(message.created_at)}
                        </span>
                        {message.isOptimistic && (
                          <span className="text-[10px] text-yellow-300">⏳</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && !message.isOptimistic && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getReactionEmojis(message.reactions)}
                      </div>
                    )}

                    {/* Action Buttons - only for real messages */}
                    {!message.isOptimistic && (
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => setReplyTo(message)}
                          className="text-xs text-gray-400 hover:text-[#006400] transition-colors"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleReaction(message._id, '❤️')}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ❤️
                        </button>
                        <button
                          onClick={() => handleReaction(message._id, '👍')}
                          className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          👍
                        </button>
                        {isOwnMessage(message) && (
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* New Messages Indicator */}
          {hasNewMessages && (
            <button
              onClick={() => {
                isUserScrollingRef.current = false;
                setHasNewMessages(false);
                scrollToBottom();
              }}
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-[#006400] text-white px-4 py-2 rounded-full shadow-lg text-sm hover:bg-[#005a00] transition-colors z-10"
            >
              New messages ↓
            </button>
          )}

          {/* Reply Indicator */}
          {replyTo && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Replying to @{replyTo.user?.username}
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-400 hover:text-[#006400] transition-colors"
              >
                <FaSmile size={20} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={replyTo ? `Reply to ${replyTo.user?.username}...` : 'Type a message...'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="bg-[#006400] hover:bg-[#005a00] text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {isSending ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </div>
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={(emoji) => {
                  setNewMessage(prev => prev + emoji);
                  setShowEmojiPicker(false);
                  inputRef.current?.focus();
                }}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;