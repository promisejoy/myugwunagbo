import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FaLandmark, 
  FaBars, 
  FaTimes, 
  FaUserShield, 
  FaSignOutAlt,
  FaCog,
  FaUserCircle,
  FaNewspaper,
  FaHome,
  FaInfoCircle,
  FaServicestack,
  FaComments,
  FaCrown,
  FaHandsHelping,
  FaGraduationCap,
  FaPhotoVideo,
  FaEnvelope,
  FaClipboardList // Add this import
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/about', label: 'About Us', icon: FaInfoCircle },
    { to: '/services', label: 'Services', icon: FaServicestack },
    { to: '/forum', label: 'Diaspora Forum', icon: FaComments },
    { to: '/traditional-rulers', label: 'Traditional Rulers', icon: FaCrown },
    { to: '/ngos', label: 'NGOs & Foundations', icon: FaHandsHelping },
    { to: '/academia', label: 'Academia', icon: FaGraduationCap },
    { to: '/department/budget-planning', label: 'Budget & Planning', icon: FaClipboardList }, // Add this line
    { to: '/news', label: 'News', icon: FaNewspaper },
    { to: '/gallery', label: 'Gallery', icon: FaPhotoVideo },
    { to: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-[#006400] shadow-md sticky top-0 z-50 w-full overflow-hidden">
        <div className="container-custom px-3 sm:px-4">
          <div className="flex items-center justify-between py-2 md:py-3">
            {/* Logo - Always visible */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#ffcc00] rounded-full flex items-center justify-center text-[#006400] flex-shrink-0">
                <FaLandmark className="text-base sm:text-xl md:text-2xl" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white truncate">Ugwunagbo LGA</h1>
                <p className="text-[8px] sm:text-[10px] md:text-xs text-[#ffcc00]/80 hidden xs:block truncate">Abia State, Nigeria</p>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <span className="flex items-center whitespace-nowrap">
                  <span className="mr-1">📞</span> +234 7032270247
                </span>
                <span className="hidden xl:inline">|</span>
                <span className="hidden xl:flex items-center whitespace-nowrap">
                  <span className="mr-1">✉️</span> smartdevtechs@gmail.com
                </span>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 bg-[#ffcc00] text-[#006400] px-3 py-1.5 rounded-lg hover:bg-[#e6b800] transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    <FaCog className="text-sm" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <span className="text-sm font-medium text-[#ffcc00] hidden xl:inline-flex items-center gap-1 whitespace-nowrap">
                    <FaUserCircle className="text-sm" />
                    {user?.fullName || user?.username || 'Admin'}
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors whitespace-nowrap"
                  >
                    <FaSignOutAlt />
                    <span className="hidden xl:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 bg-[#ffcc00] text-[#006400] px-4 py-2 rounded-lg hover:bg-[#e6b800] transition-colors text-sm font-semibold whitespace-nowrap"
                >
                  <FaUserShield />
                  <span>Admin</span>
                </Link>
              )}
            </div>

            {/* Mobile Header Controls - Hidden on desktop */}
            <div className="flex lg:hidden items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 bg-[#ffcc00] text-[#006400] px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg hover:bg-[#e6b800] transition-colors text-xs font-medium whitespace-nowrap"
                  >
                    <FaCog className="text-xs sm:text-sm" />
                    <span className="hidden xs:inline">Dashboard</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 transition-colors px-1 whitespace-nowrap"
                  >
                    <FaSignOutAlt className="text-xs sm:text-sm" />
                    <span className="hidden xs:inline">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 bg-[#ffcc00] text-[#006400] px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg hover:bg-[#e6b800] transition-colors text-xs font-semibold whitespace-nowrap"
                >
                  <FaUserShield className="text-xs sm:text-sm" />
                  <span className="hidden xs:inline">Admin</span>
                </Link>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 sm:p-2 text-white hover:text-[#ffcc00] transition-colors flex-shrink-0"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes size={20} className="sm:w-6 sm:h-6" /> : <FaBars size={20} className="sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div 
            className={`${
              isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
            } lg:hidden overflow-hidden transition-all duration-300 ease-in-out`}
          >
            <div className="py-3 border-t border-[#ffcc00]/20">
              {/* Mobile User Info */}
              {isAuthenticated && (
                <div className="px-3 py-2 mb-2 bg-[#ffcc00]/10 rounded-lg flex items-center gap-2">
                  <FaUserCircle className="text-[#ffcc00] text-lg sm:text-xl flex-shrink-0" />
                  <span className="text-sm text-white font-medium truncate">
                    {user?.fullName || user?.username || 'Admin'}
                  </span>
                </div>
              )}

              <ul className="flex flex-col space-y-1 max-h-[60vh] overflow-y-auto">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-[#ffcc00] text-[#006400]'
                              : 'text-white/80 hover:bg-[#ffcc00]/20 hover:text-white'
                          }`
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="text-base sm:text-lg flex-shrink-0" />
                        <span className="truncate">{link.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
                
                {/* Mobile Logout */}
                {isAuthenticated && (
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors w-full"
                    >
                      <FaSignOutAlt className="text-base sm:text-lg flex-shrink-0" />
                      <span>Logout</span>
                    </button>
                  </li>
                )}
              </ul>

              {/* Mobile Contact Info */}
              <div className="mt-4 pt-4 border-t border-[#ffcc00]/20 px-3 space-y-1.5">
                <p className="text-xs text-white/60 flex items-center gap-2 truncate">
                  <span className="flex-shrink-0">📞</span> +234 7032270247
                </p>
                <p className="text-xs text-white/60 flex items-center gap-2 truncate">
                  <span className="flex-shrink-0">✉️</span> smartdevtechs@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:block py-2 overflow-x-auto">
            <ul className="flex flex-wrap items-center space-x-1">
              {navLinks.map((link) => (
                <li key={link.to} className="flex-shrink-0">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block py-1.5 px-2.5 rounded-lg text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[#ffcc00] text-[#006400]'
                          : 'text-white/80 hover:bg-[#ffcc00]/20 hover:text-white'
                      }`
                    }
                  >
                    {link.label === 'Budget & Planning' && <FaClipboardList className="inline mr-1 text-xs" />}
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Header;