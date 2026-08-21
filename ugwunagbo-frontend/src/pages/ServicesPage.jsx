import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaIdCard, FaHome, FaHandHoldingUsd, FaMapMarkedAlt, FaArrowRight, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import { api } from '../api/client';

const ServicesPage = () => {
  const [servicePrices, setServicePrices] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await api.getServicePrices();
        if (response.data) {
          setServicePrices(response.data);
        }
      } catch (error) {
        console.error('Error fetching service prices:', error);
      }
    };
    fetchPrices();
  }, []);

  const services = [
    {
      icon: FaIdCard,
      title: 'Civil Registration',
      description: 'Birth, marriage, and Local Government of Origin registration services for all residents.',
      color: 'text-blue-600',
      serviceType: 'Birth Certificate'
    },
    {
      icon: FaHome,
      title: 'Revenue Collection',
      description: 'Payment of taxes, levies, and other revenue obligations to the local government.',
      color: 'text-green-600',
      serviceType: 'Tax Clearance Certificate'
    },
    {
      icon: FaHandHoldingUsd,
      title: 'Social Welfare',
      description: 'Support programs for vulnerable groups including women, children, and the elderly.',
      color: 'text-purple-600',
      serviceType: 'Social Welfare'
    },
   
  ];

  const getPrice = (serviceType) => {
    if (servicePrices && servicePrices[serviceType]) {
      return servicePrices[serviceType].amount || 0;
    }
    return 0;
  };

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
              const price = getPrice(service.serviceType);
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#006400]">
                  <div className={`text-5xl ${service.color} mb-4`}>
                    <Icon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                  {price > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#006400] bg-green-50 px-3 py-1.5 rounded-full inline-flex">
                      <FaMoneyBillWave className="text-[#006400]" />
                      <span>Fee: ₦{price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
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