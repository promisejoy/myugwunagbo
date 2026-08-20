import React from 'react';
import { Link } from 'react-router-dom';
import { FaIdCard, FaHome, FaHandHoldingUsd, FaMapMarkedAlt, FaArrowRight, FaClipboardList } from 'react-icons/fa';

const ServicesPage = () => {
  const services = [
    {
      icon: FaIdCard,
      title: 'Civil Registration',
      description: 'Birth, marriage, and Local Government of Origin registration services for all residents.',
      color: 'text-blue-600'
    },
    {
      icon: FaHome,
      title: 'Revenue Collection',
      description: 'Payment of taxes, levies, and other revenue obligations to the local government.',
      color: 'text-green-600'
    },
    {
      icon: FaHandHoldingUsd,
      title: 'Social Welfare',
      description: 'Support programs for vulnerable groups including women, children, and the elderly.',
      color: 'text-purple-600'
    },
    {
      icon: FaMapMarkedAlt,
      title: 'Villages Directory',
      description: 'Explore the list of villages in Ugwunagbo Local Government Area.',
      color: 'text-orange-600'
    }
  ];

  return (
    <div>
      <section className="bg-[#006400] text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-[#ffcc00] max-w-3xl mx-auto">
            Committed to providing quality services to all residents of Ugwunagbo LGA
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#006400]">
                  <div className={`text-5xl ${service.color} mb-4`}>
                    <Icon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
          
          {/* Single Apply Now Button at the bottom */}
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
    </div>
  );
};

export default ServicesPage;