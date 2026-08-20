import React from 'react';
import DepartmentLayout from './DepartmentLayout';
import { 
  FaShieldAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaCheckCircle, FaUserTie, FaTasks, FaHandshake, 
  FaUsers, FaShieldVirus, FaExclamationTriangle
} from 'react-icons/fa';

const SecurityDepartment = () => {
  return (
    <DepartmentLayout
      title="Security Department"
      icon={<FaShieldAlt />}
      description="Ensuring public safety, law enforcement coordination, and community security"
      color="linear-gradient(135deg, #006400, #008000)"
    >
      <div className="space-y-6">
        {/* Emergency Alert */}
        <div className="bg-gradient-to-r from-[#006400] to-[#008000] text-white p-4 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 font-bold">
            <FaExclamationTriangle className="text-2xl" />
            <span>EMERGENCY CONTACT:</span>
            <span className="text-lg">+234 807 654 3210 (24/7)</span>
          </div>
        </div>

        {/* Overview Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">About the Security Department</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              The Security Department of Ugwunagbo LGA is dedicated to maintaining law and order, 
              protecting lives and properties, and ensuring a safe environment for all residents. 
              We coordinate with various security agencies to provide comprehensive security coverage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">24/7</div>
                <div className="text-sm text-gray-500">Security Patrol</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">50+</div>
                <div className="text-sm text-gray-500">Security Personnel</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">100%</div>
                <div className="text-sm text-gray-500">Community Coverage</div>
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
                { icon: FaShieldAlt, text: '24/7 security patrols' },
                { icon: FaShieldVirus, text: 'Crime prevention and investigation' },
                { icon: FaUsers, text: 'Community policing initiatives' },
                { icon: FaTasks, text: 'Security threat assessment' },
                { icon: FaHandshake, text: 'Conflict resolution and mediation' },
                { icon: FaCheckCircle, text: 'Traffic control and management' },
                { icon: FaUsers, text: 'Security awareness programs' },
                { icon: FaExclamationTriangle, text: 'Emergency response coordination' }
              ].map((service, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <service.icon className="text-[#006400]" />
                  <span className="text-gray-600">{service.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Partners */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Security Partners</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="font-semibold text-gray-800">Nigeria Police Force</h4>
                <p className="text-sm text-gray-600">Ugwunagbo Police Division</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="font-semibold text-gray-800">Nigerian Security and Civil Defence Corps</h4>
                <p className="text-sm text-gray-600">Civil Defence Unit</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="font-semibold text-gray-800">Vigilante Group</h4>
                <p className="text-sm text-gray-600">Community Security Volunteers</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="font-semibold text-gray-800">Neighborhood Watch</h4>
                <p className="text-sm text-gray-600">Community Policing Initiative</p>
              </div>
            </div>
          </div>
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
                <p className="text-sm text-gray-600">Security Department, Ugwunagbo LGA Secretariat</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaPhone className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Emergency Phone</h4>
                <p className="text-sm text-gray-600">+234 807 654 3210</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaEnvelope className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-gray-600">security@ugwunagbolga.gov.ng</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaClock className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Working Hours</h4>
                <p className="text-sm text-gray-600">Open 24 hours daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
};

export default SecurityDepartment;