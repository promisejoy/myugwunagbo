import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserCircle, FaBalanceScale, FaMoneyBillWave, FaClipboardList, 
  FaHeartbeat, FaGavel, FaVoteYea, FaShieldAlt, FaIdCard, FaHome,
  FaHandHoldingUsd, FaMapMarkedAlt, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaClock, FaCalendarAlt, FaRing, FaMusic, FaUtensils, FaMask, FaDrum,
  FaTheaterMasks, FaArrowRight, FaHistory, FaUsers, FaNewspaper,
  FaHandshake, FaBuilding, FaFacebookF, FaTwitter, FaInstagram, FaYoutube,
  FaUserCog 
} from 'react-icons/fa';
import HeroCarousel from '../components/common/HeroCarousel';
import { api } from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// ===== IMPORTANT: This is the URL where your backend serves images =====
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ===== SIMPLE IMAGE URL FUNCTION =====
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.log('⚠️ getImageUrl: No path provided');
    return null;
  }
  
  console.log('🔍 getImageUrl: Processing path:', imagePath);
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /uploads, prepend the API URL
  if (imagePath.startsWith('/uploads')) {
    const fullUrl = `${API_BASE_URL}${imagePath}`;
    console.log('✅ getImageUrl: Path with /uploads ->', fullUrl);
    return fullUrl;
  }
  
  // If it starts with uploads (no slash), add slash and prepend
  if (imagePath.startsWith('uploads/')) {
    const fullUrl = `${API_BASE_URL}/${imagePath}`;
    console.log('✅ getImageUrl: Path with uploads/ ->', fullUrl);
    return fullUrl;
  }
  
  // Otherwise, assume it's just a filename
  const fullUrl = `${API_BASE_URL}/uploads/${imagePath}`;
  console.log('✅ getImageUrl: Assuming filename ->', fullUrl);
  return fullUrl;
};

