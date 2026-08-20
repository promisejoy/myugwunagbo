import React, { memo } from 'react';
import { FaReply, FaTrash } from 'react-icons/fa';

const ChatMessage = memo(({ message, onReply, onReact, onDelete, isOwn }) => {
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const messageId = message?._id || message?.id;
  const isImage = message?.file_type?.startsWith('image/');
  const isVideo = message?.file_type?.startsWith('video/');

  // Group reactions
  const groupedReactions = React.useMemo(() => {
    if (!message?.reactions || message.reactions.length === 0) return null;
    const grouped = message.reactions.reduce((acc, r) => {
      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped);
  }, [message?.reactions]);

  const quickReactions = ['❤️', '😂', '😮', '😢', '😡', '👍'];

  const handleReact = (emoji) => {
    if (messageId) {
      onReact(messageId, emoji);
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs font-medium text-gray-600 mb-1">
            {message?.user?.username || 'Anonymous'}
          </span>
        )}
        <div className="relative">
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn ? 'bg-[#006400] text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {message?.replyTo && (
              <div className="text-xs opacity-70 mb-1 bg-white/10 rounded p-1.5">
                <span className="font-medium">@{message.replyTo.user?.username}</span>
                <span className="ml-1">{message.replyTo.content?.substring(0, 50)}...</span>
              </div>
            )}
            
            {message?.file_url && isImage && (
              <img 
                src={message.file_url} 
                alt={message.file_name || 'Image'} 
                className="max-w-full max-h-48 rounded-lg mb-2"
                loading="lazy"
              />
            )}
            {message?.file_url && isVideo && (
              <video 
                src={message.file_url} 
                controls 
                className="max-w-full max-h-48 rounded-lg mb-2"
              />
            )}
            {message?.file_url && !isImage && !isVideo && (
              <a 
                href={message.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm underline mb-2"
              >
                <FaReply className="inline" /> {message.file_name || 'Attachment'}
              </a>
            )}
            
            <p className="text-sm break-words">{message?.content}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] opacity-70">{formatTime(message?.created_at)}</span>
            </div>
          </div>

          {/* Reactions Display */}
          {groupedReactions && groupedReactions.length > 0 && (
            <div className="flex flex-wrap gap-0.5 mt-1">
              {groupedReactions.map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="inline-flex items-center gap-0.5 bg-gray-200 hover:bg-gray-300 rounded-full px-1.5 py-0.5 text-xs transition-colors"
                >
                  {emoji} {count > 1 && <span className="text-[10px]">{count}</span>}
                </button>
              ))}
            </div>
          )}

          {/* Quick Reaction Buttons - on hover */}
          {!message?.isOptimistic && messageId && (
            <div className="absolute -bottom-2 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white rounded-full shadow-lg border border-gray-200 px-1.5 py-1 flex gap-0.5">
                {quickReactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    className="hover:scale-125 transition-transform text-lg hover:bg-gray-100 rounded-full p-0.5"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!message?.isOptimistic && messageId && (
          <div className="flex items-center gap-1 mt-1">
            <button
              onClick={() => onReply(message)}
              className="text-xs text-gray-400 hover:text-[#006400] transition-colors"
            >
              <FaReply className="inline mr-0.5" size={10} /> Reply
            </button>
            <button
              onClick={() => handleReact('❤️')}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              ❤️
            </button>
            {isOwn && (
              <button
                onClick={() => onDelete(messageId)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTrash size={10} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;