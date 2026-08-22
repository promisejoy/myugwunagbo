import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  FaPaperPlane,
  FaSmile,
  FaTimes,
  FaReply,
  FaTrash,
  FaImage,
  FaFile,
  FaSpinner,
  FaUsers,
  FaComments,
  FaCheck,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://ugwunagbo-backend.onrender.com';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍'];
const EMOJIS = ['😊','😂','❤️','👍','🙏','🔥','💯','🎉','😍','🤣','😭','🥺','😡','🤔','👏','💪','✨','🌟','🍀','🎊'];

const idOf = (value) => value?.id || value?._id || null;
const messageIdOf = (message) => message?._id || message?.id || null;

const messageUserIdOf = (message) =>
  message?.user_id ||
  message?.userId ||
  message?.user?.id ||
  message?.user?._id ||
  null;

const fileUrl = (url) => {
  if (!url) return null;
  if (/^(https?:|blob:)/i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const timeOf = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const EmojiPicker = memo(({ onSelect, onClose }) => (
  <div className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-xs font-semibold text-gray-500">Choose an emoji</span>
      <button onClick={onClose} type="button" className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
        <FaTimes size={12} />
      </button>
    </div>
    <div className="grid grid-cols-7 gap-1">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className="rounded-lg p-1.5 text-lg transition hover:scale-110 hover:bg-gray-100"
        >
          {emoji}
        </button>
      ))}
    </div>
  </div>
));

const FilePreview = memo(({ file, onRemove }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!file) return undefined;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file) return null;

  const image = file.type?.startsWith('image/');
  const video = file.type?.startsWith('video/');

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
      {image && url ? (
        <img src={url} alt="" className="h-11 w-11 rounded-lg object-cover" />
      ) : video && url ? (
        <video src={url} muted className="h-11 w-11 rounded-lg object-cover" />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-200">
          <FaFile className="text-gray-500" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-gray-700">{file.name}</p>
        <p className="text-[10px] text-gray-400">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1.5 text-red-500 hover:bg-red-50"
      >
        <FaTimes size={12} />
      </button>
    </div>
  );
});

const ReactionBar = memo(({ messageId, reactions = [], onReact }) => {
  const grouped = useMemo(() => {
    const map = {};
    if (!Array.isArray(reactions)) return [];
    reactions.forEach((reaction) => {
      if (!reaction?.emoji) return;
      map[reaction.emoji] = (map[reaction.emoji] || 0) + 1;
    });
    return Object.entries(map);
  }, [reactions]);

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {grouped.map(([emoji, count]) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onReact(messageId, emoji)}
          className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs shadow-sm hover:bg-gray-50"
        >
          {emoji} {count > 1 ? count : ''}
        </button>
      ))}

      <div className="pointer-events-none absolute bottom-[-17px] left-1/2 z-30 flex -translate-x-1/2 rounded-full border border-gray-200 bg-white p-1 opacity-0 shadow-lg transition group-hover:pointer-events-auto group-hover:opacity-100">
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onReact(messageId, emoji)}
            className="rounded-full p-1 text-sm hover:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
});

