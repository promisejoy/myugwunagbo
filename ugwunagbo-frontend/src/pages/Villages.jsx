import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaMapMarkerAlt, FaUsers, FaSearch, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const Villages = () => {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      setLoading(true);
      const response = await api.getVillages();
      setVillages(response.data || []);
    } catch (error) {
      console.error('Error loading villages:', error);
      toast.error('Failed to load villages');
    } finally {
      setLoading(false);
    }
  };

  const filteredVillages = villages.filter(village =>
    village.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.ward?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <FaHome className="text-5xl mx-auto mb-4 text-[#ffcc00]" />
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Villages Directory</h1>
            <p className="text-lg text-[#ffcc00]/80 max-w-2xl mx-auto">
              Explore the communities that make up Ugwunagbo Local Government Area
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search villages by name, ward, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-[#006400]">{villages.length}</p>
              <p className="text-gray-500 text-sm">Total Villages</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#006400]">{filteredVillages.length}</p>
              <p className="text-gray-500 text-sm">Showing Villages</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#006400]">
                {new Set(villages.map(v => v.ward).filter(Boolean)).size}
              </p>
              <p className="text-gray-500 text-sm">Wards Represented</p>
            </div>
          </div>
        </div>

        {/* Villages Grid */}
        {filteredVillages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No villages found</h3>
            <p className="text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Villages will appear here once added'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVillages.map((village) => (
              <div key={village.id || village._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#006400] group">
                <div className="bg-[#006400] p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white">
                    <FaMapMarkerAlt className="text-[#ffcc00]" />
                    <span className="font-semibold">{village.name}</span>
                  </div>
                  {village.ward && (
                    <span className="bg-[#ffcc00] text-[#006400] text-xs font-bold px-3 py-1 rounded-full">
                      Ward {village.ward}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  {village.description && (
                    <p className="text-gray-600 text-sm mb-3">{village.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {village.population && (
                      <span className="flex items-center">
                        <FaUsers className="mr-1 text-[#006400]" />
                        Pop: {village.population}
                      </span>
                    )}
                    {village.location && (
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-[#006400]" />
                        {village.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-[#006400] hover:bg-[#005a00] text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Villages;