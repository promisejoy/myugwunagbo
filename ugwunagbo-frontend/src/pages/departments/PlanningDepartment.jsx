import React from 'react';
import DepartmentLayout from './DepartmentLayout';
import { 
  FaClipboardList, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaCheckCircle, FaUserTie, FaEye, FaBullseye, FaProjectDiagram,
  FaChartLine, FaBuilding, FaRoad, FaLeaf, FaFileSignature,
  FaMapMarkedAlt, FaHandshake
} from 'react-icons/fa';

const PlanningDepartment = () => {
  return (
    <DepartmentLayout
      title="Planning Department"
      icon={<FaClipboardList />}
      description="Shaping the future of Ugwunagbo through strategic planning, sustainable development initiatives, and coordinated project implementation."
      color="linear-gradient(135deg, #006400, #008000)"
    >
      <div className="space-y-6">
        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-[#006400] to-[#008000] text-white p-6 rounded-xl text-center">
            <FaEye className="text-4xl mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-sm opacity-90">To make Ugwunagbo LGA a model of sustainable development through innovative planning and effective project implementation.</p>
          </div>
          <div className="bg-gradient-to-r from-[#006400] to-[#008000] text-white p-6 rounded-xl text-center">
            <FaBullseye className="text-4xl mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-sm opacity-90">To provide strategic direction, coordinate development projects, and ensure sustainable growth through participatory planning processes.</p>
          </div>
        </div>

        {/* Overview Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Department Overview</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              The Planning Department coordinates all development activities in Ugwunagbo LGA, 
              ensuring that projects align with the overall development goals and strategies of 
              the Local Government.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">15+</div>
                <div className="text-sm text-gray-500">Active Projects</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">10</div>
                <div className="text-sm text-gray-500">Communities Reached</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">85%</div>
                <div className="text-sm text-gray-500">Project Completion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Projects */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Ongoing Development Projects</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border-t-4 border-[#006400]">
                <h4 className="font-semibold text-gray-800">Road Infrastructure</h4>
                <p className="text-sm text-gray-600 mt-2">Construction of 15km rural access roads across 5 communities</p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-[#006400]">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-[#006400] h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-t-4 border-[#006400]">
                <h4 className="font-semibold text-gray-800">Water Supply</h4>
                <p className="text-sm text-gray-600 mt-2">Installation of boreholes in 10 underserved communities</p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-[#006400]">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-[#006400] h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-t-4 border-[#006400]">
                <h4 className="font-semibold text-gray-800">Market Development</h4>
                <p className="text-sm text-gray-600 mt-2">Modernization of Ugwunagbo Central Market</p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-[#006400]">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-[#006400] h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Planning Services</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: FaMapMarkedAlt, text: 'Physical and land use planning' },
                { icon: FaProjectDiagram, text: 'Development project coordination' },
                { icon: FaChartLine, text: 'Strategic planning and policy formulation' },
                { icon: FaBuilding, text: 'Building plan approval and monitoring' },
                { icon: FaRoad, text: 'Infrastructure planning and development' },
                { icon: FaLeaf, text: 'Environmental planning and management' },
                { icon: FaHandshake, text: 'Partnership and collaboration coordination' },
                { icon: FaFileSignature, text: 'Development control and enforcement' }
              ].map((service, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <service.icon className="text-[#006400]" />
                  <span className="text-gray-600">{service.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Contact & Procedures</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaMapMarkerAlt className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Planning Office</h4>
                <p className="text-sm text-gray-600">Planning & Development Block, Ugwunagbo LGA Secretariat</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaPhone className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Contact Numbers</h4>
                <p className="text-sm text-gray-600">+234 806 444 5555</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaEnvelope className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Email Addresses</h4>
                <p className="text-sm text-gray-600">planning@ugwunagbolga.gov.ng</p>
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

export default PlanningDepartment;