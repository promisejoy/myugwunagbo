import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { api } from '../api/client';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [id]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await api.getNews();
      const found = response.data.find(item => item._id === id || item.id === id);
      if (found) {
        setNews(found);
      } else {
        toast.error('News article not found');
      }
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loader />;

  if (!news) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-600">News article not found</h2>
        <Link to="/" className="text-primary-600 hover:underline mt-4 inline-block">
          <FaArrowLeft className="inline mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <Link to="/" className="text-primary-600 hover:underline inline-flex items-center mb-6">
        <FaArrowLeft className="mr-2" /> Back to Home
      </Link>

      <article className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {news.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            {formatDate(news.date || news.createdAt)}
          </span>
          <span className="flex items-center">
            <FaUser className="mr-2" />
            Ugwunagbo LGA
          </span>
        </div>

        {news.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-auto max-h-[500px] object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x500?text=News+Image';
              }}
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {typeof news.content === 'string' ? (
            news.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
            ))
          ) : (
            <p>{news.content}</p>
          )}
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;