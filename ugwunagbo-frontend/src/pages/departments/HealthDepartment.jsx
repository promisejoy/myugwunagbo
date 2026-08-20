import React from 'react';
import DepartmentLayout from './DepartmentLayout';
import { 
  FaHeartbeat, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaHospital, FaClinicMedical, FaPumpMedical, FaUserMd, 
  FaShieldVirus, FaSyringe, FaAmbulance, FaCheckCircle,
  FaBaby, FaHeart, FaLungs, FaStethoscope, FaUserTie, FaAmbulance as FaAmbulanceIcon
} from 'react-icons/fa';

const HealthDepartment = () => {
  return (
    <DepartmentLayout
      title="Health Department"
      icon={<FaHeartbeat />}
      description="Dedicated to improving the health and well-being of Ugwunagbo residents through quality healthcare services, disease prevention, and health promotion."
      color="linear-gradient(135deg, #006400, #008000)"
    >
      <div className="space-y-6">
        {/* Emergency Alert */}
        <div className="bg-gradient-to-r from-[#006400] to-[#008000] text-white p-4 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 font-bold">
            <span className="text-2xl">🚨</span>
            <span>EMERGENCY MEDICAL SERVICES:</span>
            <span className="text-lg">+234 807 999 1111 (24/7 Ambulance Service)</span>
          </div>
        </div>

        {/* Healthcare Facilities */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Healthcare Facilities</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-[#006400]">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaHospital className="text-[#006400]" /> Ugwunagbo General Hospital
                </h4>
                <p className="text-sm text-gray-600 mt-2">Comprehensive medical services including emergency care, surgery, and maternity</p>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div><FaPhone className="inline mr-2 text-[#006400]" /> +234 802 333 4444</div>
                  <div><FaClock className="inline mr-2 text-[#006400]" /> 24/7 Emergency Services</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-[#006400]">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaClinicMedical className="text-[#006400]" /> Primary Healthcare Centers
                </h4>
                <p className="text-sm text-gray-600 mt-2">10 centers across communities providing basic healthcare and immunization</p>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div><FaMapMarkerAlt className="inline mr-2 text-[#006400]" /> All 10 Wards Covered</div>
                  <div><FaClock className="inline mr-2 text-[#006400]" /> 8:00 AM - 4:00 PM Daily</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-[#006400]">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaPumpMedical className="text-[#006400]" /> Maternal & Child Health Clinics
                </h4>
                <p className="text-sm text-gray-600 mt-2">Specialized care for pregnant women, nursing mothers, and children under 5</p>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div><FaBaby className="inline mr-2 text-[#006400]" /> Free Antenatal Services</div>
                  <div><FaSyringe className="inline mr-2 text-[#006400]" /> Immunization Every Wednesday</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Services */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Health Services</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FaUserMd className="text-[#006400]" /> Clinical Services
                </h3>
                <ul className="space-y-2">
                  {['General medical consultations', 'Maternal and child health', 'Cardiology and chronic care', 'Respiratory care'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-[#006400] text-xs" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FaShieldVirus className="text-[#006400]" /> Preventive Care
                </h3>
                <ul className="space-y-2">
                  {['Immunization programs', 'Disease surveillance', 'Hygiene education', 'Nutrition programs'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-[#006400] text-xs" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FaAmbulance className="text-[#006400]" /> Emergency Services
                </h3>
                <ul className="space-y-2">
                  {['24/7 Ambulance service', 'Emergency medical care', 'Emergency drug supply', 'Medical emergency hotline'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-[#006400] text-xs" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FaStethoscope className="text-[#006400]" /> Public Health
                </h3>
                <ul className="space-y-2">
                  {['Environmental health', 'Laboratory services', 'Pharmacy services', 'Health records'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-[#006400] text-xs" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Contact & Support</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaMapMarkerAlt className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Health Department</h4>
                <p className="text-sm text-gray-600">Health Services Block, Ugwunagbo LGA Secretariat</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaPhone className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Emergency Contacts</h4>
                <p className="text-sm text-gray-600">Ambulance: +234 807 999 1111</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaEnvelope className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Email Addresses</h4>
                <p className="text-sm text-gray-600">health@ugwunagbolga.gov.ng</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaClock className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Service Hours</h4>
                <p className="text-sm text-gray-600">General Hospital: 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
};

export default HealthDepartment;