const ChatMessage = memo(({ message, isOwn, onReply, onReact, onDelete }) => {
  const messageId = messageIdOf(message);
  const attachment = fileUrl(message?.file_url);
  const isImage = message?.file_type?.startsWith('image/');
  const isVideo = message?.file_type?.startsWith('video/');
  const reply = message?.replyTo || message?.reply_to_message || null;

  return (
    <div className={`group mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] sm:max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="mb-1 px-1 text-[10px] font-semibold text-gray-500 sm:text-xs">
            {message?.user?.username || message?.username || 'Anonymous'}
          </span>
        )}

        <div className="relative">
          <div
            className={`overflow-hidden rounded-2xl px-3 py-2.5 shadow-sm sm:px-4 ${
              isOwn
                ? 'rounded-br-md bg-[#006400] text-white'
                : 'rounded-bl-md bg-white text-gray-800 ring-1 ring-black/5'
            }`}
          >
            {reply && (
              <div className={`mb-2 rounded-lg border-l-4 p-2 text-xs ${
                isOwn ? 'border-white/50 bg-white/10' : 'border-[#006400] bg-gray-50'
              }`}>
                <p className="font-semibold">
                  @{reply?.user?.username || reply?.username || 'User'}
                </p>
                <p className="truncate opacity-70">{reply?.content || 'Attachment'}</p>
              </div>
            )}

            {attachment && isImage && (
              <img
                src={attachment}
                alt={message?.file_name || 'Attachment'}
                loading="lazy"
                className="mb-2 max-h-72 max-w-full rounded-xl object-cover"
              />
            )}

            {attachment && isVideo && (
              <video src={attachment} controls className="mb-2 max-h-72 max-w-full rounded-xl" />
            )}

            {attachment && !isImage && !isVideo && (
              <a
                href={attachment}
                target="_blank"
                rel="noreferrer"
                className="mb-2 flex items-center gap-2 rounded-lg bg-black/5 p-2 text-xs underline"
              >
                <FaFile />
                <span className="break-all">{message?.file_name || 'Open attachment'}</span>
              </a>
            )}

            {!!message?.content && (
              <p className="whitespace-pre-wrap break-words text-xs leading-relaxed sm:text-sm">
                {message.content}
              </p>
            )}

            <div className="mt-1 flex items-center justify-end gap-1 text-[9px] opacity-60">
              {timeOf(message?.created_at || message?.createdAt)}
              {isOwn && <FaCheck size={7} />}
            </div>
          </div>

          {!message?.isOptimistic && messageId && (
            <ReactionBar
              messageId={messageId}
              reactions={message?.reactions}
              onReact={onReact}
            />
          )}
        </div>

        {!message?.isOptimistic && messageId && (
          <div className={`mt-1 flex gap-3 px-1 text-[10px] sm:text-xs ${isOwn ? 'justify-end' : ''}`}>
            <button
              type="button"
              onClick={() => onReply(message)}
              className="flex items-center gap-1 text-gray-400 hover:text-[#006400]"
            >
              <FaReply size={9} /> Reply
            </button>

            {isOwn && (
              <button
                type="button"
                onClick={() => onDelete(messageId)}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500"
              >
                <FaTrash size={9} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

function ChatRoom() {
  const { user, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const bottomRef = useRef(null);
  const mountedRef = useRef(false);

  const loadMessages = useCallback(async (silent = false) => {
    try {
      const response = await api.getChatMessages();
      if (!mountedRef.current) return;

      const incoming = Array.isArray(response?.data) ? response.data : [];

      setMessages((current) => {
        const pending = current.filter((m) => m?.isOptimistic);
        const serverIds = new Set(incoming.map(messageIdOf).filter(Boolean));
        return [
          ...incoming,
          ...pending.filter((m) => !serverIds.has(messageIdOf(m))),
        ];
      });
    } catch (error) {
      console.error('Error loading messages:', error);
      if (!silent) {
        toast.error(
          error?.response?.data?.error || 'Failed to load chat messages'
        );
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const response = await api.getOnlineUsers();
      if (!mountedRef.current) return;
      setUsers(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  const updateActivity = useCallback(async () => {
    try {
      await api.updateUserActivity();
    } catch (error) {
      console.error('Activity update failed:', error);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (!isAuthenticated) {
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    loadMessages();
    loadUsers();
    updateActivity();

    const interval = window.setInterval(() => {
      loadMessages(true);
      loadUsers();
      updateActivity();
    }, 5000);

    return () => {
      mountedRef.current = false;
      window.clearInterval(interval);
    };
  }, [isAuthenticated, loadMessages, loadUsers, updateActivity]);

  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, loading]);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size cannot exceed 10MB.');
      event.target.value = '';
      return;
    }

    const allowed = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowed.includes(file.type)) {
      toast.error('This file type is not supported.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    if ((!newMessage.trim() && !selectedFile) || sending) return;

    const text = newMessage.trim();
    const file = selectedFile;
    const reply = replyTo;
    const tempId = `temp-${Date.now()}`;

    const localUrl = file ? URL.createObjectURL(file) : null;

    const optimistic = {
      _id: tempId,
      content: text,
      user_id: idOf(user),
      user: { username: user?.username || 'You' },
      created_at: new Date().toISOString(),
      replyTo: reply,
      isOptimistic: true,
      file_url: localUrl,
      file_type: file?.type || null,
      file_name: file?.name || null,
      reactions: [],
    };

    setMessages((prev) => [...prev, optimistic]);
    setNewMessage('');
    setSelectedFile(null);
    setReplyTo(null);
    setShowEmoji(false);
    setSending(true);

    if (fileRef.current) fileRef.current.value = '';

    try {
      const formData = new FormData();

      if (text) formData.append('content', text);

      if (reply && messageIdOf(reply)) {
        formData.append('replyTo', messageIdOf(reply));
      }

      if (file) formData.append('file', file);

      const response = await api.sendChatMessageWithFile(formData);
      const saved = response?.data || response;

      setMessages((prev) =>
        prev.map((message) => (message._id === tempId ? saved : message))
      );

      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));

      toast.error(
        error?.response?.data?.error || 'Failed to send message'
      );
    } finally {
      if (localUrl) URL.revokeObjectURL(localUrl);
      setSending(false);
    }
  };

  const reactToMessage = async (messageId, emoji) => {
    try {
      await api.reactToMessage(messageId, emoji);
      await loadMessages(true);
    } catch (error) {
      console.error('Reaction failed:', error);
      toast.error(
        error?.response?.data?.error || 'Failed to update reaction'
      );
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.deleteChatMessage(messageId);
      setMessages((prev) => prev.filter((m) => messageIdOf(m) !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(
        error?.response?.data?.error || 'Failed to delete message'
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-3xl bg-white shadow-sm">
        <div className="text-center">
          <FaComments className="mx-auto mb-3 text-4xl text-gray-300" />
          <h3 className="font-semibold text-gray-700">Please sign in</h3>
          <p className="mt-1 text-sm text-gray-400">
            Authentication is required for live chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-190px)] min-h-[560px] max-h-[820px] min-w-0 flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_25px_70px_-20px_rgba(0,80,0,0.25)]">
      <header className="flex flex-shrink-0 items-center justify-between bg-gradient-to-r from-[#004d00] via-[#006400] to-[#008000] px-3 py-3 text-white sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <FaComments className="text-[#ffcc00]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold">Live Community Chat</h3>
            <p className="flex items-center gap-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
              {users.length} online
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowUsers((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/20 sm:text-sm"
        >
          <FaUsers />
          <span className="hidden sm:inline">
            {showUsers ? 'Hide Users' : 'Users'}
          </span>
        </button>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {showUsers && (
          <aside className="w-32 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-2 sm:w-48 sm:p-3">
            <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-sm">
              <FaUsers className="text-green-500" /> Online Users
            </h4>

            <div className="space-y-1">
              {users.length ? (
                users.map((onlineUser) => (
                  <div
                    key={onlineUser.id || onlineUser._id || onlineUser.username}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-100"
                  >
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                    <span className="truncate text-[11px] text-gray-700 sm:text-sm">
                      {onlineUser.username}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No users online</p>
              )}
            </div>
          </aside>
        )}

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div
            className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-5"
            style={{
              background:
                'radial-gradient(circle at 10% 10%, rgba(0,100,0,.08), transparent 28%), radial-gradient(circle at 90% 90%, rgba(255,204,0,.10), transparent 25%), linear-gradient(135deg,#f8fcf8,#eef7ef 45%,#f9fbf9)',
            }}
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="rounded-2xl bg-white/80 px-6 py-5 text-center shadow-lg backdrop-blur">
                  <FaSpinner className="mx-auto mb-2 animate-spin text-3xl text-[#006400]" />
                  <span className="text-xs text-gray-500">Loading conversation...</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/80 text-4xl shadow-lg">
                  💬
                </div>
                <h3 className="font-semibold text-gray-600">No messages yet</h3>
                <p className="mt-1 text-sm text-gray-400">Start the conversation 👋</p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const own =
                    String(messageUserIdOf(message)) === String(idOf(user)) ||
                    message?.isOptimistic;

                  return (
                    <ChatMessage
                      key={messageIdOf(message) || `${message.created_at}-${index}`}
                      message={message}
                      isOwn={own}
                      onReply={setReplyTo}
                      onReact={reactToMessage}
                      onDelete={deleteMessage}
                    />
                  );
                })}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {replyTo && (
            <div className="flex items-center justify-between gap-2 border-t border-blue-200 bg-blue-50 px-3 py-2">
              <div className="min-w-0 truncate text-xs text-blue-700">
                <FaReply className="mr-2 inline" />
                Replying to @{replyTo?.user?.username || replyTo?.username || 'User'}
              </div>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="rounded-full p-1 text-blue-500 hover:bg-blue-100"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}

          {selectedFile && (
            <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
              <FilePreview file={selectedFile} onRemove={removeFile} />
            </div>
          )}

          <form onSubmit={sendMessage} className="relative flex-shrink-0 border-t border-gray-200 bg-white p-2 sm:p-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={sending}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#006400] disabled:opacity-50"
                title="Attach file"
              >
                <FaImage />
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => setShowEmoji((v) => !v)}
                disabled={sending}
                className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#006400]"
                title="Emoji"
              >
                <FaSmile />
              </button>

              <input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onFocus={updateActivity}
                disabled={sending}
                placeholder={
                  replyTo
                    ? `Reply to @${replyTo?.user?.username || replyTo?.username || 'User'}...`
                    : 'Type a message...'
                }
                className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-xs outline-none focus:border-[#006400] focus:ring-2 focus:ring-[#006400]/20 sm:px-4 sm:text-sm"
              />

              <button
                type="submit"
                disabled={(!newMessage.trim() && !selectedFile) || sending}
                className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#006400] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#005500] disabled:opacity-50 sm:px-4 sm:text-sm"
              >
                {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>

            {showEmoji && (
              <EmojiPicker
                onSelect={(emoji) => {
                  setNewMessage((prev) => prev + emoji);
                  setShowEmoji(false);
                  inputRef.current?.focus();
                }}
                onClose={() => setShowEmoji(false)}
              />
            )}
          </form>
        </main>
      </div>
    </div>
  );
}

export default ChatRoom;
