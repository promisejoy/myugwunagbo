import React from 'react';
import DepartmentLayout from './DepartmentLayout';
import { 
  FaBalanceScale, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaUsers, FaFileContract, FaHandshake, FaChartLine, FaCalendarCheck, 
  FaArchive, FaComments
} from 'react-icons/fa';

const AdministrationDepartment = () => {
  return (
    <DepartmentLayout
      title="Administration Department"
      icon={<FaBalanceScale />}
      description="The central coordinating body of Ugwunagbo Local Government Area, responsible for policy implementation, administrative oversight, and overall governance coordination."
      color="linear-gradient(135deg, #006400, #008000)"
    >
      <div className="space-y-6">
        {/* Overview Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Department Overview</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              The Administration Department serves as the nerve center of Ugwunagbo LGA, 
              coordinating all administrative activities and ensuring seamless inter-departmental 
              collaboration. We are committed to efficient service delivery and transparent 
              governance processes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">15+</div>
                <div className="text-sm text-gray-500">Years of Service</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">50+</div>
                <div className="text-sm text-gray-500">Staff Members</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">24/7</div>
                <div className="text-sm text-gray-500">Service Availability</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Core Services</h2>
          </div>
          <div className="p-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: FaBalanceScale, text: 'Policy formulation and implementation' },
                { icon: FaUsers, text: 'Human resource management and development' },
                { icon: FaFileContract, text: 'Official documentation and record keeping' },
                { icon: FaHandshake, text: 'Inter-governmental relations coordination' },
                { icon: FaChartLine, text: 'Performance monitoring and evaluation' },
                { icon: FaCalendarCheck, text: 'Meeting and event coordination' },
                { icon: FaArchive, text: 'Archives and information management' },
                { icon: FaComments, text: 'Public relations and community engagement' }
              ].map((service, index) => (
                <li key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <service.icon className="text-[#006400]" />
                  <span className="text-gray-600">{service.text}</span>
                </li>
              ))}
            </ul>
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
                <h4 className="font-semibold">Office Location</h4>
                <p className="text-sm text-gray-600">Administration Block, Ugwunagbo LGA Secretariat</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaPhone className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Phone Numbers</h4>
                <p className="text-sm text-gray-600">+234 802 345 6789</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaEnvelope className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Email Addresses</h4>
                <p className="text-sm text-gray-600">admin@ugwunagbolga.gov.ng</p>
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

export default AdministrationDepartment;