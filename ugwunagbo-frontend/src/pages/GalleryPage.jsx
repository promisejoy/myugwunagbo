import React, { useState, useEffect, useRef } from 'react';
import { 
  FaImages, FaVideo, FaPlay, FaTimes, FaChevronLeft, FaChevronRight,
  FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaVolumeDown,
  FaSpinner, FaExclamationTriangle, FaCalendarAlt, FaClock
} from 'react-icons/fa';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/${path}`;
};

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('images');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const modalVideoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await api.getGallery();
      setItems(response.data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.type === (activeTab === 'images' ? 'image' : 'video'));

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatVideoTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openModal = (item, index) => {
    setSelectedItem(item);
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  };

  const navigateModal = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredItems.length
      : (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  };

  const toggleVideoPlay = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !modalVideoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (modalVideoRef.current) {
      modalVideoRef.current.volume = newVolume;
      modalVideoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    const element = modalVideoRef.current;
    if (!document.fullscreenElement && element) {
      element.requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateModal('prev');
      if (e.key === 'ArrowRight') navigateModal('next');
      if (e.key === ' ') {
        e.preventDefault();
        if (selectedItem?.type === 'video') toggleVideoPlay();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedItem, currentIndex]);

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
            <FaImages />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ugwunagbo Gallery</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Explore images and videos showcasing our community, culture, and progress
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-custom py-6">
        <div className="flex justify-center gap-3 md:gap-4 mb-8">
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'images'
                ? 'bg-[#006400] text-white shadow-lg shadow-[#006400]/30'
                : 'bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            <FaImages /> Images
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'videos'
                ? 'bg-[#006400] text-white shadow-lg shadow-[#006400]/30'
                : 'bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            <FaVideo /> Videos
          </button>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl text-gray-300 mb-4">
              {activeTab === 'images' ? <FaImages /> : <FaVideo />}
            </div>
            <h3 className="text-xl font-semibold text-gray-600">No {activeTab} Available</h3>
            <p className="text-gray-400 mt-2">
              {activeTab === 'images' ? 'Images' : 'Videos'} will appear here once uploaded through the admin dashboard
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item._id || index}
                onClick={() => openModal(item, index)}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {item.type === 'image' ? (
                    <img
                      src={getImageUrl(item.file_url)}
                      alt={item.description || 'Gallery image'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400/006400/ffffff?text=Image';
                      }}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        src={getImageUrl(item.file_url)}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <FaPlay className="text-[#006400] text-2xl ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                  {item.type === 'video' && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FaVideo className="text-xs" />
                      <span>Video</span>
                    </div>
                  )}
                </div>
                {item.description && (
                  <div className="p-3 md:p-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <FaCalendarAlt className="mr-1" />
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 text-white/70 hover:text-white text-2xl p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <FaTimes />
          </button>

          <button
            onClick={() => navigateModal('prev')}
            className="absolute left-4 z-50 text-white/70 hover:text-white text-xl p-3 rounded-full hover:bg-white/10 transition-colors hidden md:block"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={() => navigateModal('next')}
            className="absolute right-4 z-50 text-white/70 hover:text-white text-xl p-3 rounded-full hover:bg-white/10 transition-colors hidden md:block"
          >
            <FaChevronRight />
          </button>

          <div className="relative w-full max-w-5xl max-h-[90vh] bg-black rounded-lg overflow-hidden">
            <div className="relative flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              {selectedItem.type === 'image' ? (
                <img
                  src={getImageUrl(selectedItem.file_url)}
                  alt={selectedItem.description || 'Gallery image'}
                  className="max-w-full max-h-[80vh] object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600/006400/ffffff?text=Image';
                  }}
                />
              ) : (
                <video
                  ref={modalVideoRef}
                  src={getImageUrl(selectedItem.file_url)}
                  className="max-w-full max-h-[80vh] object-contain"
                  controls={false}
                  playsInline
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                />
              )}
            </div>

            {selectedItem.type === 'video' && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleVideoPlay}
                    className="text-white hover:text-[#ffcc00] transition-colors"
                  >
                    {isVideoPlaying ? '⏸' : '▶'}
                  </button>
                  <span className="text-white text-sm font-mono">
                    {modalVideoRef.current ? 
                      `${formatVideoTime(modalVideoRef.current.currentTime)} / ${formatVideoTime(modalVideoRef.current.duration)}` :
                      '0:00 / 0:00'
                    }
                  </span>
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-[#ffcc00] transition-colors"
                  >
                    {isMuted || volume === 0 ? <FaVolumeMute /> : volume < 0.5 ? <FaVolumeDown /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-[#ffcc00]"
                  />
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-[#ffcc00] transition-colors ml-auto"
                  >
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>
              </div>
            )}

            {selectedItem.description && (
              <div className="bg-white p-4 text-center">
                <p className="text-gray-800">{selectedItem.description}</p>
                <p className="text-sm text-gray-400 mt-1">
                  <FaCalendarAlt className="inline mr-1" />
                  {formatDate(selectedItem.createdAt)}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 md:hidden">
            <button
              onClick={() => navigateModal('prev')}
              className="text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <FaChevronLeft className="text-2xl" />
            </button>
            <span className="text-white/50 text-sm flex items-center">
              {currentIndex + 1} / {filteredItems.length}
            </span>
            <button
              onClick={() => navigateModal('next')}
              className="text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <FaChevronRight className="text-2xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;