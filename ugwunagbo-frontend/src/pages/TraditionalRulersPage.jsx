import React, { useState, useEffect } from 'react';
import { FaCrown, FaMapMarkerAlt, FaCalendarAlt, FaPhone, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/${path}`;
};

const TraditionalRulersPage = () => {
  const [rulers, setRulers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRulers();
  }, []);

  const loadRulers = async () => {
    try {
      setLoading(true);
      const response = await api.getTraditionalRulers();
      setRulers(response.data || []);
    } catch (error) {
      console.error('Error loading rulers:', error);
      toast.error('Failed to load traditional rulers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#006400] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#006400] to-[#008000] text-white py-16 md:py-24 text-center">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNHYtNGgtNHpNNiAzNHYtNEg0djRIMHYyaDR2NGgydi00aDR2LTJINnpNNiA0VjBINHY0SDB2Mmg0djRoMlY2aDRWNEg2eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        <div className="container-custom relative z-10">
          <div className="flex justify-center text-5xl md:text-6xl mb-4">
            <FaCrown />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Traditional Rulers</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            The custodians of our culture and tradition
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        {rulers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FaCrown className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Traditional Rulers Added Yet</h3>
            <p className="text-gray-400">Traditional rulers will appear here once uploaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {rulers.map((ruler) => (
              <div key={ruler._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-64 bg-[#006400]/10 relative">
                  {ruler.image ? (
                    <img 
                      src={getImageUrl(ruler.image)}
                      alt={ruler.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/006400/ffffff?text=Traditional+Ruler';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#006400]/5">
                      <FaCrown className="text-6xl text-[#006400]/30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-[#006400] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {ruler.title || 'Traditional Ruler'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{ruler.name}</h3>
                  <p className="text-[#006400] font-medium">{ruler.role || 'Traditional Leader'}</p>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#006400]" />
                      <span>{ruler.village || 'Ugwunagbo'}</span>
                    </div>
                    {ruler.year && (
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#006400]" />
                        <span>Since {ruler.year}</span>
                      </div>
                    )}
                  </div>
                  {ruler.bio && (
                    <p className="mt-3 text-gray-600 text-sm line-clamp-3">{ruler.bio}</p>
                  )}
                  {(ruler.phone || ruler.email) && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                      {ruler.phone && (
                        <a href={`tel:${ruler.phone}`} className="text-[#006400] hover:text-[#005a00]">
                          <FaPhone />
                        </a>
                      )}
                      {ruler.email && (
                        <a href={`mailto:${ruler.email}`} className="text-[#006400] hover:text-[#005a00]">
                          <FaEnvelope />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TraditionalRulersPage;