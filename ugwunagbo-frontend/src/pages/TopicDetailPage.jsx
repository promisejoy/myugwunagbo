import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaUserCircle, FaCalendarAlt, FaReply, 
  FaThumbsUp, FaShare, FaEye, FaSpinner,
  FaPaperPlane, FaTrash, FaEdit, FaBookmark,
  FaComment, FaUsers, FaFire
} from 'react-icons/fa';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TopicDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const repliesEndRef = useRef(null);

  useEffect(() => {
    loadTopic();
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/forum');
    }
  }, [isAuthenticated, navigate]);

  const loadTopic = async () => {
    try {
      setLoading(true);
      const response = await api.getTopic(id);
      setTopic(response.data);
      setReplies(response.data.replies || []);
      setReplyCount(response.data.replyCount || response.data.replies?.length || 0);
      setLikeCount(response.data.likes || 0);
      
      if (isAuthenticated) {
        try {
          const likeStatus = await api.getLikeStatus(id);
          setLiked(likeStatus.data.liked);
        } catch (error) {
          console.error('Error getting like status:', error);
        }
      }
    } catch (error) {
      console.error('Error loading topic:', error);
      toast.error('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error('Please write something before posting');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.addReply(id, { content: replyContent.trim() });
      setReplies([...replies, response.data]);
      setReplyCount(prev => prev + 1);
      setReplyContent('');
      toast.success('Reply posted successfully!');
      
      setTimeout(() => {
        repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error(error.response?.data?.error || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like');
      return;
    }
    try {
      const response = await api.likeTopic(id);
      setLiked(response.data.liked);
      setLikeCount(prev => response.data.liked ? prev + 1 : prev - 1);
      toast.success(response.data.liked ? 'Liked!' : 'Unliked');
    } catch (error) {
      console.error('Error liking:', error);
      toast.error('Failed to like');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="text-4xl text-[#006400] animate-spin" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Topic not found</h2>
        <Link to="/forum" className="text-[#006400] hover:underline mt-4 inline-block">
          <FaArrowLeft className="inline mr-2" /> Back to Forum
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom py-6">
        {/* Back Button */}
        <Link 
          to="/forum" 
          className="inline-flex items-center text-[#006400] hover:text-[#005a00] font-medium mb-4 transition-colors group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Forum
        </Link>

        {/* Topic Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">
          {/* Topic Header */}
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-[#006400] bg-[#006400]/10 px-3 py-1 rounded-full">
                    {topic.category || 'General'}
                  </span>
                  {topic.replyCount > 5 && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FaFire className="text-xs" /> Hot
                    </span>
                  )}
                  {topic.views > 50 && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FaEye className="text-xs" /> Trending
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{topic.title}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaUserCircle className="text-[#006400]" />
                    <span className="font-medium text-gray-700">{topic.user?.fullName || topic.user?.username || 'Anonymous'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-gray-400" />
                    {formatDate(topic.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye className="text-gray-400" />
                    {topic.views || 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <FaComment className="text-gray-400" />
                    {replyCount} replies
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300 ${
                    liked 
                      ? 'bg-[#006400] text-white hover:bg-[#005a00]' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaThumbsUp className="text-sm" />
                  <span className="font-medium">{likeCount}</span>
                </button>
                <button className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                  <FaShare />
                </button>
              </div>
            </div>
            
            {/* Topic Content */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {topic.content}
              </div>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaComment className="text-[#006400]" />
                Replies ({replyCount})
              </h3>
              <span className="text-sm text-gray-400">
                {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </span>
            </div>

            {/* Replies List */}
            {replies.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
                <FaComment className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-lg font-medium">No replies yet</p>
                <p className="text-sm">Be the first to respond to this discussion!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {replies.map((reply) => (
                  <div key={reply._id || reply.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <FaUserCircle className="text-3xl text-[#006400]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">
                            {reply.user?.fullName || reply.user?.username || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={repliesEndRef} />
              </div>
            )}

            {/* Reply Form - Improved with clear label and textarea */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaReply className="text-[#006400]" /> 
                Write a Reply
              </h4>
              <form onSubmit={handleReplySubmit} className="space-y-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your thoughts, ask a question, or continue the discussion..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-2.5 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    {submitting ? 'Posting...' : 'Post Reply'}
                  </button>
                </div>
              </form>
              <p className="text-xs text-gray-400 mt-2">
                Be respectful and constructive. Your reply will be visible to everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;