import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaUserGraduate, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/${path}`;
};

const AcademiaPage = () => {
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAcademics();
  }, []);

  const loadAcademics = async () => {
    try {
      setLoading(true);
      const response = await api.getAcademia();
      setAcademics(response.data || []);
    } catch (error) {
      console.error('Error loading academics:', error);
      toast.error('Failed to load academia');
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
            <FaGraduationCap />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Academia</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Celebrating our highly educated sons and daughters
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        {academics.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FaUserGraduate className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Academicians Added Yet</h3>
            <p className="text-gray-400">Academicians will appear here once uploaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {academics.map((person) => (
              <div key={person._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-64 bg-gradient-to-r from-[#006400] to-[#008000] flex items-center justify-center">
                  {person.photo ? (
                    <img 
                      src={getImageUrl(person.photo)}
                      alt={person.full_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/006400/ffffff?text=Academician';
                      }}
                    />
                  ) : (
                    <FaUserGraduate className="text-6xl text-white/50" />
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm text-[#006400] font-medium">{person.title || 'Academician'}</div>
                  <h3 className="text-xl font-bold text-gray-800 mt-1">{person.full_name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-2">
                    <FaMapMarkerAlt className="text-[#006400] mr-2" />
                    <span>{person.village || 'Ugwunagbo'}</span>
                  </div>
                  {person.qualification && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-sm leading-relaxed">{person.qualification}</p>
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

export default AcademiaPage;