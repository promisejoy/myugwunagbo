import React from 'react';
import DepartmentLayout from './DepartmentLayout';
import { 
  FaMoneyBillWave, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaFileInvoiceDollar, FaCalculator, FaHandHoldingUsd, FaChartPie,
  FaSearchDollar, FaReceipt, FaUserTie, FaCheckCircle
} from 'react-icons/fa';

const FinanceDepartment = () => {
  return (
    <DepartmentLayout
      title="Finance Department"
      icon={<FaMoneyBillWave />}
      description="Managing the financial resources of Ugwunagbo LGA with transparency, accountability, and fiscal responsibility to drive sustainable development."
      color="linear-gradient(135deg, #006400, #008000)"
    >
      <div className="space-y-6">
        {/* Overview Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Financial Stewardship</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              The Finance Department is responsible for the prudent management of public funds, 
              ensuring proper budgeting, accounting, and financial reporting in accordance with 
              national and international standards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">98.5%</div>
                <div className="text-sm text-gray-500">Budget Execution Rate</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">₦2.5B</div>
                <div className="text-sm text-gray-500">Annual Budget</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">24h</div>
                <div className="text-sm text-gray-500">Payment Processing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Financial Services</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FaFileInvoiceDollar className="text-[#006400]" /> Revenue Collection
                </h3>
                <ul className="space-y-2">
                  {['Tax assessment and collection', 'Business permits and licenses', 'Property rate collection', 'Market fees and tolls'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-[#006400] text-xs" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FaCalculator className="text-[#006400]" /> Budget & Planning
                </h3>
                <ul className="space-y-2">
                  {['Annual budget preparation', 'Financial planning and forecasting', 'Expenditure control and monitoring', 'Performance budgeting'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-[#006400] text-xs" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FaHandHoldingUsd className="text-[#006400]" /> Disbursements
                </h3>
                <ul className="space-y-2">
                  {['Salary and wage payments', 'Contractor payments', 'Pension administration', 'Grant disbursements'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-[#006400] text-xs" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FaChartPie className="text-[#006400]" /> Accounting & Reporting
                </h3>
                <ul className="space-y-2">
                  {['Financial statement preparation', 'Audit coordination', 'Internal control systems', 'Financial compliance'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-[#006400] text-xs" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
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
                <h4 className="font-semibold">Mr. Chidi Okonkwo</h4>
                <p className="text-sm text-gray-600">Director of Finance</p>
                <p className="text-sm text-gray-500 mt-1">M.Sc. Accounting, ACA</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaUserTie className="text-3xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Mrs. Ngozi Eze</h4>
                <p className="text-sm text-gray-600">Assistant Director, Accounts</p>
                <p className="text-sm text-gray-500 mt-1">B.Sc. Accounting, ACCA</p>
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
                <h4 className="font-semibold">Finance Office</h4>
                <p className="text-sm text-gray-600">Finance Block, Ugwunagbo LGA Secretariat</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaPhone className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Contact Numbers</h4>
                <p className="text-sm text-gray-600">+234 805 111 2222</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaEnvelope className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Email Addresses</h4>
                <p className="text-sm text-gray-600">finance@ugwunagbolga.gov.ng</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaClock className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Service Hours</h4>
                <p className="text-sm text-gray-600">Monday - Friday: 8:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
};

export default FinanceDepartment;