import React from 'react';
import DepartmentLayout from './DepartmentLayout';
import { 
  FaGavel, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaCheckCircle, FaUserTie, FaBalanceScale, FaFileContract,
  FaHandshake, FaUsers
} from 'react-icons/fa';

const JudiciaryDepartment = () => {
  return (
    <DepartmentLayout
      title="Judiciary Department"
      icon={<FaGavel />}
      description="Legal affairs, dispute resolution, and justice administration in Ugwunagbo LGA"
      color="linear-gradient(135deg, #006400, #008000)"
    >
      <div className="space-y-6">
        {/* Overview Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">About the Judiciary Department</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              The Judiciary Department of Ugwunagbo Local Government Area is responsible for administering justice, 
              resolving disputes, and upholding the rule of law within our jurisdiction. We work to ensure fair 
              and equitable access to justice for all residents.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">100%</div>
                <div className="text-sm text-gray-500">Case Resolution Rate</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">500+</div>
                <div className="text-sm text-gray-500">Cases Handled</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">24h</div>
                <div className="text-sm text-gray-500">Response Time</div>
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
                { icon: FaBalanceScale, text: 'Civil dispute resolution' },
                { icon: FaGavel, text: 'Customary court proceedings' },
                { icon: FaFileContract, text: 'Legal advisory services' },
                { icon: FaUsers, text: 'Marriage registration and dissolution' },
                { icon: FaHandshake, text: 'Land dispute mediation' },
                { icon: FaUsers, text: 'Family law matters' },
                { icon: FaBalanceScale, text: 'Small claims adjudication' }
              ].map((service, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <service.icon className="text-[#006400]" />
                  <span className="text-gray-600">{service.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Personnel */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Key Personnel</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaUserTie className="text-3xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Hon. Justice Chika Okoro</h4>
                <p className="text-sm text-gray-600">Head of Judiciary</p>
                <p className="text-sm text-gray-500 mt-1">LL.B, BL</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaUserTie className="text-3xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Barr. Emeka Okafor</h4>
                <p className="text-sm text-gray-600">Chief Magistrate</p>
                <p className="text-sm text-gray-500 mt-1">LL.M, BL</p>
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
                <p className="text-sm text-gray-600">Judiciary Department, Ugwunagbo LGA Secretariat</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaPhone className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Phone</h4>
                <p className="text-sm text-gray-600">+234 803 456 7890</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaEnvelope className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-gray-600">judiciary@ugwunagbolga.gov.ng</p>
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

export default JudiciaryDepartment;