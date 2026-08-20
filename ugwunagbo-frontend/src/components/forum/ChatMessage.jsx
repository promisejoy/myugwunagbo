import React, { memo } from 'react';
import { FaReply, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

// ✅ Using memo to prevent unnecessary re-renders
const ChatMessage = memo(({ message, onReply, onReact, onDelete, isOwn }) => {
  const { user } = useAuth();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ✅ Memoize reactions to prevent recalculating on every render
  const reactionElements = React.useMemo(() => {
    if (!message.reactions || message.reactions.length === 0) return null;
    
    const grouped = message.reactions.reduce((acc, r) => {
      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([emoji, count]) => (
      <span key={`${emoji}-${count}`} className="inline-flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">
        {emoji} {count}
      </span>
    ));
  }, [message.reactions]);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs font-medium text-gray-600 mb-1">
            {message.user?.username || 'Anonymous'}
          </span>
        )}
        <div
          className={`relative rounded-2xl px-4 py-2 ${
            isOwn ? 'bg-[#006400] text-white' : 'bg-gray-100 text-gray-800'
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
            <span className="text-[10px] opacity-70">{formatTime(message.created_at)}</span>
          </div>
          
          {/* Reactions */}
          {reactionElements && (
            <div className="flex flex-wrap gap-1 mt-1">
              {reactionElements}
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

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;