import React from 'react';
import DepartmentLayout from './DepartmentLayout';
import { 
  FaVoteYea, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaCheckCircle, FaUserTie, FaTasks, FaExclamationTriangle,
  FaUsers, FaIdCard, FaBalanceScale
} from 'react-icons/fa';

const INECDepartment = () => {
  return (
    <DepartmentLayout
      title="INEC Department"
      icon={<FaVoteYea />}
      description="Independent National Electoral Commission - Voter registration and electoral processes"
      color="linear-gradient(135deg, #006400, #008000)"
    >
      <div className="space-y-6">
        {/* Overview Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">About the INEC Department</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              The INEC (Independent National Electoral Commission) Department in Ugwunagbo LGA is responsible 
              for conducting free, fair, and credible elections. We manage voter registration, election 
              materials distribution, and ensure electoral integrity within our local government area.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">50K+</div>
                <div className="text-sm text-gray-500">Registered Voters</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">100+</div>
                <div className="text-sm text-gray-500">Polling Units</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">98%</div>
                <div className="text-sm text-gray-500">Voter Turnout</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Our Services</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: FaIdCard, text: 'Voter registration and card collection' },
                { icon: FaUsers, text: 'Continuous Voter Registration (CVR)' },
                { icon: FaTasks, text: 'Voter education and awareness' },
                { icon: FaCheckCircle, text: 'Election monitoring and supervision' },
                { icon: FaUsers, text: 'Political party registration assistance' },
                { icon: FaCheckCircle, text: 'Election result collation' },
                { icon: FaBalanceScale, text: 'Electoral dispute resolution' }
              ].map((service, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <service.icon className="text-[#006400]" />
                  <span className="text-gray-600">{service.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-[#ffcc00] p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
            <FaExclamationTriangle className="text-[#006400]" /> Important Notice
          </h4>
          <p className="text-sm text-yellow-700 mt-2">
            Voter registration is continuous. Visit our office with a valid means of identification 
            (National ID, Driver's License, International Passport, or Old Voter's Card) to register 
            or update your details.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaMapMarkerAlt className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Address</h4>
                <p className="text-sm text-gray-600">INEC Office, Ugwunagbo LGA Secretariat</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaPhone className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Phone</h4>
                <p className="text-sm text-gray-600">+234 802 345 6789</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaEnvelope className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-gray-600">inec.ugwunagbo@inec.gov.ng</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaClock className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Working Hours</h4>
                <p className="text-sm text-gray-600">Monday - Friday: 8:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
};

export default INECDepartment;