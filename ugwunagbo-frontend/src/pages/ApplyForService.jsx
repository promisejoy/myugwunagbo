import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaFileAlt, FaClipboardList, FaSpinner, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const ApplyForService = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    description: ''
  });

  const serviceTypes = [
    'Birth Certificate',
    'Marriage Certificate',
    'Local Government of Origin',
    'Business Permit',
    'Building Plan Approval',
    'Tax Clearance Certificate',
    'Market Stall Permit',
    'Social Welfare',
    'Village Directory',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.submitApplication(formData);
      console.log('Application response:', response.data);
      
      // Generate application ID if not returned from server
      const appId = response.data?.id || generateApplicationId();
      setApplicationId(appId);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate application ID
  const generateApplicationId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `UGW-${timestamp}-${random}`.toUpperCase();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your application has been received. You will be contacted shortly.
          </p>
{applicationId && (
  <div className="bg-[#006400] text-white p-3 rounded-lg mb-4">
    <p className="text-sm font-semibold">Application ID:</p>
    <p className="text-lg font-mono">{applicationId}</p>
    <p className="text-xs text-[#ffcc00] mt-1">Please use this ID for payment reference</p>
  </div>
)}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-yellow-800 mb-2">Payment Instructions:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Bank: First Bank of Nigeria</li>
              <li>• Account: Ugwunagbo Local Government</li>
              <li>• Account Number: 3112345678</li>
              <li>• Amount: ₦5,000.00</li>
              <li>• Reference: Use your Application ID above</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/services')}
              className="flex-1 bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Back to Services
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Print Instructions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#006400] to-[#008000] p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center">
              <FaClipboardList className="mr-3" />
              Apply for Service
            </h1>
            <p className="text-[#ffcc00]/80 text-sm mt-1">
              Fill in the form below to apply for any of our services
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaUser className="inline mr-2 text-[#006400]" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline mr-2 text-[#006400]" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaPhone className="inline mr-2 text-[#006400]" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaFileAlt className="inline mr-2 text-[#006400]" />
                Service Type *
              </label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all bg-white"
                required
              >
                <option value="">Select a service</option>
                {serviceTypes.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                placeholder="Provide details about your application"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyForService;