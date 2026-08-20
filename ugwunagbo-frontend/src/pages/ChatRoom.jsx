import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { 
  FaPaperPlane, FaUser, FaSmile, FaTimes, FaReply, FaTrash, 
  FaImage, FaVideo, FaFile, FaTimesCircle, FaSpinner, FaUsers,
  FaComments, FaCheckCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// ---------- Emoji Picker ----------
const EmojiPicker = memo(({ onSelect }) => {
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
});

// ---------- File Preview Component ----------
const FilePreview = memo(({ file, onRemove }) => {
  if (!file) return null;
  
  const isImage = file.type?.startsWith('image/');
  const isVideo = file.type?.startsWith('video/');
  const fileSize = (file.size / 1024 / 1024).toFixed(2);
  
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
      {isImage && (
        <img 
          src={URL.createObjectURL(file)} 
          alt="Preview" 
          className="w-12 h-12 rounded object-cover"
        />
      )}
      {isVideo && (
        <video 
          src={URL.createObjectURL(file)} 
          className="w-12 h-12 rounded object-cover"
        />
      )}
      {!isImage && !isVideo && (
        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
          <FaFile className="text-2xl text-gray-500" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-700 truncate max-w-[150px]">{file.name}</p>
        <p className="text-xs text-gray-400">{fileSize} MB</p>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <FaTimes />
      </button>
    </div>
  );
});

// ---------- Chat Message Component ----------
const ChatMessage = memo(({ message, onReply, onReact, onDelete, isOwn }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isImage = message.file_type?.startsWith('image/');
  const isVideo = message.file_type?.startsWith('video/');

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs font-medium text-gray-600 mb-1">
            {message.user?.username || 'Anonymous'}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn ? 'bg-[#006400] text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {message.replyTo && (
            <div className="text-xs opacity-70 mb-1 bg-white/10 rounded p-1.5">
              <span className="font-medium">@{message.replyTo.user?.username}</span>
              <span className="ml-1">{message.replyTo.content?.substring(0, 50)}...</span>
            </div>
          )}
          
          {/* File/Media Display */}
          {message.file_url && isImage && (
            <img 
              src={message.file_url} 
              alt={message.file_name || 'Image'} 
              className="max-w-full max-h-48 rounded-lg mb-2"
              loading="lazy"
            />
          )}
          {message.file_url && isVideo && (
            <video 
              src={message.file_url} 
              controls 
              className="max-w-full max-h-48 rounded-lg mb-2"
            />
          )}
          {message.file_url && !isImage && !isVideo && (
            <a 
              href={message.file_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm underline mb-2"
            >
              <FaFile /> {message.file_name || 'Attachment'}
            </a>
          )}
          
          <p className="text-sm break-words">{message.content}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] opacity-70">{formatTime(message.created_at)}</span>
          </div>
          
          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(
                message.reactions.reduce((acc, r) => {
                  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                  return acc;
                }, {})
              ).map(([emoji, count]) => (
                <span key={emoji} className="inline-flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">
                  {emoji} {count}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-1">
          <button
            onClick={() => onReply(message)}
            className="text-xs text-gray-400 hover:text-[#006400] transition-colors"
          >
            <FaReply className="inline mr-0.5" size={10} /> Reply
          </button>
          <button
            onClick={() => onReact(message._id, '❤️')}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            ❤️
          </button>
          <button
            onClick={() => onReact(message._id, '👍')}
            className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
          >
            👍
          </button>
          {isOwn && (
            <button
              onClick={() => onDelete(message._id)}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaTrash size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

// ---------- Main ChatRoom Component ----------
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load messages
  const loadMessages = useCallback(async () => {
    try {
      const response = await api.getChatMessages();
      const newMessages = response.data || [];
      setMessages(newMessages);
      setTimeout(() => scrollToBottom(), 50);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const response = await api.getOnlineUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
      loadUsers();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, loadMessages, loadUsers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum 10MB allowed.');
      return;
    }
    
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || isSending) return;

    setIsSending(true);
    setUploading(!!selectedFile);

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      content: newMessage.trim() || '📎 Attachment',
      user_id: user?.id,
      user: { username: user?.username || 'You' },
      created_at: new Date().toISOString(),
      replyTo: replyTo,
      isOptimistic: true,
      file_url: selectedFile ? URL.createObjectURL(selectedFile) : null,
      file_type: selectedFile?.type || null,
      file_name: selectedFile?.name || null
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setReplyTo(null);
    setTimeout(() => scrollToBottom(), 50);

    try {
      const formData = new FormData();
      formData.append('content', optimisticMessage.content);
      if (replyTo?._id) formData.append('replyTo', replyTo._id);
      if (selectedFile) formData.append('file', selectedFile);

      const response = await api.sendChatMessageWithFile(formData);
      
      setMessages(prev => 
        prev.map(msg => msg._id === tempId ? response.data : msg)
      );
      
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
      setUploading(false);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await api.reactToMessage(messageId, { emoji });
      await loadMessages();
    } catch (error) {
      console.error('Error reacting:', error);
      toast.error('Failed to add reaction');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.deleteChatMessage(messageId);
      setMessages(prev => prev.filter(m => (m._id || m.id) !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete message');
    }
  };

  const isOwnMessage = (message) => {
    return message.userId === user?.id || message.user?.id === user?.id || message.isOptimistic;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006400] to-[#008000] px-6 py-4 text-white flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <FaComments className="text-[#ffcc00]" />
          <div>
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-xs text-[#ffcc00]/80 flex items-center gap-1">
              <FaUsers /> {users.length} online
            </p>
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
          <div className="w-48 border-r border-gray-200 bg-gray-50 overflow-y-auto p-3 flex-shrink-0">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaUsers className="text-green-500" /> Online Users
            </h4>
            {users.map((u) => (
              <div key={u.id || u._id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 truncate">{u.username}</span>
              </div>
            ))}
            {users.length === 0 && <p className="text-sm text-gray-400">No users online</p>}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <FaSpinner className="animate-spin text-4xl text-[#006400]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <p className="text-2xl">💬</p>
                <p className="font-medium">No messages yet</p>
                <p className="text-sm">Be the first to say hello! 👋</p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message._id || message.id}
                  message={message}
                  onReply={setReplyTo}
                  onReact={handleReaction}
                  onDelete={handleDeleteMessage}
                  isOwn={isOwnMessage(message)}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Indicator */}
          {replyTo && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 flex items-center justify-between flex-shrink-0">
              <span className="text-sm text-blue-700">
                <FaReply className="inline mr-1" /> Replying to @{replyTo.user?.username}
              </span>
              <button onClick={() => setReplyTo(null)} className="text-blue-500 hover:text-blue-700">
                <FaTimes />
              </button>
            </div>
          )}

          {/* File Preview */}
          {selectedFile && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex-shrink-0">
              <FilePreview file={selectedFile} onRemove={removeFile} />
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-[#006400] transition-colors"
                disabled={isSending}
              >
                <FaImage size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-400 hover:text-[#006400] transition-colors"
                disabled={isSending}
              >
                <FaSmile size={20} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={replyTo ? `Reply to ${replyTo.user?.username}...` : 'Type a message...'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none min-w-0"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={(!newMessage.trim() && !selectedFile) || isSending}
                className="bg-[#006400] hover:bg-[#005a00] text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50 flex-shrink-0 flex items-center gap-1"
              >
                {isSending ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaPaperPlane /> <span className="hidden sm:inline">Send</span>
                  </>
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