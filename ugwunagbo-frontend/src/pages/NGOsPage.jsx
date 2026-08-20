import React, { useState, useEffect } from 'react';
import { FaHandsHelping, FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaEnvelope, FaPhone, FaSpinner } from 'react-icons/fa';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/${path}`;
};

const NGOsPage = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    try {
      setLoading(true);
      const response = await api.getNGOs();
      setNgos(response.data || []);
    } catch (error) {
      console.error('Error loading NGOs:', error);
      toast.error('Failed to load NGOs');
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
            <FaHandsHelping />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">NGOs & Foundations</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Organizations working for the development of Ugwunagbo LGA
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        {ngos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FaHandsHelping className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No NGOs Added Yet</h3>
            <p className="text-gray-400">NGOs will appear here once uploaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {ngos.map((ngo) => (
              <div key={ngo._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#006400]/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {ngo.logo ? (
                      <img 
                        src={getImageUrl(ngo.logo)}
                        alt={ngo.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50/006400/ffffff?text=NGO';
                        }}
                      />
                    ) : (
                      <FaHandsHelping className="text-2xl text-[#006400]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{ngo.name}</h3>
                    <span className="inline-block bg-[#006400]/10 text-[#006400] text-sm px-2 py-0.5 rounded">
                      {ngo.type || 'Organization'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{ngo.description || 'No description available'}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  {ngo.location && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#006400]" />
                      <span>{ngo.location}</span>
                    </div>
                  )}
                  {ngo.yearFounded && (
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[#006400]" />
                      <span>Founded: {ngo.yearFounded}</span>
                    </div>
                  )}
                  {ngo.focusArea && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Focus:</span>
                      <span>{ngo.focusArea}</span>
                    </div>
                  )}
                </div>

                {(ngo.website || ngo.email || ngo.phone) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                    {ngo.website && (
                      <a href={ngo.website} target="_blank" rel="noopener noreferrer" 
                         className="text-[#006400] hover:text-[#005a00] flex items-center gap-1 text-sm">
                        <FaGlobe /> Website
                      </a>
                    )}
                    {ngo.email && (
                      <a href={`mailto:${ngo.email}`} className="text-[#006400] hover:text-[#005a00] flex items-center gap-1 text-sm">
                        <FaEnvelope /> Email
                      </a>
                    )}
                    {ngo.phone && (
                      <a href={`tel:${ngo.phone}`} className="text-[#006400] hover:text-[#005a00] flex items-center gap-1 text-sm">
                        <FaPhone /> Call
                      </a>
                    )}
                  </div>
                )}

                {ngo.projects && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-1">Key Projects</h4>
                    <p className="text-gray-600 text-sm">{ngo.projects}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOsPage;