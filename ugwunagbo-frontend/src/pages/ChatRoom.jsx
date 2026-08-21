import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
} from 'react';

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

/* ============================================================
   CONFIG
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍'];

const EMOJIS = [
  '😊',
  '😂',
  '❤️',
  '👍',
  '🙏',
  '🔥',
  '💯',
  '🎉',
  '😍',
  '🤣',
  '😭',
  '🥺',
  '😡',
  '🤔',
  '👏',
  '💪',
  '✨',
  '🌟',
  '🍀',
  '🎊',
];

/* ============================================================
   HELPERS
============================================================ */

const getMessageId = (message) =>
  message?._id || message?.id || null;

const getUserId = (user) =>
  user?.id || user?._id || null;

const getMessageUserId = (message) =>
  message?.user_id ||
  message?.userId ||
  message?.user?.id ||
  message?.user?._id ||
  null;

const getFileUrl = (url) => {
  if (!url) return null;

  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const formatTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/* ============================================================
   EMOJI PICKER
============================================================ */

const EmojiPicker = memo(({ onSelect, onClose }) => {
  return (
    <div
      className="
        absolute
        bottom-full
        left-0
        z-50
        mb-2
        w-60
        max-w-[calc(100vw-24px)]
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-3
        shadow-2xl
      "
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">
          Choose an emoji
        </span>

        <button
          type="button"
          onClick={onClose}
          className="
            rounded-full
            p-1.5
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
          aria-label="Close emoji picker"
        >
          <FaTimes size={12} />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className="
              rounded-lg
              p-2
              text-xl
              transition
              hover:scale-110
              hover:bg-gray-100
            "
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
});

/* ============================================================
   FILE PREVIEW
============================================================ */

const FilePreview = memo(({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file) return null;

  const isImage = file.type?.startsWith('image/');
  const isVideo = file.type?.startsWith('video/');
  const fileSize = (file.size / 1024 / 1024).toFixed(2);

  return (
    <div className="flex min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2">
      {isImage && previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="h-11 w-11 flex-shrink-0 rounded-lg object-cover"
        />
      ) : isVideo && previewUrl ? (
        <video
          src={previewUrl}
          className="h-11 w-11 flex-shrink-0 rounded-lg object-cover"
          muted
          playsInline
        />
      ) : (
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
          <FaFile className="text-lg text-gray-500" />
        </div>
      )}

      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="truncate text-xs font-medium text-gray-700">
          {file.name}
        </p>

        <p className="text-[10px] text-gray-400">
          {fileSize} MB
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="
          flex-shrink-0
          rounded-full
          p-1.5
          text-red-500
          transition
          hover:bg-red-50
          hover:text-red-700
        "
        title="Remove file"
        aria-label="Remove file"
      >
        <FaTimes size={13} />
      </button>
    </div>
  );
});

/* ============================================================
   REACTION BAR
============================================================ */

const ReactionBar = memo(({ messageId, reactions, onReact }) => {
  const groupedReactions = React.useMemo(() => {
    if (!Array.isArray(reactions)) return [];

    const grouped = {};

    reactions.forEach((reaction) => {
      if (!reaction?.emoji) return;
      grouped[reaction.emoji] =
        (grouped[reaction.emoji] || 0) + 1;
    });

    return Object.entries(grouped);
  }, [reactions]);

  return (
    <>
      {groupedReactions.length > 0 && (
        <div className="mt-1 flex max-w-full flex-wrap gap-1">
          {groupedReactions.map(([emoji, count]) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onReact(messageId, emoji)}
              className="
                inline-flex
                max-w-full
                items-center
                gap-1
                rounded-full
                border
                border-gray-200
                bg-white
                px-2
                py-0.5
                text-xs
                text-gray-700
                shadow-sm
                transition
                hover:bg-gray-100
              "
            >
              <span>{emoji}</span>

              {count > 1 && (
                <span className="text-[10px] font-medium">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-16px]
          left-1/2
          z-30
          flex
          -translate-x-1/2
          items-center
          rounded-full
          border
          border-gray-200
          bg-white
          px-1.5
          py-1
          opacity-0
          shadow-lg
          transition-opacity
          duration-150
          group-hover:pointer-events-auto
          group-hover:opacity-100
        "
      >
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onReact(messageId, emoji)}
            className="
              rounded-full
              p-1
              text-sm
              transition
              hover:scale-125
            "
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
});

/* ============================================================
   CHAT MESSAGE
============================================================ */

const ChatMessage = memo(
  ({ message, onReply, onReact, onDelete, isOwn }) => {
    const messageId = getMessageId(message);

    const fileUrl = getFileUrl(message?.file_url);

    const isImage = message?.file_type?.startsWith('image/');
    const isVideo = message?.file_type?.startsWith('video/');

    const replyMessage =
      message?.replyTo ||
      message?.reply_to_message ||
      null;

    return (
      <div
        className={`
          group
          mb-3
          flex
          min-w-0
          max-w-full
          ${isOwn ? 'justify-end' : 'justify-start'}
        `}
      >
        <div
          className={`
            flex
            min-w-0
            max-w-[88%]
            flex-col
            sm:max-w-[80%]
            md:max-w-[75%]
            ${isOwn ? 'items-end' : 'items-start'}
          `}
        >
          {!isOwn && (
            <span
              className="
                mb-1
                max-w-full
                truncate
                px-1
                text-[10px]
                font-semibold
                text-gray-500
                sm:text-xs
              "
            >
              {message?.user?.username ||
                message?.username ||
                'Anonymous'}
            </span>
          )}

          <div className="relative min-w-0 max-w-full">
            <div
              className={`
                min-w-0
                max-w-full
                overflow-hidden
                rounded-2xl
                px-3
                py-2
                shadow-sm
                sm:px-4
                sm:py-2.5
                ${
                  isOwn
                    ? 'rounded-br-md bg-[#006400] text-white'
                    : 'rounded-bl-md bg-gray-100 text-gray-800'
                }
              `}
            >
              {replyMessage && (
                <div
                  className={`
                    mb-2
                    min-w-0
                    max-w-full
                    overflow-hidden
                    rounded-lg
                    border-l-4
                    p-2
                    text-[10px]
                    sm:text-xs
                    ${
                      isOwn
                        ? 'border-white/50 bg-white/10'
                        : 'border-[#006400] bg-white'
                    }
                  `}
                >
                  <p className="truncate font-semibold">
                    @
                    {replyMessage?.user?.username ||
                      replyMessage?.username ||
                      'User'}
                  </p>

                  <p className="truncate opacity-70">
                    {replyMessage?.content || 'Attachment'}
                  </p>
                </div>
              )}

              {fileUrl && isImage && (
                <img
                  src={fileUrl}
                  alt={message?.file_name || 'Chat attachment'}
                  loading="lazy"
                  className="
                    mb-2
                    block
                    h-auto
                    max-h-64
                    max-w-full
                    rounded-xl
                    object-cover
                  "
                />
              )}

              {fileUrl && isVideo && (
                <video
                  src={fileUrl}
                  controls
                  className="
                    mb-2
                    block
                    h-auto
                    max-h-64
                    max-w-full
                    rounded-xl
                  "
                />
              )}

              {fileUrl && !isImage && !isVideo && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mb-2
                    flex
                    min-w-0
                    max-w-full
                    items-center
                    gap-2
                    overflow-hidden
                    rounded-lg
                    bg-black/5
                    p-2
                    text-xs
                    underline
                  "
                >
                  <FaFile className="flex-shrink-0" />

                  <span className="min-w-0 break-all">
                    {message?.file_name || 'Open attachment'}
                  </span>
                </a>
              )}

              {message?.content && (
                <p
                  className="
                    max-w-full
                    whitespace-pre-wrap
                    break-words
                    [overflow-wrap:anywhere]
                    text-xs
                    leading-relaxed
                    sm:text-sm
                  "
                >
                  {message.content}
                </p>
              )}

              <div className="mt-1 flex items-center justify-end gap-1">
                <span className="text-[8px] opacity-60 sm:text-[10px]">
                  {formatTime(
                    message?.created_at || message?.createdAt
                  )}
                </span>

                {isOwn && (
                  <FaCheck size={7} className="opacity-60" />
                )}
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
            <div
              className={`
                mt-1
                flex
                items-center
                gap-3
                px-1
                ${isOwn ? 'justify-end' : 'justify-start'}
              `}
            >
              <button
                type="button"
                onClick={() => onReply(message)}
                className="
                  flex
                  items-center
                  gap-1
                  text-[10px]
                  text-gray-400
                  transition
                  hover:text-[#006400]
                  sm:text-xs
                "
              >
                <FaReply size={9} />
                Reply
              </button>

              {isOwn && (
                <button
                  type="button"
                  onClick={() => onDelete(messageId)}
                  className="
                    flex
                    items-center
                    gap-1
                    text-[10px]
                    text-gray-400
                    transition
                    hover:text-red-500
                    sm:text-xs
                  "
                >
                  <FaTrash size={9} />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

/* ============================================================
   MAIN CHAT ROOM
============================================================ */

const ChatRoom = () => {
  const { user, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMountedRef = useRef(true);

  /* ==========================================================
     LOAD MESSAGES
  ========================================================== */

  const loadMessages = useCallback(async (silent = false) => {
    try {
      const response = await api.getChatMessages();

      if (!isMountedRef.current) return;

      const incoming = Array.isArray(response.data)
        ? response.data
        : [];

      setMessages((current) => {
        const optimistic = current.filter(
          (message) => message?.isOptimistic
        );

        const serverIds = new Set(
          incoming
            .map((message) => getMessageId(message))
            .filter(Boolean)
        );

        const pending = optimistic.filter(
          (message) =>
            !serverIds.has(getMessageId(message))
        );

        return [...incoming, ...pending];
      });
    } catch (error) {
      console.error('Error loading messages:', error);

      if (!silent) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to load chat messages'
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /* ==========================================================
     LOAD USERS
  ========================================================== */

  const loadUsers = useCallback(async () => {
    try {
      const response = await api.getOnlineUsers();

      if (!isMountedRef.current) return;

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  /* ==========================================================
     ACTIVITY
  ========================================================== */

  const updateActivity = useCallback(async () => {
    try {
      await api.updateUserActivity();
    } catch (error) {
      console.error('Activity update failed:', error);
    }
  }, []);

  /* ==========================================================
     INITIAL LOAD + POLLING
  ========================================================== */

  useEffect(() => {
    isMountedRef.current = true;

    if (!isAuthenticated) {
      setLoading(false);
      return undefined;
    }

    loadMessages();
    loadUsers();
    updateActivity();

    const interval = setInterval(() => {
      if (!isMountedRef.current) return;

      loadMessages(true);
      loadUsers();
      updateActivity();
    }, 5000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [
    isAuthenticated,
    loadMessages,
    loadUsers,
    updateActivity,
  ]);

  /* ==========================================================
     AUTO SCROLL
  ========================================================== */

  useEffect(() => {
    if (loading) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages.length, loading]);

  /* ==========================================================
     FILE SELECT
  ========================================================== */

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size cannot exceed 10MB.');
      event.target.value = '';
      return;
    }

    const allowedTypes = [
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

    if (!allowedTypes.includes(file.type)) {
      toast.error('This file type is not supported.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  /* ==========================================================
     REMOVE FILE
  ========================================================== */

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /* ==========================================================
     SEND MESSAGE
  ========================================================== */

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (
      (!newMessage.trim() && !selectedFile) ||
      isSending
    ) {
      return;
    }

    const messageText = newMessage.trim();
    const currentFile = selectedFile;
    const currentReply = replyTo;
    const tempId = `temp-${Date.now()}`;

    const localFileUrl = currentFile
      ? URL.createObjectURL(currentFile)
      : null;

    const optimisticMessage = {
      _id: tempId,
      content: messageText,
      user_id: getUserId(user),
      user: {
        username: user?.username || 'You',
      },
      created_at: new Date().toISOString(),
      replyTo: currentReply,
      isOptimistic: true,
      file_url: localFileUrl,
      file_type: currentFile?.type || null,
      file_name: currentFile?.name || null,
      reactions: [],
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    setNewMessage('');
    setSelectedFile(null);
    setReplyTo(null);
    setShowEmojiPicker(false);
    setIsSending(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      const formData = new FormData();

      if (messageText) {
        formData.append('content', messageText);
      }

      if (
        currentReply &&
        getMessageId(currentReply)
      ) {
        formData.append(
          'replyTo',
          getMessageId(currentReply)
        );
      }

      if (currentFile) {
        formData.append('file', currentFile);
      }

      const response =
        await api.sendChatMessageWithFile(formData);

      const savedMessage =
        response.data || response;

      setMessages((prev) =>
        prev.map((message) =>
          message._id === tempId
            ? savedMessage
            : message
        )
      );

      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);

      setMessages((prev) =>
        prev.filter(
          (message) => message._id !== tempId
        )
      );

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to send message'
      );
    } finally {
      if (localFileUrl) {
        URL.revokeObjectURL(localFileUrl);
      }

      setIsSending(false);
    }
  };

  /* ==========================================================
     REACTION
  ========================================================== */

  const handleReaction = async (messageId, emoji) => {
    if (!messageId || !emoji) return;

    try {
      await api.reactToMessage(messageId, emoji);
      await loadMessages(true);
    } catch (error) {
      console.error('Reaction failed:', error);
      console.error(
        'Reaction server response:',
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to update reaction'
      );
    }
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this message?'
    );

    if (!confirmed) return;

    try {
      await api.deleteChatMessage(messageId);

      setMessages((prev) =>
        prev.filter(
          (message) =>
            getMessageId(message) !== messageId
        )
      );

      toast.success('Message deleted');
    } catch (error) {
      console.error('Delete error:', error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to delete message'
      );
    }
  };

  /* ==========================================================
     OWN MESSAGE
  ========================================================== */

  const isOwnMessage = (message) => {
    if (!message || !user) return false;

    const currentUserId = getUserId(user);
    const messageUserId = getMessageUserId(message);

    return (
      String(messageUserId) === String(currentUserId) ||
      message?.isOptimistic
    );
  };

  /* ==========================================================
     EMOJI
  ========================================================== */

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  /* ==========================================================
     NOT AUTHENTICATED
  ========================================================== */

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[450px] w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="px-4 text-center">
          <FaComments className="mx-auto mb-3 text-4xl text-gray-300" />

          <h3 className="font-semibold text-gray-700">
            Please sign in
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            You need to be authenticated to use the live chat.
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div
      className="
        relative
        flex
        h-[calc(100vh-140px)]
        min-h-[500px]
        max-h-[800px]
        w-full
        min-w-0
        max-w-full
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-white/70
        bg-white
        shadow-[0_25px_70px_-20px_rgba(0,80,0,0.25)]
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className="
          relative
          flex
          min-w-0
          flex-shrink-0
          items-center
          justify-between
          gap-3
          overflow-hidden
          bg-gradient-to-r
          from-[#004d00]
          via-[#006400]
          to-[#008000]
          px-3
          py-3
          text-white
          shadow-lg
          sm:px-5
        "
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-10 -top-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-yellow-300/10 blur-2xl" />

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%)',
              backgroundPosition: '0 0, 12px 12px',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative z-10 flex min-w-0 items-center gap-2 sm:gap-3">
          <div
            className="
              flex
              h-9
              w-9
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white/10
            "
          >
            <FaComments className="text-[#ffcc00]" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold sm:text-base">
              Live Chat
            </h3>

            <p className="flex items-center gap-1 text-[10px] text-white/80 sm:text-xs">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-300" />

              <span className="truncate">
                {users.length} online
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowUsers((prev) => !prev)}
          className="
            relative
            z-10
            flex
            flex-shrink-0
            items-center
            gap-1.5
            rounded-xl
            border
            border-white/10
            bg-white/10
            px-2.5
            py-2
            text-xs
            shadow-sm
            backdrop-blur-md
            transition
            hover:bg-white/20
            sm:px-3
            sm:text-sm
          "
          aria-label={showUsers ? 'Hide users' : 'Show users'}
        >
          <FaUsers />

          <span className="hidden sm:inline">
            {showUsers ? 'Hide Users' : 'Users'}
          </span>
        </button>
      </header>

      {/* ======================================================
          BODY
      ====================================================== */}

      <div
        className="
          flex
          min-h-0
          min-w-0
          flex-1
          overflow-hidden
        "
      >
        {/* ====================================================
            USERS
        ==================================================== */}

        {showUsers && (
          <aside
            className="
              flex
              w-28
              min-w-0
              flex-shrink-0
              flex-col
              overflow-x-hidden
              overflow-y-auto
              border-r
              border-gray-200
              bg-gray-50
              p-2
              sm:w-40
              sm:p-3
              md:w-48
            "
          >
            <h4
              className="
                mb-2
                flex
                min-w-0
                items-center
                gap-1.5
                text-[10px]
                font-semibold
                text-gray-700
                sm:mb-3
                sm:gap-2
                sm:text-sm
              "
            >
              <FaUsers className="flex-shrink-0 text-green-500" />

              <span className="truncate">
                Online Users
              </span>
            </h4>

            <div className="min-w-0 space-y-1">
              {users.length > 0 ? (
                users.map((onlineUser) => (
                  <div
                    key={
                      onlineUser.id ||
                      onlineUser._id ||
                      onlineUser.username
                    }
                    className="
                      flex
                      min-w-0
                      max-w-full
                      items-center
                      gap-2
                      overflow-hidden
                      rounded-lg
                      px-1.5
                      py-2
                      transition
                      hover:bg-gray-100
                    "
                  >
                    <span
                      className="
                        h-2
                        w-2
                        flex-shrink-0
                        rounded-full
                        bg-green-500
                      "
                    />

                    <span
                      className="
                        min-w-0
                        truncate
                        text-[10px]
                        text-gray-700
                        sm:text-sm
                      "
                    >
                      {onlineUser.username}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-400 sm:text-xs">
                  No users online
                </p>
              )}
            </div>
          </aside>
        )}

        {/* ====================================================
            CHAT
        ==================================================== */}

        <main
          className="
            flex
            min-h-0
            min-w-0
            max-w-full
            flex-1
            flex-col
            overflow-hidden
          "
        >
          {/* ==================================================
              MESSAGES — SINGLE RENDERING AREA
          ================================================== */}

          <div
            ref={messagesContainerRef}
            className="
              relative
              min-h-0
              min-w-0
              flex-1
              overflow-x-hidden
              overflow-y-auto
              p-3
              sm:p-4
            "
            style={{
              background:
                'radial-gradient(circle at 10% 10%, rgba(0,100,0,0.08), transparent 28%), radial-gradient(circle at 90% 90%, rgba(255,204,0,0.10), transparent 25%), linear-gradient(135deg, #f8fcf8 0%, #eef7ef 45%, #f9fbf9 100%)',
            }}
          >
            {/* Decorative background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="
                  absolute
                  -left-24
                  -top-24
                  h-72
                  w-72
                  rounded-full
                  bg-green-600/10
                  blur-3xl
                "
              />

              <div
                className="
                  absolute
                  -bottom-24
                  -right-24
                  h-72
                  w-72
                  rounded-full
                  bg-yellow-400/10
                  blur-3xl
                "
              />

              <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25px 25px, #006400 2px, transparent 2px),
                    radial-gradient(circle at 75px 75px, #006400 2px, transparent 2px)
                  `,
                  backgroundSize: '100px 100px',
                }}
              />

              <div
                className="
                  absolute
                  left-[8%]
                  top-[18%]
                  h-16
                  w-24
                  rounded-2xl
                  rounded-bl-md
                  bg-white/40
                  shadow-sm
                  backdrop-blur-sm
                "
              />

              <div
                className="
                  absolute
                  bottom-[20%]
                  right-[8%]
                  h-14
                  w-20
                  rounded-2xl
                  rounded-br-md
                  bg-green-600/5
                  shadow-sm
                  backdrop-blur-sm
                "
              />
            </div>

            {/* Actual message content */}
            <div className="relative z-10 min-h-full">
              {loading ? (
                <div className="flex min-h-full items-center justify-center">
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/60
                      bg-white/70
                      px-6
                      py-5
                      shadow-lg
                      backdrop-blur-md
                    "
                  >
                    <FaSpinner className="animate-spin text-3xl text-[#006400]" />

                    <span className="text-xs font-medium text-gray-500">
                      Loading conversation...
                    </span>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div
                  className="
                    flex
                    min-h-full
                    flex-col
                    items-center
                    justify-center
                    px-4
                    text-center
                  "
                >
                  <div
                    className="
                      mb-4
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-3xl
                      bg-white/80
                      text-4xl
                      shadow-xl
                      backdrop-blur-md
                    "
                  >
                    💬
                  </div>

                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/60
                      bg-white/60
                      px-6
                      py-4
                      shadow-sm
                      backdrop-blur-md
                    "
                  >
                    <p className="text-sm font-semibold text-gray-600 sm:text-base">
                      No messages yet
                    </p>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                      Start the conversation 👋
                    </p>
                  </div>
                </div>
              ) : (
                <div className="min-w-0 max-w-full">
                  {messages.map((message, index) => {
                    const messageId = getMessageId(message);

                    return (
                      <ChatMessage
                        key={
                          messageId ||
                          `optimistic-${message.created_at}-${index}`
                        }
                        message={message}
                        onReply={setReplyTo}
                        onReact={handleReaction}
                        onDelete={handleDeleteMessage}
                        isOwn={isOwnMessage(message)}
                      />
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              REPLY BAR
          ================================================== */}

          {replyTo && (
            <div
              className="
                flex
                min-w-0
                flex-shrink-0
                items-center
                justify-between
                gap-2
                overflow-hidden
                border-t
                border-blue-200
                bg-blue-50
                px-3
                py-2
                sm:px-4
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  text-xs
                  text-blue-700
                  sm:text-sm
                "
              >
                <FaReply className="mr-2 flex-shrink-0" />

                <span className="truncate">
                  Replying to @
                  {replyTo?.user?.username ||
                    replyTo?.username ||
                    'User'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="
                  flex-shrink-0
                  rounded-full
                  p-1
                  text-blue-500
                  hover:bg-blue-100
                "
                aria-label="Cancel reply"
              >
                <FaTimes size={13} />
              </button>
            </div>
          )}

          {/* ==================================================
              FILE PREVIEW
          ================================================== */}

          {selectedFile && (
            <div
              className="
                min-w-0
                flex-shrink-0
                overflow-hidden
                border-t
                border-gray-200
                bg-gray-50
                px-3
                py-2
                sm:px-4
              "
            >
              <FilePreview
                file={selectedFile}
                onRemove={removeFile}
              />
            </div>
          )}

          {/* ==================================================
              COMPOSER
          ================================================== */}

          <form
            onSubmit={handleSendMessage}
            className="
              relative
              min-w-0
              w-full
              flex-shrink-0
              overflow-visible
              border-t
              border-gray-200
              bg-white
              p-2
              sm:p-3
            "
          >
            <div
              className="
                flex
                min-w-0
                w-full
                max-w-full
                items-center
                gap-1
                sm:gap-2
              "
            >
              {/* FILE BUTTON */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending}
                title="Attach file"
                className="
                  flex-shrink-0
                  rounded-lg
                  p-2
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-[#006400]
                  disabled:opacity-50
                "
              >
                <FaImage />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* EMOJI */}
              <button
                type="button"
                onClick={() =>
                  setShowEmojiPicker((prev) => !prev)
                }
                disabled={isSending}
                title="Emoji"
                className="
                  relative
                  flex-shrink-0
                  rounded-lg
                  p-2
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-[#006400]
                  disabled:opacity-50
                "
              >
                <FaSmile />
              </button>

              {/* INPUT */}
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(event) =>
                  setNewMessage(event.target.value)
                }
                onFocus={updateActivity}
                placeholder={
                  replyTo
                    ? `Reply to @${
                        replyTo?.user?.username ||
                        replyTo?.username ||
                        'User'
                      }...`
                    : 'Type a message...'
                }
                disabled={isSending}
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-gray-300
                  px-3
                  py-2
                  text-xs
                  outline-none
                  transition
                  focus:border-[#006400]
                  focus:ring-2
                  focus:ring-[#006400]/20
                  disabled:bg-gray-100
                  sm:px-4
                  sm:text-sm
                "
              />

              {/* SEND */}
              <button
                type="submit"
                disabled={
                  (!newMessage.trim() && !selectedFile) ||
                  isSending
                }
                className="
                  flex
                  flex-shrink-0
                  items-center
                  gap-1.5
                  rounded-xl
                  bg-[#006400]
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white
                  transition
                  hover:bg-[#005500]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:px-4
                  sm:text-sm
                "
              >
                {isSending ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaPaperPlane />

                    <span className="hidden sm:inline">
                      Send
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* EMOJI PICKER */}
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatRoom;