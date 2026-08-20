import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLandmark, FaMapMarkedAlt, FaGlobeAfrica, FaChartLine, FaDrum,
  FaUsers, FaArrowLeft, FaMapPin, FaArrowRight, FaHome
} from 'react-icons/fa';

const AboutPage = () => {
  const lgas = [
    { name: 'Aba North', description: 'Commercial & industrial center' },
    { name: 'Aba South', description: 'Commercial & industrial hub' },
    { name: 'Arochukwu', description: 'Historical & cultural center' },
    { name: 'Bende', description: 'Agricultural hub' },
    { name: 'Ikwuano', description: 'Educational center' },
    { name: 'Isiala Ngwa North', description: 'Agricultural zone' },
    { name: 'Isiala Ngwa South', description: 'Agricultural zone' },
    { name: 'Isuikwuato', description: 'Agricultural zone' },
    { name: 'Obingwa', description: 'Mixed economy' },
    { name: 'Ohafia', description: 'Cultural heritage zone' },
    { name: 'Osisioma Ngwa', description: 'Industrial area' },
    { name: 'Ugwunagbo', description: 'Mixed urban-rural economy' },
    { name: 'Ukwa East', description: 'Riverine & agricultural area' },
    { name: 'Ukwa West', description: 'Riverine & oil-producing area' },
    { name: 'Umuahia North', description: 'State capital & administrative center' },
    { name: 'Umuahia South', description: 'Administrative & residential area' },
    { name: 'Umu Nneochi', description: 'Agricultural & mining area' },
  ];

  const villages = [
    'Akanu', 'Asa Unumka', 'Umuakwu', 'Umugo', 'Obegu', 'Amapu'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006400] to-[#008000] text-white py-12 md:py-16">
        <div className="container-custom">
          <div className="text-center">
            <FaLandmark className="text-5xl mx-auto mb-4 text-[#ffcc00]" />
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Complete History of Ugwunagbo LGA
            </h1>
            <p className="text-lg text-[#ffcc00]/80 max-w-2xl mx-auto">
              A comprehensive account from Abia State creation to present leadership
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 mb-8">
          {/* Section 1: Abia State History */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006400] mb-4 pb-2 border-b-2 border-[#ffcc00] flex items-center">
              <FaLandmark className="mr-2 text-[#ffcc00]" />
              History of Abia State
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg text-justify">
              Abia State is one of the 36 states in Nigeria, located in the
              southeastern part of the country. The state was created on
              <strong> August 27, 1991</strong> during the military regime of
              General Ibrahim Babangida. It was carved out of the former Imo
              State and derives its name from the acronym of the four main
              groups of people in the state at creation: <strong>A</strong>ba,
              <strong>B</strong>ende, <strong>I</strong>suikwuato, and
              <strong>A</strong>fikpo.
            </p>

            {/* Highlight Box */}
            <div className="bg-green-50 border-l-4 border-[#006400] p-4 my-4 rounded-r-lg">
              <h3 className="text-lg font-bold text-[#006400] mb-2">Key Facts About Abia State</h3>
              <p className="text-gray-700"><strong>Capital:</strong> Umuahia</p>
              <p className="text-gray-700"><strong>Commercial Hub:</strong> Aba (often called "Japan of Africa")</p>
              <p className="text-gray-700"><strong>Geopolitical Zone:</strong> South East</p>
              <p className="text-gray-700"><strong>Major Ethnic Groups:</strong> Igbo (predominant)</p>
              <p className="text-gray-700"><strong>Number of LGAs:</strong> 17 Local Government Areas</p>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">
              The 17 Local Government Areas of Abia State
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lgas.map((lga, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#006400] hover:shadow-md transition-shadow hover:bg-gray-100">
                  <h4 className="font-bold text-[#006400]">{lga.name}</h4>
                  <p className="text-gray-600 text-sm">{lga.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Creation of Ugwunagbo LGA */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006400] mb-4 pb-2 border-b-2 border-[#ffcc00] flex items-center">
              <FaMapMarkedAlt className="mr-2 text-[#ffcc00]" />
              Creation of Ugwunagbo Local Government Area
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg text-justify">
              Ugwunagbo Local Government Area was created in
              <strong> 1996</strong> during the military administration of
              General Sani Abacha, as part of the nationwide local government
              creation exercise that increased the number of LGAs in Nigeria
              from 589 to 774.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg text-justify">
              The creation of Ugwunagbo LGA was a significant milestone for the
              people, as it provided:
            </p>

           

            <div className="bg-blue-50 border-l-4 border-[#006400] p-4 my-4 rounded-r-lg">
              <h3 className="text-lg font-bold text-[#006400] mb-2">Why Ugwunagbo was Created</h3>
              <p className="text-gray-700"><strong>1. Administrative Convenience:</strong> To bring government closer to the people of ugwunagbo</p>
              <p className="text-gray-700"><strong>2. Developmental Needs:</strong> To address specific infrastructural and social needs</p>
              <p className="text-gray-700"><strong>3. Cultural Identity:</strong> To preserve and promote the unique cultural heritage</p>
              <p className="text-gray-700"><strong>4. Political Representation:</strong> To ensure adequate representation in state affairs</p>
            </div>

            <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
              Before its creation as an independent LGA, Ugwunagbo was part of
              the larger Obingwa Local Government Area. The creation followed
              extensive consultations, petitions, and demonstrations by the
              people seeking self-determination and development.
            </p>
          </div>

          {/* Section 3: Geographical and Demographic Profile */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006400] mb-4 pb-2 border-b-2 border-[#ffcc00] flex items-center">
              <FaGlobeAfrica className="mr-2 text-[#ffcc00]" />
              Geographical and Demographic Profile
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg text-justify">
              <strong>Location:</strong> Ugwunagbo is situated in the southern
              part of Abia State, sharing boundaries with several LGAs including
              Obingwa and Ukwa West.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg text-justify">
              <strong>Major Towns and Villages:</strong> The LGA comprises
              several communities including:
            </p>
            <ul className="list-none pl-4 mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {villages.map((village, index) => (
                <li key={index} className="flex items-center py-1">
                  <FaMapPin className="text-[#006400] mr-2" />
                  <strong className="text-gray-700">{village}</strong>
                </li>
              ))}
            </ul>

            <div className="my-4">
              <Link 
                to="/villages" 
                className="inline-flex items-center bg-[#006400] hover:bg-[#005a00] text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
              >
                View Villages Directory
                <FaArrowRight className="ml-2" />
              </Link>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg text-justify">
              <strong>Population:</strong> According to the 2006 census,
              Ugwunagbo had an estimated population of 70,000 people. Current
              estimates suggest a population of over 100,000 inhabitants.
            </p>

            <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
              <strong>Economic Activities:</strong> The people are predominantly
              farmers, with major crops including cassava, yam, maize, and
              vegetables. There's also significant engagement in trading, civil
              service, and small-scale industries.
            </p>
          </div>

          {/* Section 4: Developmental Milestones */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006400] mb-4 pb-2 border-b-2 border-[#ffcc00] flex items-center">
              <FaChartLine className="mr-2 text-[#ffcc00]" />
              Developmental Milestones
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg text-justify">
              Since its creation, Ugwunagbo LGA has witnessed significant
              development in various sectors:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="bg-green-50 border-l-4 border-[#006400] p-4 rounded-r-lg">
                <h4 className="font-bold text-[#006400]">🏫 Education</h4>
                <p className="text-gray-600 text-sm">Establishment of primary and secondary schools</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-[#006400] p-4 rounded-r-lg">
                <h4 className="font-bold text-[#006400]">🏥 Healthcare</h4>
                <p className="text-gray-600 text-sm">Development of health centers and primary healthcare facilities</p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-[#006400] p-4 rounded-r-lg">
                <h4 className="font-bold text-[#006400]">🌾 Agriculture</h4>
                <p className="text-gray-600 text-sm">Support for farmers through various agricultural programs</p>
              </div>
              <div className="bg-red-50 border-l-4 border-[#006400] p-4 rounded-r-lg">
                <h4 className="font-bold text-[#006400]">🛡️ Security</h4>
                <p className="text-gray-600 text-sm">Establishment of security networks for community safety</p>
              </div>
            </div>
          </div>

          {/* Section 5: Cultural Heritage */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006400] mb-4 pb-2 border-b-2 border-[#ffcc00] flex items-center">
              <FaDrum className="mr-2 text-[#ffcc00]" />
              Cultural Heritage
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg text-justify">
              Ugwunagbo people are part of the larger Igbo ethnic group with
              rich cultural practices:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-bold text-[#006400]">🎭 Festivals</h4>
                <p className="text-gray-600 text-sm">New Yam Festival (Iri Ji), cultural dances</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-bold text-[#006400]">👑 Traditional Rulers</h4>
                <p className="text-gray-600 text-sm">Council of Traditional Rulers (Ndị Eze)</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <h4 className="font-bold text-[#006400]">🗣️ Language</h4>
                <p className="text-gray-600 text-sm">Igbo language with local dialect variations</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <h4 className="font-bold text-[#006400]">🍲 Cuisine</h4>
                <p className="text-gray-600 text-sm">Traditional dishes including Ofe Akwu, Ugba, and Abacha</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - FIXED */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 my-8">
          <Link 
            to="/leadership-history" 
            className="flex items-center justify-center gap-2 bg-[#006400] hover:bg-[#005a00] text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            <FaUsers /> View Leadership History
          </Link>
          <Link 
            to="/villages" 
            className="flex items-center justify-center gap-2 bg-[#ffcc00] hover:bg-[#e6b800] text-[#006400] font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            <FaMapMarkedAlt /> View Villages Directory
          </Link>
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            <FaHome /> Back to Home
          </Link>
        </div>

        {/* Back Button - Goes to Homepage About Section */}
        <div className="text-center">
          <Link 
            to="/#about" 
            className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            <FaArrowLeft /> Back to About Section
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;