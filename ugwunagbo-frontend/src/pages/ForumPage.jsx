import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaComments, FaPlus, FaSearch, FaUser, FaCalendarAlt, 
  FaTimes, FaUserPlus, FaSignInAlt, FaSignOutAlt,
  FaUserCircle, FaSpinner, FaEye, FaFire, FaComment, FaHome,
  FaHashtag, FaUsers, FaComments as FaChat, FaNewspaper,
  FaImage, FaVideo, FaFile
} from 'react-icons/fa';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import NewTopicModal from '../components/forum/NewTopicModal';
import ChatRoom from './ChatRoom';
import toast from 'react-hot-toast';

// ---------- Auth Modal ----------
const AuthModal = ({ isOpen, onClose, onLogin, onRegister, mode, setMode, loading, error }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', fullName: ''
  });

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => { e.preventDefault(); onLogin(loginForm); };
  const handleRegisterSubmit = (e) => { e.preventDefault(); onRegister(registerForm); };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-[#006400] to-[#008000] p-6 text-center sticky top-0 z-10">
          <div className="bg-[#ffcc00] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            {mode === 'login' ? <FaSignInAlt className="text-[#006400] text-2xl" /> : <FaUserPlus className="text-[#006400] text-2xl" />}
          </div>
          <h2 className="text-xl font-bold text-white">{mode === 'login' ? 'Welcome Back' : 'Join the Community'}</h2>
          <p className="text-[#ffcc00]/80 text-sm">
            {mode === 'login' ? 'Login to join the diaspora forum' : 'Create your account and start connecting'}
          </p>
        </div>
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-start">
              <FaTimes className="mt-1 mr-2 flex-shrink-0" /><span>{error}</span>
            </div>
          )}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
                <input type="text" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all" placeholder="Enter your username" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all" placeholder="Enter your password" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />}
                {loading ? 'Logging in...' : 'Login to Forum'}
              </button>
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setMode('register'); setLoginForm({ username: '', password: '' }); }} className="text-[#006400] hover:underline font-semibold">Register here</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all" placeholder="Enter your full name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all" placeholder="Choose a username" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all" placeholder="Enter your email" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all" placeholder="Create a password (min 6 characters)" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all" placeholder="Confirm your password" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                {loading ? 'Registering...' : 'Create Account'}
              </button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setRegisterForm({ username: '', email: '', password: '', confirmPassword: '', fullName: '' }); }} className="text-[#006400] hover:underline font-semibold">Login here</button>
              </p>
            </form>
          )}
          <button onClick={onClose} className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ---------- Main ForumPage ----------
