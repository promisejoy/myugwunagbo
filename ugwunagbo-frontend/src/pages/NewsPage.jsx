import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaSearch, FaCalendarAlt, FaUser, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { api } from '../api/client';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await api.getNews();
      setNews(response.data || []);
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get unique categories
  const categories = ['All', ...new Set(news.map(item => item.category).filter(Boolean))];

  // Filter news
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="text-5xl text-[#006400] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006400] to-[#008000] text-white py-16">
        <div className="container-custom">
          <div className="text-center">
            <FaNewspaper className="text-5xl mx-auto mb-4 text-[#ffcc00]" />
            <h1 className="text-4xl md:text-5xl font-bold mb-3">News & Updates</h1>
            <p className="text-lg text-[#ffcc00]/80 max-w-2xl mx-auto">
              Stay informed about the latest developments in Ugwunagbo LGA
            </p>
          </div>
        </div>
      </div>
      <div className="container-custom py-4">
  <Link 
    to="/" 
    className="inline-flex items-center text-[#006400] hover:text-[#005a00] font-medium transition-colors"
  >
    <FaArrowLeft className="mr-2" /> Back to Home
  </Link>
</div>

      <div className="container-custom py-8">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#006400] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-[#006400]">{news.length}</p>
              <p className="text-gray-500 text-sm">Total Articles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#006400]">{filteredNews.length}</p>
              <p className="text-gray-500 text-sm">Showing Articles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#006400]">{categories.length - 1}</p>
              <p className="text-gray-500 text-sm">Categories</p>
            </div>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No news found</h3>
            <p className="text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'News articles will appear here once published'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Link
                key={item.id || item._id}
                to={`/news/${item.id || item._id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="h-56 bg-gray-200 relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/006400/ffffff?text=News';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#006400]/10">
                      <FaNewspaper className="text-6xl text-[#006400]/30" />
                    </div>
                  )}
                  {item.category && (
                    <span className="absolute top-4 left-4 bg-[#ffcc00] text-[#006400] text-xs font-bold px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="text-white text-sm flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {formatDate(item.date || item.created_at)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-[#006400] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {item.content}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <FaUser className="mr-2 text-[#006400]" />
                      {item.author || 'Admin'}
                    </span>
                    <span className="text-[#006400] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;