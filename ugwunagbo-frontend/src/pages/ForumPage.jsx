import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaComments,
  FaPlus,
  FaSearch,
  FaCalendarAlt,
  FaTimes,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaSpinner,
  FaEye,
  FaFire,
  FaComment,
  FaHome,
  FaHashtag,
  FaUsers,
  FaNewspaper,
} from 'react-icons/fa';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import NewTopicModal from '../components/forum/NewTopicModal';
import ChatRoom from './ChatRoom';
import toast from 'react-hot-toast';

const GREEN = '#006400';
const GREEN_DARK = '#005500';
const GOLD = '#ffcc00';

function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  mode,
  setMode,
  loading,
  error,
}) {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    setLoginForm({ username: '', password: '' });
    setRegisterForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    });
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-[#004d00] via-[#006400] to-[#008000] p-7 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffcc00]">
            {mode === 'login' ? (
              <FaSignInAlt className="text-2xl text-[#006400]" />
            ) : (
              <FaUserPlus className="text-2xl text-[#006400]" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Join the Community'}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {mode === 'login'
              ? 'Login to join the ChatMore'
              : 'Create your community account'}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                onLogin(loginForm);
              }}
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Username or Email
                </label>
                <input
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, username: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#006400] focus:ring-2 focus:ring-[#006400]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, password: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#006400] focus:ring-2 focus:ring-[#006400]/20"
                  required
                />
              </div>

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006400] px-5 py-3 font-semibold text-white transition hover:bg-[#005500] disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />}
                {loading ? 'Logging in...' : 'Login to Forum'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-[#006400] hover:underline"
                >
                  Register here
                </button>
              </p>
            </form>
          ) : (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                onRegister(registerForm);
              }}
            >
              {[
                ['Full Name', 'fullName', 'text'],
                ['Username', 'username', 'text'],
                ['Email Address', 'email', 'email'],
                ['Password', 'password', 'password'],
                ['Confirm Password', 'confirmPassword', 'password'],
              ].map(([label, key, type]) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={registerForm[key]}
                    onChange={(e) =>
                      setRegisterForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#006400] focus:ring-2 focus:ring-[#006400]/20"
                    required
                  />
                </div>
              ))}

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006400] px-5 py-3 font-semibold text-white transition hover:bg-[#005500] disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#006400] hover:underline"
                >
                  Login here
                </button>
              </p>
            </form>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm text-gray-500 hover:bg-gray-50"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ForumPage() {
  const { isAuthenticated, user, login, register, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('chat');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('latest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const loadTopics = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await api.getTopics();
      setTopics(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast.error(
        error?.response?.data?.error || 'Failed to load forum topics'
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const stats = useMemo(() => {
    const replies = topics.reduce(
      (sum, topic) => sum + Number(topic.replyCount || 0),
      0
    );

    return {
      topics: topics.length,
      replies,
    };
  }, [topics]);

  const filteredTopics = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const result = topics.filter((topic) => {
      if (!term) return true;

      return (
        topic.title?.toLowerCase().includes(term) ||
        topic.content?.toLowerCase().includes(term) ||
        topic.user?.username?.toLowerCase().includes(term)
      );
    });

    return result.sort((a, b) => {
      if (filter === 'popular') return Number(b.views || 0) - Number(a.views || 0);
      if (filter === 'most_replies') {
        return Number(b.replyCount || 0) - Number(a.replyCount || 0);
      }

      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  }, [topics, searchTerm, filter]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';

    const diff = Date.now() - date.getTime();

    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLogin = async ({ username, password }) => {
    setAuthSubmitting(true);
    setAuthError('');

    try {
      const result = await login(username, password);

      if (!result?.success) {
        setAuthError(result?.error || 'Invalid credentials');
        return;
      }

      setShowAuthModal(false);
      toast.success('Welcome back!');
    } catch (error) {
      setAuthError(error?.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleRegister = async (data) => {
    setAuthSubmitting(true);
    setAuthError('');

    if (data.password !== data.confirmPassword) {
      setAuthError('Passwords do not match.');
      setAuthSubmitting(false);
      return;
    }

    if (data.password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      setAuthSubmitting(false);
      return;
    }

    try {
      const result = await register({
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName || data.username,
      });

      if (!result?.success) {
        setAuthError(result?.error || 'Registration failed');
        return;
      }

      setShowAuthModal(false);
      toast.success('Registration successful!');
    } catch (error) {
      setAuthError(
        error?.response?.data?.error || 'Registration failed. Please try again.'
      );
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/');
    }
  };

  const handleTopicCreated = (topic) => {
    if (topic) setTopics((prev) => [topic, ...prev]);
    setIsModalOpen(false);
    toast.success('Topic created successfully!');
    setActiveTab('forum');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f3f8f3] via-white to-[#fffdf2] px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
          <div className="w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-black/5">
            <div className="bg-gradient-to-br from-[#004d00] via-[#006400] to-[#008000] p-8 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#ffcc00] shadow-lg">
                <FaComments className="text-4xl text-[#006400]" />
              </div>
              <h1 className="text-3xl font-bold text-white">ChatMore</h1>
              <p className="mt-2 text-sm text-white/75">
                Connect with family and friends.
              </p>
            </div>

            <div className="p-8 text-center">
              <p className="mb-6 text-gray-600">
                Sign in or create an account to join discussions and live chat.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                    setShowAuthModal(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006400] px-6 py-3 font-semibold text-white transition hover:bg-[#005500]"
                >
                  <FaSignInAlt /> Login
                </button>

                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                    setShowAuthModal(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffcc00] px-6 py-3 font-semibold text-[#006400] transition hover:bg-[#e6b800]"
                >
                  <FaUserPlus /> Create Account
                </button>
              </div>

              <button
                onClick={() => navigate('/')}
                className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#006400]"
              >
                <FaHome /> Back to Home
              </button>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          mode={authMode}
          setMode={setAuthMode}
          loading={authSubmitting}
          error={authError}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5]">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#004d00] via-[#006400] to-[#008000] text-white shadow-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <FaComments className="text-xl text-[#ffcc00]" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold sm:text-2xl">
                  ChatMore
                </h1>
               
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-white/10 px-3 py-2 text-sm sm:inline-flex">
                <FaUserCircle className="mr-2 mt-0.5" />
                {user?.fullName || user?.username || 'Member'}
              </span>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm transition hover:bg-red-500/30"
              >
                <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
              </button>

              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20"
              >
                <FaHome /> <span className="hidden sm:inline">Home</span>
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:max-w-xl">
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
              <div className="text-lg font-bold">{stats.topics}</div>
              <div className="text-[10px] uppercase tracking-wide text-white/60">
                Topics
              </div>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
              <div className="text-lg font-bold">{stats.replies}</div>
              <div className="text-[10px] uppercase tracking-wide text-white/60">
                Replies
              </div>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
              <div className="text-lg font-bold">LIVE</div>
              <div className="text-[10px] uppercase tracking-wide text-white/60">
                Community
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              activeTab === 'chat'
                ? 'bg-[#006400] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaComments />
            Group Chat
            <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] text-white">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('forum')}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              activeTab === 'forum'
                ? 'bg-[#006400] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaNewspaper />
            Forum Posts
            <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] text-white">
              {stats.topics}
            </span>
          </button>
        </div>

        {activeTab === 'chat' ? (
          <section>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#006400]/30" />
              <h2 className="font-bold text-gray-700">Live Community Chat</h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#006400]/30" />
            </div>
            <ChatRoom />
          </section>
        ) : (
          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#006400] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#005500]"
                >
                  <FaPlus /> New Discussion
                </button>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#006400]"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Viewed</option>
                  <option value="most_replies">Most Replies</option>
                </select>
              </div>

              <div className="relative sm:w-72">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#006400] focus:ring-2 focus:ring-[#006400]/10"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-3xl bg-white shadow-sm">
                <FaSpinner className="animate-spin text-4xl text-[#006400]" />
              </div>
            ) : filteredTopics.length === 0 ? (
              <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm ring-1 ring-black/5">
                <FaComments className="mx-auto mb-4 text-5xl text-gray-300" />
                <h3 className="text-xl font-bold text-gray-700">
                  {searchTerm ? 'No discussions found' : 'No discussions yet'}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  {searchTerm
                    ? 'Try another search.'
                    : 'Start the first community discussion.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-5 rounded-xl bg-[#006400] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Start Discussion
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTopics.map((topic) => {
                  const id = topic._id || topic.id;

                  return (
                    <Link
                      key={id}
                      to={`/forum/topic/${id}`}
                      className="group block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#006400]/10 text-[#006400] sm:flex">
                          <FaUserCircle className="text-2xl" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-[#006400]/10 px-2 py-0.5 text-[10px] font-semibold text-[#006400]">
                              {topic.category || 'General'}
                            </span>

                            {Number(topic.replyCount || 0) > 5 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                                <FaFire /> Hot
                              </span>
                            )}

                            {Number(topic.views || 0) > 50 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                                <FaEye /> Trending
                              </span>
                            )}
                          </div>

                          <h3 className="truncate text-base font-bold text-gray-800 transition group-hover:text-[#006400] sm:text-lg">
                            {topic.title}
                          </h3>

                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {topic.content}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-500">
                            <span>
                              <FaUserCircle className="mr-1 inline text-[#006400]" />
                              {topic.user?.fullName ||
                                topic.user?.full_name ||
                                topic.user?.username ||
                                'Anonymous'}
                            </span>
                            <span>
                              <FaCalendarAlt className="mr-1 inline" />
                              {formatDate(topic.created_at)}
                            </span>
                            <span>
                              <FaComment className="mr-1 inline" />
                              {topic.replyCount || 0} replies
                            </span>
                            <span>
                              <FaEye className="mr-1 inline" />
                              {topic.views || 0} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      <NewTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTopicCreated={handleTopicCreated}
      />
    </div>
  );
}

export default ForumPage;