const ForumPage = () => {
  const { isAuthenticated, user, login, register, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('latest');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const stats = useMemo(() => ({
    totalTopics: topics.length,
    totalReplies: topics.reduce((sum, t) => sum + (t.replyCount || 0), 0),
    activeUsers: Math.min(topics.length * 2, 50)
  }), [topics]);

  const loadTopics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getTopics();
      setTopics(response.data || []);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast.error('Failed to load forum topics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadTopics();
  }, [isAuthenticated, loadTopics]);

  const handleTopicCreated = (newTopic) => {
    setTopics(prev => [newTopic, ...prev]);
    setIsModalOpen(false);
    toast.success('Topic created successfully!');
  };

  const handleLogin = async (loginData) => {
    setAuthSubmitting(true);
    setAuthError('');
    try {
      const result = await login(loginData.username, loginData.password);
      if (result.success) {
        setShowAuthModal(false);
        await loadTopics();
        toast.success('Welcome back!');
      } else {
        setAuthError(result.error || 'Invalid credentials');
      }
    } catch (error) {
      setAuthError('Login failed. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleRegister = async (registerData) => {
    setAuthSubmitting(true);
    setAuthError('');
    if (registerData.password !== registerData.confirmPassword) {
      setAuthError('Passwords do not match');
      setAuthSubmitting(false);
      return;
    }
    if (registerData.password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      setAuthSubmitting(false);
      return;
    }
    try {
      const result = await register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullName || registerData.username
      });
      if (result.success) {
        setShowAuthModal(false);
        await loadTopics();
        toast.success('Registration successful!');
      } else {
        setAuthError(result.error || 'Registration failed');
      }
    } catch (error) {
      setAuthError('Registration failed. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => 
      topic.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [topics, searchTerm]);

  const sortedTopics = useMemo(() => {
    return [...filteredTopics].sort((a, b) => {
      switch (filter) {
        case 'latest': return new Date(b.created_at) - new Date(a.created_at);
        case 'popular': return (b.views || 0) - (a.views || 0);
        case 'most_replies': return (b.replyCount || 0) - (a.replyCount || 0);
        default: return 0;
      }
    });
  }, [filteredTopics, filter]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-[#006400] to-[#008000] p-8 text-center">
            <div className="bg-[#ffcc00] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaComments className="text-[#006400] text-4xl" />
            </div>
            <h2 className="text-3xl font-bold text-white">Diaspora Forum</h2>
            <p className="text-[#ffcc00]/80 text-sm mt-2">Join the community of Ugwunagbo people home and abroad</p>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-6">Please login or register to participate in the forum discussions.</p>
            <div className="space-y-3">
              <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="w-full bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2">
                <FaSignInAlt /> Login
              </button>
              <button onClick={() => { setAuthMode('register'); setShowAuthModal(true); }} className="w-full bg-[#ffcc00] text-[#006400] hover:bg-[#e6b800] font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <FaUserPlus /> Create Account
              </button>
            </div>
            <button onClick={() => navigate('/')} className="mt-6 text-gray-500 hover:text-gray-700 text-sm transition-colors flex items-center justify-center gap-2">
              <FaHome /> Back to Home
            </button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} onRegister={handleRegister} mode={authMode} setMode={setAuthMode} loading={authSubmitting} error={authError} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Centralized Header */}
      <div className="relative bg-gradient-to-r from-[#006400] to-[#008000] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNHYtNGgtNHpNNiAzNHYtNEg0djRIMHYyaDR2NGgydi00aDR2LTJINnpNNiA0VjBINHY0SDB2Mmg0djRoMlY2aDRWNEg2eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        
        <div className="container-custom relative z-10 py-6 sm:py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FaComments className="text-3xl sm:text-4xl text-[#ffcc00]" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Diaspora Forum</h1>
          </div>
          <p className="text-[#ffcc00]/90 text-sm sm:text-base">Connect with the community</p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs sm:text-sm text-white/70">
            <span><FaUsers className="inline mr-1" /> {stats.activeUsers} active</span>
            <span><FaComment className="inline mr-1" /> {stats.totalReplies} replies</span>
            <span><FaHashtag className="inline mr-1" /> {stats.totalTopics} topics</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs sm:text-sm text-[#ffcc00]/80 flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
              <FaUserCircle className="text-base sm:text-lg" />
              <span className="truncate max-w-[80px] sm:max-w-none">{user?.fullName || user?.username}</span>
            </span>
            <button onClick={handleLogout} className="text-xs sm:text-sm bg-red-600/20 hover:bg-red-600/30 text-white px-3 py-1.5 rounded-lg transition-colors">
              <FaSignOutAlt className="inline mr-1" /> Logout
            </button>
            <Link to="/" className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors">
              <FaHome className="inline mr-1" /> Home
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Selection */}
      <div className="container-custom py-4">
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'chat' ? 'bg-[#006400] text-white shadow-lg shadow-[#006400]/30' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <FaChat className="text-lg" /> <span>💬 Group Chat</span>
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Live</span>
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'forum' ? 'bg-[#006400] text-white shadow-lg shadow-[#006400]/30' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <FaNewspaper className="text-lg" /> <span>📝 Forum Posts</span>
            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">{stats.totalTopics}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom pb-8">
        {activeTab === 'chat' ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 flex-1 bg-gradient-to-r from-[#006400]/20 to-transparent"></div>
              <h2 className="text-lg font-bold text-gray-700">💬 Live Chat</h2>
              <div className="h-1 flex-1 bg-gradient-to-l from-[#006400]/20 to-transparent"></div>
            </div>
            <ChatRoom />
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#006400] hover:bg-[#005a00] text-white px-4 sm:px-5 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
                  <FaPlus className="text-xs sm:text-sm" /> New Discussion
                </button>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none bg-white text-sm">
                  <option value="latest">Latest</option>
                  <option value="popular">Most Viewed</option>
                  <option value="most_replies">Most Replies</option>
                </select>
              </div>
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search discussions..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none bg-white text-sm" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20"><FaSpinner className="text-4xl text-[#006400] animate-spin" /></div>
            ) : sortedTopics.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">{searchTerm ? 'No discussions match your search' : 'No discussions yet'}</h3>
                <p className="text-gray-400">{searchTerm ? 'Try a different search term' : 'Be the first to start a discussion!'}</p>
                {!searchTerm && <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-[#006400] hover:bg-[#005a00] text-white px-6 py-2 rounded-lg transition-colors">Start Discussion</button>}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedTopics.map((topic) => (
                  <Link key={topic._id || topic.id} to={`/forum/topic/${topic._id || topic.id}`} className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5 border border-gray-100 hover:border-[#006400]/40 group">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 hidden xs:block">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#006400]/10 flex items-center justify-center text-[#006400]">
                          <FaUserCircle className="text-xl sm:text-2xl" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                          <span className="text-[10px] sm:text-xs font-medium text-[#006400] bg-[#006400]/10 px-1.5 sm:px-2 py-0.5 rounded-full">{topic.category || 'General'}</span>
                          {topic.replyCount > 5 && <span className="text-[10px] sm:text-xs text-orange-500 bg-orange-50 px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1"><FaFire className="text-[10px] sm:text-xs" /> Hot</span>}
                          {topic.views > 50 && <span className="text-[10px] sm:text-xs text-blue-500 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1"><FaEye className="text-[10px] sm:text-xs" /> Trending</span>}
                        </div>
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-[#006400] transition-colors">{topic.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{topic.content}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-[10px] sm:text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FaUserCircle className="text-[#006400]" /> {topic.user?.fullName || topic.user?.username || 'Anonymous'}</span>
                          <span className="flex items-center gap-1"><FaCalendarAlt className="text-gray-400" /> {formatDate(topic.created_at)}</span>
                          <span className="flex items-center gap-1"><FaComment className="text-gray-400" /> {topic.replyCount || 0} replies</span>
                          <span className="flex items-center gap-1"><FaEye className="text-gray-400" /> {topic.views || 0} views</span>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                        <div className="text-sm font-semibold text-[#006400]">{topic.replyCount || 0}</div>
                        <div className="text-[10px] text-gray-500">replies</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <NewTopicModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTopicCreated={handleTopicCreated} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} onRegister={handleRegister} mode={authMode} setMode={setAuthMode} loading={authSubmitting} error={authError} />
    </div>
  );
};

export default ForumPage;