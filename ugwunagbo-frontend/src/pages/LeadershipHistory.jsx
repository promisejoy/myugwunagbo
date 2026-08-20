import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUserTie, FaCalendarAlt, FaHistory, FaUsers, FaBuilding, FaHandshake } from 'react-icons/fa';

const LeadershipHistory = () => {
  const leadershipHistory = [
    {
      period: '1996 - 1999',
      title: 'Pioneer Administration',
      description: 'The first leadership team after the creation of Ugwunagbo LGA in 1996, led by the pioneer Chairman. This administration focused on establishing the local government structure and basic administrative framework.'
    },
    {
      period: '1999 - 2003',
      title: 'Democratic Transition',
      description: 'Following Nigeria\'s return to civilian rule in 1999, this administration oversaw the transition to democratic governance, focusing on community development and infrastructure.'
    },
    {
      period: '2003 - 2007',
      title: 'Infrastructure Development',
      description: 'This period saw significant investment in road construction, market development, and the establishment of primary healthcare facilities across the LGA.'
    },
    {
      period: '2007 - 2011',
      title: 'Agricultural Renaissance',
      description: 'Focus on agricultural development, including farmer support programs, establishment of agricultural cooperatives, and food security initiatives.'
    },
    {
      period: '2011 - 2015',
      title: 'Modernization Era',
      description: 'Implementation of modern governance practices, ICT integration, and expansion of social services including education and youth development programs.'
    },
    {
      period: '2015 - 2019',
      title: 'Community Empowerment',
      description: 'Emphasis on community-based projects, women empowerment, youth employment, and cultural preservation initiatives.'
    },
    {
      period: '2019 - Present',
      title: 'Sustainable Development',
      description: 'Current administration focusing on sustainable development, digital transformation, improved service delivery, and inclusive governance.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006400] to-[#008000] text-white py-16">
        <div className="container-custom">
          <div className="text-center">
            <FaHistory className="text-5xl mx-auto mb-4 text-[#ffcc00]" />
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Leadership History</h1>
            <p className="text-lg text-[#ffcc00]/80 max-w-2xl mx-auto">
              The journey of Ugwunagbo Local Government through the years
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaUserTie className="text-[#006400] mr-3" />
            A Legacy of Service
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Since its creation in 1996, Ugwunagbo Local Government Area has been led by dedicated 
            individuals committed to the development and progress of the community. Each administration 
            has contributed to building the foundation for a prosperous and thriving local government.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 bg-[#006400] h-full"></div>

          {leadershipHistory.map((item, index) => (
            <div key={index} className={`relative flex flex-col md:flex-row items-start mb-12 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}>
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#ffcc00] rounded-full border-4 border-[#006400] z-10"></div>

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-5/12 ${
                index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
              }`}>
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#006400]">
                  <div className="flex items-center gap-2 text-[#006400] mb-2">
                    <FaCalendarAlt className="text-sm" />
                    <span className="text-sm font-semibold">{item.period}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Milestones */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaBuilding className="text-[#006400] mr-3" />
            Key Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#006400]">
              <h4 className="font-bold text-gray-800">1996</h4>
              <p className="text-gray-600 text-sm">Creation of Ugwunagbo LGA</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#006400]">
              <h4 className="font-bold text-gray-800">1999</h4>
              <p className="text-gray-600 text-sm">First Democratic Elections</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#006400]">
              <h4 className="font-bold text-gray-800">2005</h4>
              <p className="text-gray-600 text-sm">Establishment of Health Centers</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#006400]">
              <h4 className="font-bold text-gray-800">2010</h4>
              <p className="text-gray-600 text-sm">Agricultural Development Programs</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#006400]">
              <h4 className="font-bold text-gray-800">2015</h4>
              <p className="text-gray-600 text-sm">Youth and Women Empowerment</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#006400]">
              <h4 className="font-bold text-gray-800">2020</h4>
              <p className="text-gray-600 text-sm">Digital Transformation Initiative</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link 
            to="/about" 
            className="flex items-center justify-center gap-2 bg-[#006400] hover:bg-[#005a00] text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            <FaArrowLeft /> Back to About
          </Link>
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            <FaHandshake /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeadershipHistory;