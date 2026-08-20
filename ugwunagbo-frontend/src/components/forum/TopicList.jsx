import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaComments } from 'react-icons/fa';

const TopicList = ({ topics, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="flex gap-3 mb-3">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">No discussions yet</h3>
        <p className="text-gray-400">Be the first to start a discussion!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <Link
          key={topic._id || topic.id}
          to={`/forum/topic/${topic._id || topic.id}`}
          className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors">
                {topic.title || 'Untitled'}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {topic.category || 'General'}
                </span>
                <span className="flex items-center">
                  <FaUser className="mr-1 text-xs" />
                  {topic.author || 'Anonymous'}
                </span>
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-1 text-xs" />
                  {formatDate(topic.createdAt)}
                </span>
                <span className="flex items-center text-primary-600">
                  💬 {topic.replyCount || 0} replies
                </span>
                <span className="flex items-center text-gray-400">
                  👁️ {topic.views || 0} views
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {topic.content || 'No content available'}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TopicList;