// ===== FALLBACK IMAGES =====
const fallbackImages = {
  governor: 'https://via.placeholder.com/200x200/006400/ffffff?text=Governor',
  leader: 'https://via.placeholder.com/400x300/006400/ffffff?text=Leader',
  news: 'https://via.placeholder.com/400x300/006400/ffffff?text=News',
  default: 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image',
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [governor, setGovernor] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [governorRes, leadersRes, newsRes] = await Promise.all([
        api.getGovernor().catch(() => ({ data: null })),
        api.getLeaders().catch(() => ({ data: [] })),
        api.getNews().catch(() => ({ data: [] }))
      ]);
      
      console.log('📸 Governor data:', governorRes.data);
      console.log('📸 Leaders data:', leadersRes.data);
      
      setGovernor(governorRes.data || null);
      setLeaders(leadersRes.data || []);
      setNews(newsRes.data || []);
    } catch (error) {
      console.error('Error loading home data:', error);
      toast.error('Failed to load some content');
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

  // Stats Data
  const stats = [
    { number: '30+', label: 'Years of Service', icon: FaHistory },
    { number: '100,000K+', label: 'Residents', icon: FaUsers },
    { number: '27', label: 'Autonomous Communities', icon: FaBuilding },
    { number: '100%', label: 'Hospitable', icon: FaHandshake },
  ];

  const services = [
    { icon: FaIdCard, title: 'Civil Registration', description: 'Birth, marriage and Local Govt. Of Origin registration services for all residents of Ugwunagbo LGA.' },
    { icon: FaHome, title: 'Revenue Collection', description: 'Payment of taxes, levies, and other revenue obligations to the local government.' },
    { icon: FaHandHoldingUsd, title: 'Social Welfare', description: 'Support programs for vulnerable groups including women, children, and the elderly.' },
    { icon: FaMapMarkedAlt, title: 'Villages Directory', description: 'Explore the list of villages in Ugwunagbo Local Government Area.' },
  ];

 const departments = [
  { icon: FaBalanceScale, title: 'Administration', description: 'General administration and coordination of local government activities.', link: '/department/admin' },
  { icon: FaClipboardList, title: 'Budget & Planning', description: 'Strategic planning, budget preparation, and financial resource allocation.', link: '/department/budget-planning' },
  { icon: FaMoneyBillWave, title: 'Finance', description: 'Management of local government finances and revenue collection.', link: '/department/finance' },
  { icon: FaHeartbeat, title: 'Health', description: 'Public health services and primary healthcare delivery.', link: '/department/health' },
  { icon: FaGavel, title: 'Judiciary', description: 'Legal affairs, dispute resolution, and justice administration.', link: '/department/judiciary' },
  { icon: FaVoteYea, title: 'INEC', description: 'Independent National Electoral Commission - Voter registration and electoral processes.', link: '/department/inec' },
  { icon: FaClipboardList, title: 'Planning', description: 'Development planning and project implementation.', link: '/department/planning' },
  { icon: FaShieldAlt, title: 'Security', description: 'Public safety, law enforcement coordination, and community security.', link: '/department/security' },
];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#006400] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      

      <HeroCarousel />

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
           
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50">
                <div className="text-4xl text-[#006400] mb-3 flex justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <stat.icon />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[#006400] mb-1">{stat.number}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
                <div className="w-12 h-1 bg-[#ffcc00] mx-auto mt-3 rounded-full transition-all duration-500 group-hover:w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">About Ugwunagbo LGA</h2>
            <div className="w-24 h-1 bg-[#ffcc00] mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="about-text space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Our History & Vision</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                Ugwunagbo is a Local Government Area (LGA) in Abia State, located in the southeastern region of Nigeria. It shares boundaries with Aba South, Obingwa, and Ukwa East Local Government Areas, and serves as part of the greater Aba metropolitan area.
              </p>
              <p className="text-gray-600 leading-relaxed text-base">
                Ugwunagbo LGA is an agrarian community with a history tied to the Ngwa people. Its development was influenced by its proximity to Aba and the construction of the Eastern Railway.
              </p>
              <div className="pt-4">
                <Link to="/about" className="inline-flex items-center gap-2 bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 hover:-translate-y-0.5 group">
                  Read Full History
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            <div className="about-image relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#006400]/20 to-[#ffcc00]/20 rounded-2xl blur-xl"></div>
              <img 
                src="/img/map igwu.png" 
                alt="Ugwunagbo LGA Landscape" 
                className="w-full rounded-2xl shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-700"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Ugwunagbo+LGA+Map';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== GOVERNOR SECTION ===== */}
      <section id="governor" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Executive Governor</h2>
            <p className="text-gray-500 mt-2 text-lg">At The State Level</p>
            <div className="w-24 h-1 bg-[#ffcc00] mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="governor-content max-w-md mx-auto text-center">
            {governor && governor.name ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50">
                <div className="relative inline-block">
                  {governor.image ? (
                    <img 
                      src={getImageUrl(governor.image)}
                      alt={governor.name}
                      className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-[#006400] shadow-lg transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        console.log('⚠️ Governor image failed to load:', governor.image);
                        e.target.src = fallbackImages.governor;
                      }}
                    />
                  ) : (
                    <FaUserCircle className="text-8xl text-gray-300 mx-auto" />
                  )}
                 
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">{governor.name}</h3>
                <p className="text-[#006400] font-semibold">Executive Governor</p>
                {governor.bio && (
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">{governor.bio}</p>
                )}
                <div className="w-16 h-1 bg-[#ffcc00] mx-auto mt-4 rounded-full"></div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 border-2 border-dashed border-gray-200">
                <FaUserCircle className="text-7xl text-gray-300 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-500">Governor information will appear here once uploaded</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== LEADERSHIP SECTION ===== */}
      <section id="leadership" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Our Leadership</h2>
            <p className="text-gray-500 mt-2 text-lg">Meet the dedicated team leading Ugwunagbo LGA</p>
            <div className="w-24 h-1 bg-[#ffcc00] mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-50 rounded-2xl p-12 border-2 border-dashed border-gray-200">
                  <FaUsers className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Leadership team will appear here once added</p>
                </div>
              </div>
            ) : (
              leaders.map((leader, index) => (
                <div key={leader._id || index} className="group bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50">
                  <div className="h-56 bg-gradient-to-br from-[#006400]/10 to-[#006400]/5 relative overflow-hidden">
                    {leader.image ? (
                      <img 
                        src={getImageUrl(leader.image)}
                        alt={leader.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          console.log('⚠️ Leader image failed to load:', leader.image);
                          e.target.src = fallbackImages.leader;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUserCircle className="text-6xl text-[#006400]/20 transition-transform duration-500 group-hover:scale-110" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-6 relative">
                    <h3 className="text-xl font-bold text-gray-800 mt-2 group-hover:text-[#006400] transition-colors duration-300">{leader.name}</h3>
                    <p className="text-[#006400] font-semibold text-sm">{leader.position}</p>
                    {leader.bio && (
                      <p className="text-gray-600 text-sm mt-3 line-clamp-2 leading-relaxed">{leader.bio}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Our Cultural Heritage</h2>
            <p className="text-gray-500 mt-2 text-lg">Celebrating the rich cultural traditions of Ugwunagbo LGA</p>
            <div className="w-24 h-1 bg-[#ffcc00] mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Culture Card 1 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="h-64 bg-[#006400]/10 relative overflow-hidden">
                <img src="/img/marriage.jpeg" alt="Marriage Customs" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#006400] transition-colors duration-300">Marriage Customs (Igba nkwu)</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">Marriage customs in Ugwunagbo involve a multi-stage traditional process...</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1">
                    <FaCalendarAlt className="text-[#006400] flex-shrink-0" />
                    <span>Practiced among every home</span>
                  </li>
                  <li className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1">
                    <FaMapMarkerAlt className="text-[#006400] flex-shrink-0" />
                    <span>Celebrated across all communities</span>
                  </li>
                  <li className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1">
                    <FaUserCircle className="text-[#006400] flex-shrink-0" />
                    <span>Community-wide participation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Culture Card 2 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="h-64 bg-[#006400]/10 relative overflow-hidden">
                <img src="/img/palm process.jpeg" alt="Palm Processing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#006400] transition-colors duration-300">Palm Processing</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">The transformation of palm fruit into palm oil is a cornerstone of Ugwunagbo's heritage.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1">
                    <FaRing className="text-[#006400] flex-shrink-0" />
                    <span>Rich In Red Oil Production</span>
                  </li>
                  <li className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1">
                    <FaMusic className="text-[#006400] flex-shrink-0" />
                    <span>Used In Producing Palm Kernel</span>
                  </li>
                  <li className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1">
                    <FaUtensils className="text-[#006400] flex-shrink-0" />
                    <span>Used In Producing Tiles</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Culture Card 3 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="h-64 bg-[#006400]/10 relative overflow-hidden">
                <img src="/img/masq.jpeg" alt="Masquerade Festival" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#006400] transition-colors duration-300">Masquerade Festival (Mmanwu)</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">A vibrant display of colorful costumes, traditional music, and dance.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1">
                    <FaMask className="text-[#006400] flex-shrink-0" />
                    <span>Various types of masquerades</span>
                  </li>
                  <li className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1">
                    <FaDrum className="text-[#006400] flex-shrink-0" />
                    <span>Traditional musical instruments</span>
                  </li>
                  <li className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1">
                    <FaTheaterMasks className="text-[#006400] flex-shrink-0" />
                    <span>Cultural performances</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION - UPDATED ===== */}
      <section id="services" className="py-20 bg-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Our Services</h2>
            <p className="text-gray-500 mt-2 text-lg">Quality services delivered with excellence</p>
            <div className="w-24 h-1 bg-[#ffcc00] mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden">
                <div className="bg-[#006400] p-6 text-4xl text-white flex justify-center items-center h-28 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
                  <service.icon className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                </div>
                <div className="p-6 flex-grow text-left">
                  <h3 className="text-xl font-bold text-[#006400] mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Single Apply Now Button at the bottom of Services Section */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-6 text-lg">
              Ready to apply for any of our services?
            </p>
            <Link 
              to="/apply-for-service" 
              className="inline-flex items-center bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 group text-lg"
            >
              <FaClipboardList className="mr-3 text-2xl" />
              <span>Apply Now</span>
              <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Our Departments</h2>
            <p className="text-gray-500 mt-2 text-lg">Explore our specialized departments serving the community</p>
            <div className="w-24 h-1 bg-[#ffcc00] mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <Link 
                key={index}
                to={dept.link} 
                className="group bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:bg-[#006400] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#006400] to-[#005a00] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl text-[#006400] group-hover:text-[#ffcc00] mb-3 flex justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <dept.icon />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-white mb-2">{dept.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-100 text-sm">{dept.description}</p>
                  <span className="inline-flex items-center gap-1 text-[#006400] group-hover:text-[#ffcc00] font-semibold text-sm mt-3 transition-all duration-300 group-hover:gap-2">
                    Learn More <FaArrowRight className="text-xs" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      {/* News Section */}
<section id="news" className="py-20 bg-white relative overflow-hidden">
  <div className="container-custom relative z-10">
    <div className="text-center mb-16">
      <span className="inline-block bg-[#ffcc00]/20 text-[#006400] px-4 py-1 rounded-full text-sm font-semibold tracking-wide mb-3">UPDATES</span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Latest News</h2>
      <div className="w-24 h-1 bg-[#ffcc00] mx-auto mt-4 rounded-full"></div>
    </div>
    
    {news.length === 0 ? (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-2xl p-12 border-2 border-dashed border-gray-200">
          <FaNewspaper className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No news articles available</p>
        </div>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.slice(0, 3).map((item, index) => (
            <Link 
              key={item._id || index} 
              to={`/news/${item._id || item.id}`} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50"
            >
              <div className="h-56 bg-[#006400]/10 relative overflow-hidden">
                {item.image ? (
                  <img 
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      console.log('⚠️ News image failed to load:', item.image);
                      e.target.src = fallbackImages.news;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaNewspaper className="text-6xl text-[#006400]/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 bg-[#ffcc00] text-[#006400] text-xs font-bold px-3 py-1 rounded-full">
                  {formatDate(item.date || item.createdAt)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-[#006400]">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.content}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[#006400] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    Read More <FaArrowRight className="text-xs" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Show "View All News" button only if there are more than 3 news items */}
        {news.length > 3 && (
          <div className="text-center mt-12">
            <Link 
              to="/news" 
              className="inline-flex items-center gap-2 bg-[#006400] hover:bg-[#005a00] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 group"
            >
              View All News
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </>
    )}
  </div>
</section>
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Contact Us</h2>
            <div className="w-24 h-1 bg-[#ffcc00] mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#006400] rounded-2xl p-8 shadow-2xl text-white transform hover:scale-[1.01] transition-transform duration-500">
              <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group cursor-pointer">
                  <div className="text-2xl text-[#ffcc00] mt-1 transition-transform duration-300 group-hover:scale-110">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ffcc00]">Address</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      Ugwunagbo Local Government Secretariat,<br />Ugwunagbo, Abia State, Nigeria
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group cursor-pointer">
                  <div className="text-2xl text-[#ffcc00] mt-1 transition-transform duration-300 group-hover:scale-110">
                    <FaPhone />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ffcc00]">Phone</h4>
                    <p className="text-gray-200 text-sm">+234 7032270247</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group cursor-pointer">
                  <div className="text-2xl text-[#ffcc00] mt-1 transition-transform duration-300 group-hover:scale-110">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ffcc00]">Email</h4>
                    <p className="text-gray-200 text-sm">smartdevtechs@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group cursor-pointer">
                  <div className="text-2xl text-[#ffcc00] mt-1 transition-transform duration-300 group-hover:scale-110">
                    <FaClock />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ffcc00]">Office Hours</h4>
                    <p className="text-gray-200 text-sm">Monday - Friday: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-[#ffcc00]/20">
  <div className="flex space-x-4">
    <a 
      href="https://web.facebook.com/p/Ugwunagbo-L-G-A-100078652665899/?_rdc=1&_rdr#"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-[#ffcc00]/20 rounded-full flex items-center justify-center hover:bg-[#ffcc00] transition-colors duration-300 group"
      aria-label="Facebook"
    >
      <FaFacebookF className="text-[#ffcc00] group-hover:text-[#006400]" />
    </a>
    <a 
      href="https://x.com/UgwunagboCarn"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-[#ffcc00]/20 rounded-full flex items-center justify-center hover:bg-[#ffcc00] transition-colors duration-300 group"
      aria-label="Twitter"
    >
      <FaTwitter className="text-[#ffcc00] group-hover:text-[#006400]" />
    </a>
    <a 
      href="https://www.instagram.com/ugwunagbocarnival/"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-[#ffcc00]/20 rounded-full flex items-center justify-center hover:bg-[#ffcc00] transition-colors duration-300 group"
      aria-label="Instagram"
    >
      <FaInstagram className="text-[#ffcc00] group-hover:text-[#006400]" />
    </a>
    <a 
      href="https://www.youtube.com/watch?v=_avhi4oZEQ0"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-[#ffcc00]/20 rounded-full flex items-center justify-center hover:bg-[#ffcc00] transition-colors duration-300 group"
      aria-label="YouTube"
    >
      <FaYoutube className="text-[#ffcc00] group-hover:text-[#006400]" />
    </a>
  </div>
</div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-[1.01] transition-transform duration-500">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all duration-300" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" placeholder="Your Email" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all duration-300" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input type="text" placeholder="Subject" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all duration-300" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea placeholder="Your Message" rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all duration-300 resize-y" />
                </div>
                <button type="submit" className="w-full bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                  <span>Send Message</span>
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;